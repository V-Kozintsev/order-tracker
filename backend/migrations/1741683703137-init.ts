import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1741683703137 implements MigrationInterface {
    name = 'Init1741683703137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "totalCost" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "totalCost"`);
    }

}
