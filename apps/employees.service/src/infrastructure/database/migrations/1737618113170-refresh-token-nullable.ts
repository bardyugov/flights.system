import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshTokenNullable1737618113170 implements MigrationInterface {
    name = 'RefreshTokenNullable1737618113170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "refresh_token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "refresh_token" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "refresh_token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "refresh_token" SET NOT NULL`);
    }

}
