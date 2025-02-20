-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'REQUEST_PAYMENT');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('BANK_ACCOUNT', 'MOBILE_MONEY', 'CARD');

-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'FROZEN');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "gender" TEXT NOT NULL,
    "dob" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL DEFAULT CONCAT(UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 6))),
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "status" "WalletStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" UUID NOT NULL,
    "type" "PaymentType" NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "walletId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "metadata" JSONB,
    "senderId" UUID,
    "recipientId" UUID,
    "requestId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundRequest" (
    "id" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "totalRecipients" INTEGER NOT NULL DEFAULT 0,
    "creatorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundRecipient" (
    "id" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX "Wallet_id_idx" ON "Wallet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_walletId_accountNumber_key" ON "PaymentMethod"("walletId", "accountNumber");

-- CreateIndex
CREATE INDEX "Transaction_senderId_idx" ON "Transaction"("senderId");

-- CreateIndex
CREATE INDEX "Transaction_recipientId_idx" ON "Transaction"("recipientId");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "FundRequest_creatorId_idx" ON "FundRequest"("creatorId");

-- CreateIndex
CREATE INDEX "FundRequest_expiresAt_idx" ON "FundRequest"("expiresAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "FundRecipient_requestId_idx" ON "FundRecipient"("requestId");

-- CreateIndex
CREATE INDEX "FundRecipient_userId_idx" ON "FundRecipient"("userId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "FundRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundRequest" ADD CONSTRAINT "FundRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundRecipient" ADD CONSTRAINT "FundRecipient_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "FundRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundRecipient" ADD CONSTRAINT "FundRecipient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;













-- -- Step 1: Create all the ENUMs
-- CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'EXPIRED');
-- CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');
-- CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'REQUEST_PAYMENT');
-- CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED');
-- CREATE TYPE "PaymentType" AS ENUM ('BANK_ACCOUNT', 'MOBILE_MONEY', 'CARD');
-- CREATE TYPE "WalletStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'FROZEN');

-- -- Step 2: Create new tables that don't exist yet
-- CREATE TABLE IF NOT EXISTS "Notification" (
--     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
--     "message" TEXT NOT NULL,
--     "read" BOOLEAN NOT NULL DEFAULT false,
--     "userId" UUID NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
-- );

-- CREATE TABLE IF NOT EXISTS "FundRecipient" (
--     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
--     "amount" DECIMAL(15,2) NOT NULL,
--     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
--     "requestId" UUID NOT NULL,
--     "userId" UUID NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,
--     CONSTRAINT "FundRecipient_pkey" PRIMARY KEY ("id")
-- );

-- -- Step 3: Add temporary columns for existing enum fields
-- ALTER TABLE "Transaction" 
-- ADD COLUMN IF NOT EXISTS "status_new" "TransactionStatus",
-- ADD COLUMN IF NOT EXISTS "type_new" "TransactionType";

-- ALTER TABLE "PaymentMethod" 
-- ADD COLUMN IF NOT EXISTS "status_new" "AccountStatus",
-- ADD COLUMN IF NOT EXISTS "type_new" "PaymentType";

-- ALTER TABLE "Wallet" 
-- ADD COLUMN IF NOT EXISTS "status_new" "WalletStatus";

-- ALTER TABLE "FundRequest" 
-- ADD COLUMN IF NOT EXISTS "status_new" "RequestStatus";

-- -- Step 4: Migrate existing data to new enum columns
-- UPDATE "Transaction" 
-- SET "status_new" = CASE 
--     WHEN status::text = 'PENDING' THEN 'PENDING'::"TransactionStatus"
--     WHEN status::text = 'COMPLETED' THEN 'COMPLETED'::"TransactionStatus"
--     WHEN status::text = 'FAILED' THEN 'FAILED'::"TransactionStatus"
--     WHEN status::text = 'CANCELLED' THEN 'CANCELLED'::"TransactionStatus"
--     ELSE 'PENDING'::"TransactionStatus"
-- END,
-- "type_new" = CASE 
--     WHEN type::text = 'DEPOSIT' THEN 'DEPOSIT'::"TransactionType"
--     WHEN type::text = 'WITHDRAWAL' THEN 'WITHDRAWAL'::"TransactionType"
--     WHEN type::text = 'TRANSFER' THEN 'TRANSFER'::"TransactionType"
--     WHEN type::text = 'REQUEST_PAYMENT' THEN 'REQUEST_PAYMENT'::"TransactionType"
--     ELSE 'TRANSFER'::"TransactionType"
-- END;

-- UPDATE "PaymentMethod" 
-- SET "status_new" = CASE 
--     WHEN status::text = 'ACTIVE' THEN 'ACTIVE'::"AccountStatus"
--     WHEN status::text = 'INACTIVE' THEN 'INACTIVE'::"AccountStatus"
--     WHEN status::text = 'SUSPENDED' THEN 'SUSPENDED'::"AccountStatus"
--     WHEN status::text = 'CLOSED' THEN 'CLOSED'::"AccountStatus"
--     ELSE 'ACTIVE'::"AccountStatus"
-- END,
-- "type_new" = CASE 
--     WHEN type::text = 'BANK_ACCOUNT' THEN 'BANK_ACCOUNT'::"PaymentType"
--     WHEN type::text = 'MOBILE_MONEY' THEN 'MOBILE_MONEY'::"PaymentType"
--     WHEN type::text = 'CARD' THEN 'CARD'::"PaymentType"
--     ELSE 'BANK_ACCOUNT'::"PaymentType"
-- END;

-- UPDATE "Wallet" 
-- SET "status_new" = CASE 
--     WHEN status::text = 'ACTIVE' THEN 'ACTIVE'::"WalletStatus"
--     WHEN status::text = 'INACTIVE' THEN 'INACTIVE'::"WalletStatus"
--     WHEN status::text = 'FROZEN' THEN 'FROZEN'::"WalletStatus"
--     ELSE 'ACTIVE'::"WalletStatus"
-- END;

-- UPDATE "FundRequest" 
-- SET "status_new" = CASE 
--     WHEN status::text = 'PENDING' THEN 'PENDING'::"RequestStatus"
--     WHEN status::text = 'COMPLETED' THEN 'COMPLETED'::"RequestStatus"
--     WHEN status::text = 'CANCELLED' THEN 'CANCELLED'::"RequestStatus"
--     WHEN status::text = 'EXPIRED' THEN 'EXPIRED'::"RequestStatus"
--     ELSE 'PENDING'::"RequestStatus"
-- END;

-- -- Step 5: Drop old columns and rename new ones
-- ALTER TABLE "Transaction" 
-- DROP COLUMN IF EXISTS "status",
-- DROP COLUMN IF EXISTS "type",
-- ALTER COLUMN "status_new" SET NOT NULL,
-- ALTER COLUMN "type_new" SET NOT NULL,
-- RENAME COLUMN "status_new" TO "status",
-- RENAME COLUMN "type_new" TO "type";

-- ALTER TABLE "PaymentMethod" 
-- DROP COLUMN IF EXISTS "status",
-- DROP COLUMN IF EXISTS "type",
-- ALTER COLUMN "status_new" SET NOT NULL,
-- ALTER COLUMN "type_new" SET NOT NULL,
-- RENAME COLUMN "status_new" TO "status",
-- RENAME COLUMN "type_new" TO "type";

-- ALTER TABLE "Wallet" 
-- DROP COLUMN IF EXISTS "status",
-- ALTER COLUMN "status_new" SET NOT NULL,
-- RENAME COLUMN "status_new" TO "status";

-- ALTER TABLE "FundRequest" 
-- DROP COLUMN IF EXISTS "status",
-- ALTER COLUMN "status_new" SET NOT NULL,
-- RENAME COLUMN "status_new" TO "status";

-- -- Step 6: Add indexes
-- CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
-- CREATE INDEX IF NOT EXISTS "Notification_read_idx" ON "Notification"("read");
-- CREATE INDEX IF NOT EXISTS "FundRecipient_requestId_idx" ON "FundRecipient"("requestId");
-- CREATE INDEX IF NOT EXISTS "FundRecipient_userId_idx" ON "FundRecipient"("userId");

-- -- Step 7: Add foreign key constraints
-- ALTER TABLE "Notification"
-- ADD CONSTRAINT "Notification_userId_fkey"
-- FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ALTER TABLE "FundRecipient"
-- ADD CONSTRAINT "FundRecipient_requestId_fkey"
-- FOREIGN KEY ("requestId") REFERENCES "FundRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
-- ADD CONSTRAINT "FundRecipient_userId_fkey"
-- FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
