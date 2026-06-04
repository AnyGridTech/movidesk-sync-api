-- CreateTable
CREATE TABLE "InverterModel" (
    "id" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "line" TEXT,
    "type" TEXT NOT NULL,
    "gridType" TEXT,

    CONSTRAINT "InverterModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InverterModel_model_key" ON "InverterModel"("model");
