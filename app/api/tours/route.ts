import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ratelimit } from "../../lib/ratelimit";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const version = (await redis.get<string>("tours:version")) || "1";
  const cacheKey = `tours:v${version}:${searchParams.toString()}`;
  try {
 

    //  Rate limit
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    //  Cache
  
  //  const cacheKey = `tours:v${version}:${searchParams.toString()}`;

    const cached = await redis.get(cacheKey);
    if (cached) return Response.json(cached);

    //  Cursor
    const cursor = searchParams.get("cursor");

    //  Limit
    const limitRaw = Number(searchParams.get("limit")) || 10;
    const limit = Math.min(Math.max(limitRaw, 1), 50);

    //  Filters
    const search = searchParams.get("search") || "";
    const region = searchParams.get("region");

    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 100000;

    const minDuration = Number(searchParams.get("minDuration")) || 1;
    const maxDuration = Number(searchParams.get("maxDuration")) || 365;

    const sortBy = searchParams.get("sortBy") || "most-popular";

    //  Sorting
    let orderBy: any = { createdAt: "desc" };

    if (sortBy === "price-low") orderBy = { price: "asc" };
    if (sortBy === "price-high") orderBy = { price: "desc" };
    if (sortBy === "rating-high") orderBy = { rating: "desc" };
    if (sortBy === "rating-low") orderBy = { rating: "asc" };
    if (sortBy === "duration-short") orderBy = { duration: "asc" };
    if (sortBy === "duration-long") orderBy = { duration: "desc" };

    //  Where
    const where: any = {
      AND: [
        search ? { title: { contains: search, mode: "insensitive" } } : {},
        region ? { region } : {},
        { price: { gte: minPrice, lte: maxPrice } },
        { duration: { gte: minDuration, lte: maxDuration } },
      ],
    };

    //  Query (cursor + count together)
    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        take: limit + 1,
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1,
        }),
        orderBy,
      }),
      prisma.tour.count({ where }),
    ]);

    const hasNextPage = tours.length > limit;
    const data = hasNextPage ? tours.slice(0, limit) : tours;

    const nextCursor = hasNextPage
      ? data[data.length - 1].id
      : null;

    const response = {
      success: true,
      data,
      meta: {
        hasNextPage,
        nextCursor,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    //  Cache save
    await redis.set(cacheKey, response, { ex: 60 });

    return Response.json(response);

  } catch (error) {
    console.error(error);
    console.error("DB ERROR:", error);

   
    const cached = await redis.get(cacheKey);

    if (cached) {
      return Response.json(cached);
    }
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}