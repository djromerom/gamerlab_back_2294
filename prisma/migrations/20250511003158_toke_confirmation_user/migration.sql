-- AlterTable
ALTER TABLE "NRC" ALTER COLUMN "codigo_nrc" DROP DEFAULT;
DROP SEQUENCE "NRC_codigo_nrc_seq";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "token_confirmacion" TEXT;
