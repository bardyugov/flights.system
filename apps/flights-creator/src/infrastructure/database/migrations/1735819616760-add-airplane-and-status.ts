import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAirplaneAndStatus1735819616760 implements MigrationInterface {
    name = 'AddAirplaneAndStatus1735819616760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "airplane" ("id" SERIAL NOT NULL, "PID" integer NOT NULL, "amount_places" integer NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "statusId" integer, "currentCityId" integer, CONSTRAINT "PK_ed933274baeda55658b17b13b78" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."airplane_status_status_enum" AS ENUM('in_flight', 'broken', 'refueling', 'in_parking')`);
        await queryRunner.query(`CREATE TABLE "airplane_status" ("id" SERIAL NOT NULL, "status" "public"."airplane_status_status_enum" NOT NULL DEFAULT 'in_parking', "create_at" TIMESTAMP NOT NULL DEFAULT now(), "airplanesId" integer, CONSTRAINT "PK_4614dd14e626197b5d73feffda4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "airplane" ADD CONSTRAINT "FK_77c9b888dabbcdbc33b6370d9f2" FOREIGN KEY ("statusId") REFERENCES "airplane_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "airplane" ADD CONSTRAINT "FK_1055c97463e0de0b1ac6bf763b9" FOREIGN KEY ("currentCityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "airplane_status" ADD CONSTRAINT "FK_e18db2afe94a154eb272431bb80" FOREIGN KEY ("airplanesId") REFERENCES "airplane"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "airplane_status" DROP CONSTRAINT "FK_e18db2afe94a154eb272431bb80"`);
        await queryRunner.query(`ALTER TABLE "airplane" DROP CONSTRAINT "FK_1055c97463e0de0b1ac6bf763b9"`);
        await queryRunner.query(`ALTER TABLE "airplane" DROP CONSTRAINT "FK_77c9b888dabbcdbc33b6370d9f2"`);
        await queryRunner.query(`DROP TABLE "airplane_status"`);
        await queryRunner.query(`DROP TYPE "public"."airplane_status_status_enum"`);
        await queryRunner.query(`DROP TABLE "airplane"`);
    }

}
