-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar_url" TEXT;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "id" SET DEFAULT CONCAT(UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 6)));
