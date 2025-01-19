import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737278238693 implements MigrationInterface {
    name = 'Init1737278238693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qualification" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "airplane_id" integer NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c8244868552c4364a5264440a66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "last_name" character varying NOT NULL, "birth_date" TIMESTAMP NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "flights_hours" integer NOT NULL, "type" "public"."employee_type_enum" NOT NULL, "password" character varying NOT NULL, "refresh_token" character varying NOT NULL, "statusId" integer, CONSTRAINT "CHK_cc175fbf443529a66dd2a8f411" CHECK ("type" = 'pilot'), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_status" ("id" SERIAL NOT NULL, "status" "public"."employee_status_status_enum" NOT NULL DEFAULT 'working', "create_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_99bb5683c634c869ae1a13b0ca8" UNIQUE ("status"), CONSTRAINT "PK_ad46b5db0903a0b7a53832b6ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."client_type_enum" AS ENUM('basic', 'priority', 'vip')`);
        await queryRunner.query(`CREATE TABLE "client" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "last_name" character varying NOT NULL, "birth_date" TIMESTAMP NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."client_type_enum" NOT NULL DEFAULT 'basic', "password" character varying NOT NULL, "refresh_token" character varying NOT NULL, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_to_qualification" ("qualification_id" integer NOT NULL, "employee_id" integer NOT NULL, CONSTRAINT "PK_7d2e7e834b1aa30f5d083c752ec" PRIMARY KEY ("qualification_id", "employee_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_26e5ce0db91d8f471f9ff21d49" ON "employee_to_qualification" ("qualification_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3ecd733801b1ec1e205d8df8ca" ON "employee_to_qualification" ("employee_id") `);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_b6c7380bac45e746176960400aa" FOREIGN KEY ("statusId") REFERENCES "employee_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" ADD CONSTRAINT "FK_26e5ce0db91d8f471f9ff21d496" FOREIGN KEY ("qualification_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" ADD CONSTRAINT "FK_3ecd733801b1ec1e205d8df8ca8" FOREIGN KEY ("employee_id") REFERENCES "qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" DROP CONSTRAINT "FK_3ecd733801b1ec1e205d8df8ca8"`);
        await queryRunner.query(`ALTER TABLE "employee_to_qualification" DROP CONSTRAINT "FK_26e5ce0db91d8f471f9ff21d496"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_b6c7380bac45e746176960400aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ecd733801b1ec1e205d8df8ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26e5ce0db91d8f471f9ff21d49"`);
        await queryRunner.query(`DROP TABLE "employee_to_qualification"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TYPE "public"."client_type_enum"`);
        await queryRunner.query(`DROP TABLE "employee_status"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TABLE "qualification"`);
    }

}
