import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateManyToManyQualificEmployee1737625032516 implements MigrationInterface {
    name = 'UpdateManyToManyQualificEmployee1737625032516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" DROP CONSTRAINT "FK_26e5ce0db91d8f471f9ff21d496"`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" DROP CONSTRAINT "FK_3ecd733801b1ec1e205d8df8ca8"`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" ADD CONSTRAINT "FK_3ecd733801b1ec1e205d8df8ca8" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" ADD CONSTRAINT "FK_26e5ce0db91d8f471f9ff21d496" FOREIGN KEY ("qualification_id") REFERENCES "qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" DROP CONSTRAINT "FK_26e5ce0db91d8f471f9ff21d496"`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" DROP CONSTRAINT "FK_3ecd733801b1ec1e205d8df8ca8"`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" ADD CONSTRAINT "FK_3ecd733801b1ec1e205d8df8ca8" FOREIGN KEY ("employee_id") REFERENCES "qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" ADD CONSTRAINT "FK_26e5ce0db91d8f471f9ff21d496" FOREIGN KEY ("qualification_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
