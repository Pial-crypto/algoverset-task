import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ratelimit } from "../../lib/ratelimit";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";


const getMulti = (sp: URLSearchParams, key: string): string[] => {
  return [
    ...sp.getAll(key),
    ...sp.getAll(`${key}[]`)
  ].filter(Boolean);
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // rate limit
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const ua = req.headers.get("user-agent") || "";
  const rlKey = `${ip}:${ua}`;
  const { success } = await ratelimit.limit(rlKey);

  if (!success) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  // cache version for invalidation
  const version = (await redis.get<string>("tours:version")) || "1";

  // stable cache key (params sorted)
  const params = [...searchParams.entries()]
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const cacheKey = `tours:v${version}:${params}`;

  try {
 
    const cached = await redis.get(cacheKey);
    if (cached) {
    console.log("I am cache" ,cacheKey,cached)
      return Response.json(cached, {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        },
      });
    }


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

    
    const conditions: Prisma.TourWhereInput[] = [];

    if (search) {
      conditions.push({
        title: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      });
    }

    if (regions.length) {
      conditions.push({ region: { in: regions } });
    }

    conditions.push({
      price: { gte: minPrice, lte: maxPrice },
    });

    conditions.push({
      duration: { gte: minDuration, lte: maxDuration },
    });

    if (adventureStyles.length) {
      conditions.push({
        adventureStyle: { hasSome: adventureStyles },
      });
    }

    if (languages.length) {
      conditions.push({
        language: { hasSome: languages },
      });
    }

    if (parsedDate) {
      conditions.push({
        startDate: { gte: parsedDate },
      });
    }

    const where: Prisma.TourWhereInput = {
      AND: conditions,
    };

 
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

    // cursor logic
    const hasNextPage = tours.length > limit;
    const data = hasNextPage ? tours.slice(0, limit) : tours;

    const nextCursor = hasNextPage
      ? data[data.length - 1].id
      : null;

      console.log(" i am the data", data)

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

    //cache
    await redis.set(cacheKey, response, {
      ex: 60 + Math.floor(Math.random() * 30),
    });

 //CDN header
    return Response.json(response, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });

  } catch (error) {
    console.error(error);

  
    const cached = await redis.get(cacheKey);
    console.log("cache",cached)
    if (cached) {
      return Response.json(cached, {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        },
      });
    }

    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}