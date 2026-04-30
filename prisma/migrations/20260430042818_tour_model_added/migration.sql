-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviews" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION,
    "duration" INTEGER NOT NULL,
    "experiences" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT[],
    "ageGroup" TEXT NOT NULL,
    "includes" TEXT[],
    "freeBooking" BOOLEAN NOT NULL,
    "premiumInclusion" BOOLEAN NOT NULL,
    "tourType" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "adventureStyle" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);
