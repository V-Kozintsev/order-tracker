import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742025600703 implements MigrationInterface {
    name = 'Init1742025600703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "totalCost"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "totalCost" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

}
