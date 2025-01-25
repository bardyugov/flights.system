import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRemainingPlaces1737719299056 implements MigrationInterface {
    name = 'AddRemainingPlaces1737719299056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" ADD "remaining_places" integer NOT NULL DEFAULT '300'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "remaining_places"`);
    }

}
