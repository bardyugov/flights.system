import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveManyToManyCheck1737539821005 implements MigrationInterface {
    name = 'RemoveManyToManyCheck1737539821005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "CHK_e2e85e74b96141c387bb0b9bf0"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "CHK_e2e85e74b96141c387bb0b9bf0" CHECK ((role = 'pilot'::employee_role_enum))`);
    }

}
