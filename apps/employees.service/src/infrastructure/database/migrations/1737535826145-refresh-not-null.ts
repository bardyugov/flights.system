import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshNotNull1737535826145 implements MigrationInterface {
    name = 'RefreshNotNull1737535826145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "refresh_token" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "refresh_token" DROP NOT NULL`);
    }

}
