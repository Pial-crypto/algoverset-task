-- CreateIndex
CREATE INDEX "Tour_region_idx" ON "Tour"("region");

-- CreateIndex
CREATE INDEX "Tour_price_idx" ON "Tour"("price");

-- CreateIndex
CREATE INDEX "Tour_title_idx" ON "Tour"("title");

-- CreateIndex
CREATE INDEX "Tour_createdAt_idx" ON "Tour"("createdAt");

-- CreateIndex
CREATE INDEX "Tour_region_price_idx" ON "Tour"("region", "price");
