import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFlightJournal1737725486861 implements MigrationInterface {
    name = 'AddFlightJournal1737725486861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flight-journal" ("id" SERIAL NOT NULL, "flight_id" integer NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer NOT NULL, CONSTRAINT "PK_7a61e0036f1183d16cf6322f637" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "flight-journal" ADD CONSTRAINT "FK_3308a9f9b5c22735d7043f1d0cd" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight-journal" DROP CONSTRAINT "FK_3308a9f9b5c22735d7043f1d0cd"`);
        await queryRunner.query(`DROP TABLE "flight-journal"`);
    }

}
