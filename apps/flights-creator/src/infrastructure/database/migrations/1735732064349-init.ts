import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1735732064349 implements MigrationInterface {
    name = 'Init1735732064349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "country" character varying NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "flight" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "landing_time" TIMESTAMP NOT NULL, "departure_time" TIMESTAMP NOT NULL, "fromId" integer NOT NULL, "toId" integer NOT NULL, CONSTRAINT "PK_bf571ce6731cf071fc51b94df03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_e2c4967b8fe092eca37e3e94ead" FOREIGN KEY ("fromId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_ea1df74055f0d39e3b002a4c8e7" FOREIGN KEY ("toId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_ea1df74055f0d39e3b002a4c8e7"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_e2c4967b8fe092eca37e3e94ead"`);
        await queryRunner.query(`DROP TABLE "flight"`);
        await queryRunner.query(`DROP TABLE "city"`);
    }

}
