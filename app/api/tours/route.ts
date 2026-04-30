import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ratelimit } from "../../lib/ratelimit";
import type { Prisma } from "@prisma/client";

const getMulti = (sp: URLSearchParams, key: string) => {
  return [
    ...sp.getAll(key),
    ...sp.getAll(`${key}[]`)
  ].filter(Boolean);
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
console.log(searchParams," I am the search param")
  const version = (await redis.get<string>("tours:version")) || "1";
  const cacheKey = `tours:v${version}:${searchParams.toString()}`;

  try {
    // rate limit
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    // cache
    const cached = await redis.get(cacheKey);
    console.log(cacheKey," ",cached)
    if (cached) return Response.json(cached);

    // cursor
    const cursor = searchParams.get("cursor");

    // limit
    const limitRaw = Number(searchParams.get("limit")) || 10;
    const limit = Math.min(Math.max(limitRaw, 1), 50);

    // filters
    const search = searchParams.get("search") || "";
    const regions = getMulti(searchParams, "region");
    const adventureStyles = getMulti(searchParams, "adventureStyle");
    const languages = getMulti(searchParams, "language");

    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 100000;

    const minDuration = Number(searchParams.get("minDuration")) || 1;
    const maxDuration = Number(searchParams.get("maxDuration")) || 365;

    const startDate = searchParams.get("startDate");
    const parsedDate = startDate ? new Date(startDate) : null;

    // sorting
    const sortBy = searchParams.get("sortBy") || "most-popular";

    const sortMap: Record<string, Prisma.TourOrderByWithRelationInput> = {
      "most-popular": { reviews: "desc" },
      "rating-high": { rating: "desc" },
      "rating-low": { rating: "asc" },
      "price-low": { price: "asc" },
      "price-high": { price: "desc" },
      "duration-short": { duration: "asc" },
      "duration-long": { duration: "desc" },
    };

    const orderBy = sortMap[sortBy] || { createdAt: "desc" };

    // where (clean)
    const where: Prisma.TourWhereInput = {
      AND: [
        ...(search
          ? [{ title: { contains: search, mode: "insensitive" } }]
          : []),

        ...(regions.length > 0
          ? [{ region: { in: regions } }]
          : []),

        {
          price: { gte: minPrice, lte: maxPrice },
        },

        {
          duration: { gte: minDuration, lte: maxDuration },
        },

        ...(adventureStyles.length > 0
          ? [{ adventureStyle: { hasSome: adventureStyles } }]
          : []),

        ...(languages.length > 0
          ? [{ language: { hasSome: languages } }]
          : []),

        ...(parsedDate
          ? [{ startDate: { gte: parsedDate } }]
          : []),
      ],
    };

    // query
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
      prisma.tour.count({where}), 
    ])

    // cursor logic
    const hasNextPage = tours.length > limit;
    const data = hasNextPage ? tours.slice(0, limit) : tours;
console.log(data, "datas are here ")
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

    await redis.set(cacheKey, response, { ex: 60 });

    return Response.json(response);

  } catch (error) {
    console.error(error);


    const cached = await redis.get(cacheKey);
    console.log(cached)
    if (cached) return Response.json(cached);

    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}