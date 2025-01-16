import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateManyToMany1737051659904 implements MigrationInterface {
    name = 'UpdateManyToMany1737051659904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee_to_qualification" ("qualification_id" integer NOT NULL, "employee_id" integer NOT NULL, CONSTRAINT "PK_7d2e7e834b1aa30f5d083c752ec" PRIMARY KEY ("qualification_id", "employee_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_26e5ce0db91d8f471f9ff21d49" ON "employee_to_qualification" ("qualification_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3ecd733801b1ec1e205d8df8ca" ON "employee_to_qualification" ("employee_id") `);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" ADD CONSTRAINT "FK_26e5ce0db91d8f471f9ff21d496" FOREIGN KEY ("qualification_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" ADD CONSTRAINT "FK_3ecd733801b1ec1e205d8df8ca8" FOREIGN KEY ("employee_id") REFERENCES "qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" DROP CONSTRAINT "FK_3ecd733801b1ec1e205d8df8ca8"`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" DROP CONSTRAINT "FK_26e5ce0db91d8f471f9ff21d496"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ecd733801b1ec1e205d8df8ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26e5ce0db91d8f471f9ff21d49"`);
        await queryRunner.query(`DROP TABLE "employee_to_qualification"`);
    }

}
