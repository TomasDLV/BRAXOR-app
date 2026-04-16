-- DropIndex
DROP INDEX "Vehicle_make_model_key";

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_make_model_yearStart_yearEnd_key" ON "Vehicle"("make", "model", "yearStart", "yearEnd");
