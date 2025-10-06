-- CreateEnum
CREATE TYPE "public"."NoteStatus" AS ENUM ('todo', 'doing', 'done');

-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "status" "public"."NoteStatus";
