-- AlterTable
CREATE SEQUENCE invertermodel_id_seq;
ALTER TABLE "InverterModel" ALTER COLUMN "id" SET DEFAULT nextval('invertermodel_id_seq');
ALTER SEQUENCE invertermodel_id_seq OWNED BY "InverterModel"."id";
