-- DropForeignKey
ALTER TABLE "NRC" DROP CONSTRAINT "NRC_profesor_id_fkey";

-- AlterTable
ALTER TABLE "NRC" ALTER COLUMN "profesor_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "NRC" ADD CONSTRAINT "NRC_profesor_id_fkey" FOREIGN KEY ("profesor_id") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
