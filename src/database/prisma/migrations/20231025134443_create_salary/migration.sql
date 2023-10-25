-- CreateTable
CREATE TABLE "salary" (
    "id" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payment_reference" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "report_link" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "reference_salary" DOUBLE PRECISION NOT NULL,
    "received_value" DOUBLE PRECISION NOT NULL,
    "advance_value" DOUBLE PRECISION NOT NULL,
    "discounts" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "salary_external_id_key" ON "salary"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "salary_report_link_key" ON "salary"("report_link");
