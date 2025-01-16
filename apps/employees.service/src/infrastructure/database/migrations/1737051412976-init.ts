import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737051412976 implements MigrationInterface {
    name = 'Init1737051412976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qualification" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "airplane_id" integer NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c8244868552c4364a5264440a66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."employee_type_enum" AS ENUM('pilot', 'stewardess')`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "last_name" character varying NOT NULL, "birth_date" TIMESTAMP NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "flights_hours" integer NOT NULL, "type" "public"."employee_type_enum" NOT NULL, "statusId" integer, CONSTRAINT "UQ_4dd526d4b65f60f9b3442a96106" UNIQUE ("type"), CONSTRAINT "CHK_cc175fbf443529a66dd2a8f411" CHECK ("type" = 'pilot'), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."employee_status_status_enum" AS ENUM('working', 'relaxing')`);
        await queryRunner.query(`CREATE TABLE "employee_status" ("id" SERIAL NOT NULL, "status" "public"."employee_status_status_enum" NOT NULL DEFAULT 'working', "create_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_99bb5683c634c869ae1a13b0ca8" UNIQUE ("status"), CONSTRAINT "PK_ad46b5db0903a0b7a53832b6ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_qualifications_qualification" ("employeeId" integer NOT NULL, "qualificationId" integer NOT NULL, CONSTRAINT "PK_e5a67a835219cf4944668eaafe0" PRIMARY KEY ("employeeId", "qualificationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7baebe37e4d9f948ce62bcf4eb" ON "employee_qualifications_qualification" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f4202014a7dfbe4434b5ec365d" ON "employee_qualifications_qualification" ("qualificationId") `);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_b6c7380bac45e746176960400aa" FOREIGN KEY ("statusId") REFERENCES "employee_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_qualifications_qualification" ADD CONSTRAINT "FK_7baebe37e4d9f948ce62bcf4ebf" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_qualifications_qualification" ADD CONSTRAINT "FK_f4202014a7dfbe4434b5ec365d3" FOREIGN KEY ("qualificationId") REFERENCES "qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_qualifications_qualification" DROP CONSTRAINT "FK_f4202014a7dfbe4434b5ec365d3"`);
        await queryRunner.query(`ALTER TABLE "employee_qualifications_qualification" DROP CONSTRAINT "FK_7baebe37e4d9f948ce62bcf4ebf"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_b6c7380bac45e746176960400aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4202014a7dfbe4434b5ec365d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7baebe37e4d9f948ce62bcf4eb"`);
        await queryRunner.query(`DROP TABLE "employee_qualifications_qualification"`);
        await queryRunner.query(`DROP TABLE "employee_status"`);
        await queryRunner.query(`DROP TYPE "public"."employee_status_status_enum"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TYPE "public"."employee_type_enum"`);
        await queryRunner.query(`DROP TABLE "qualification"`);
    }

}
