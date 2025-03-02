import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAlfa1740928269737 implements MigrationInterface {
    name = 'AddAlfa1740928269737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "customerPhone1" TO "customerPhone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "customerPhone" TO "customerPhone1"`);
    }

}
