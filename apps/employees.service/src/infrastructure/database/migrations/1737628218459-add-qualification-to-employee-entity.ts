import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQualificationToEmployeeEntity1737628218459 implements MigrationInterface {
    name = 'AddQualificationToEmployeeEntity1737628218459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qualification_to_qualification" ("id" SERIAL NOT NULL, "employee_id" integer NOT NULL, "qualification_id" integer NOT NULL, CONSTRAINT "PK_5db5c7f81425c783e7e7f2a9415" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "qualification_to_qualification" ADD CONSTRAINT "FK_f098c9aa3c7d9588592a8b04f3a" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qualification_to_qualification" ADD CONSTRAINT "FK_4d546691508c095321972f70efb" FOREIGN KEY ("qualification_id") REFERENCES "qualification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qualification_to_qualification" DROP CONSTRAINT "FK_4d546691508c095321972f70efb"`);
        await queryRunner.query(`ALTER TABLE "qualification_to_qualification" DROP CONSTRAINT "FK_f098c9aa3c7d9588592a8b04f3a"`);
        await queryRunner.query(`DROP TABLE "qualification_to_qualification"`);
    }

}
