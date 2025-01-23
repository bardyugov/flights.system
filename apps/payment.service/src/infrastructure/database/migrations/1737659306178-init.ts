import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737659306178 implements MigrationInterface {
    name = 'Init1737659306178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "flight_id" integer NOT NULL, "client_id" integer NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "amount" integer NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payment"`);
    }

}
