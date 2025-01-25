import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeAndClient1737539541320 implements MigrationInterface {
    name = 'UpdateEmployeeAndClient1737539541320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "CHK_cc175fbf443529a66dd2a8f411"`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "type" TO "role"`);
        await queryRunner.query(`ALTER TYPE "public"."employee_type_enum" RENAME TO "employee_role_enum"`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "refresh_token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "CHK_e2e85e74b96141c387bb0b9bf0" CHECK ("role" = 'pilot')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "CHK_e2e85e74b96141c387bb0b9bf0"`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "refresh_token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."employee_role_enum" RENAME TO "employee_type_enum"`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "role" TO "type"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "CHK_cc175fbf443529a66dd2a8f411" CHECK ((type = 'pilot'::employee_type_enum))`);
    }

}
