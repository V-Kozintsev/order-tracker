import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAlfa1740918592481 implements MigrationInterface {
    name = 'AddAlfa1740918592481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "alfa"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "alfa" integer NOT NULL`);
    }

}
