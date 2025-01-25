import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameQualificationToEmployeeEntity1737628272659 implements MigrationInterface {
    name = 'RenameQualificationToEmployeeEntity1737628272659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qualification_to_employee" ("id" SERIAL NOT NULL, "employee_id" integer NOT NULL, "qualification_id" integer NOT NULL, CONSTRAINT "PK_8d7fdbccaeef7c4d89c7970c403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "qualification_to_employee" ADD CONSTRAINT "FK_8a1143e31fd185f850844866498" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qualification_to_employee" ADD CONSTRAINT "FK_1836d9b9cfeb2afa1ab96734e04" FOREIGN KEY ("qualification_id") REFERENCES "qualification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qualification_to_employee" DROP CONSTRAINT "FK_1836d9b9cfeb2afa1ab96734e04"`);
        await queryRunner.query(`ALTER TABLE "qualification_to_employee" DROP CONSTRAINT "FK_8a1143e31fd185f850844866498"`);
        await queryRunner.query(`DROP TABLE "qualification_to_employee"`);
    }

}
