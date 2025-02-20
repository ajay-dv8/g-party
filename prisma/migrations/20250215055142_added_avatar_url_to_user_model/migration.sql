-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "id" SET DEFAULT CONCAT(UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 6)));
