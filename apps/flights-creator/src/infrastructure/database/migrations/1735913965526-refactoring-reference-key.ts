import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactoringReferenceKey1735913965526 implements MigrationInterface {
    name = 'RefactoringReferenceKey1735913965526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "airplane_status" ("id" SERIAL NOT NULL, "status" "public"."airplane_status_status_enum" NOT NULL DEFAULT 'in_parking', "create_at" TIMESTAMP NOT NULL DEFAULT now(), "airplanesId" integer, CONSTRAINT "UQ_753576731f4dbdadfd8342a5229" UNIQUE ("status"), CONSTRAINT "PK_4614dd14e626197b5d73feffda4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "airplane" ("id" SERIAL NOT NULL, "PID" integer NOT NULL, "amount_places" integer NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "status_id" integer NOT NULL, "current_city_id" integer NOT NULL, CONSTRAINT "PK_ed933274baeda55658b17b13b78" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "country" character varying NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "flight" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "landing_time" TIMESTAMP NOT NULL, "departure_time" TIMESTAMP NOT NULL, "from_city_id" integer NOT NULL, "to_city_id" integer NOT NULL, CONSTRAINT "PK_bf571ce6731cf071fc51b94df03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "airplane_status" ADD CONSTRAINT "FK_e18db2afe94a154eb272431bb80" FOREIGN KEY ("airplanesId") REFERENCES "airplane"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "airplane" ADD CONSTRAINT "FK_4614dd14e626197b5d73feffda4" FOREIGN KEY ("status_id") REFERENCES "airplane_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "airplane" ADD CONSTRAINT "FK_423dd1367914cdd8c358d36d290" FOREIGN KEY ("current_city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_1879c5231864ede7f74f235b9bb" FOREIGN KEY ("from_city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_bce3b12f6d46a52c2fe1a6b02ee" FOREIGN KEY ("to_city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_bce3b12f6d46a52c2fe1a6b02ee"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_1879c5231864ede7f74f235b9bb"`);
        await queryRunner.query(`ALTER TABLE "airplane" DROP CONSTRAINT "FK_423dd1367914cdd8c358d36d290"`);
        await queryRunner.query(`ALTER TABLE "airplane" DROP CONSTRAINT "FK_4614dd14e626197b5d73feffda4"`);
        await queryRunner.query(`ALTER TABLE "airplane_status" DROP CONSTRAINT "FK_e18db2afe94a154eb272431bb80"`);
        await queryRunner.query(`DROP TABLE "flight"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP TABLE "airplane"`);
        await queryRunner.query(`DROP TABLE "airplane_status"`);
    }

}
