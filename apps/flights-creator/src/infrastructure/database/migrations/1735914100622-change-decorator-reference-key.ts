import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDecoratorReferenceKey1735914100622 implements MigrationInterface {
    name = 'ChangeDecoratorReferenceKey1735914100622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "airplane_status" DROP CONSTRAINT "FK_e18db2afe94a154eb272431bb80"`);
        await queryRunner.query(`ALTER TABLE "airplane_status" DROP COLUMN "airplanesId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "airplane_status" ADD "airplanesId" integer`);
        await queryRunner.query(`ALTER TABLE "airplane_status" ADD CONSTRAINT "FK_e18db2afe94a154eb272431bb80" FOREIGN KEY ("airplanesId") REFERENCES "airplane"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
