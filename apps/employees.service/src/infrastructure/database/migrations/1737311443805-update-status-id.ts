import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStatusId1737311443805 implements MigrationInterface {
    name = 'UpdateStatusId1737311443805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_b6c7380bac45e746176960400aa"`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "statusId" TO "status_id"`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "status_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_ad46b5db0903a0b7a53832b6ae4" FOREIGN KEY ("status_id") REFERENCES "employee_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_ad46b5db0903a0b7a53832b6ae4"`);
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "status_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "status_id" TO "statusId"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_b6c7380bac45e746176960400aa" FOREIGN KEY ("statusId") REFERENCES "employee_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
