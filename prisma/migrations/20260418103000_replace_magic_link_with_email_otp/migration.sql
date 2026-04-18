-- CreateTable
CREATE TABLE "email_otps" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_email_otp_email_created" ON "email_otps"("email", "createdAt");

-- CreateIndex
CREATE INDEX "idx_email_otp_email_consumed" ON "email_otps"("email", "consumedAt");

-- CreateIndex
CREATE INDEX "idx_email_otp_expires" ON "email_otps"("expiresAt");

-- DropTable
DROP TABLE "verificationtokens";
