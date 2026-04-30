-- DropIndex
DROP INDEX "Tour_createdAt_idx";

-- DropIndex
DROP INDEX "Tour_title_idx";

-- CreateIndex
CREATE INDEX "Tour_duration_idx" ON "Tour"("duration");

-- CreateIndex
CREATE INDEX "Tour_rating_idx" ON "Tour"("rating");

-- CreateIndex
CREATE INDEX "Tour_reviews_idx" ON "Tour"("reviews");

-- CreateIndex
CREATE INDEX "Tour_startDate_idx" ON "Tour"("startDate");

-- CreateIndex
CREATE INDEX "Tour_region_duration_idx" ON "Tour"("region", "duration");

-- CreateIndex
CREATE INDEX "Tour_language_idx" ON "Tour" USING GIN ("language");

-- CreateIndex
CREATE INDEX "Tour_adventureStyle_idx" ON "Tour" USING GIN ("adventureStyle");
