import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAlfa1740919792917 implements MigrationInterface {
    name = 'AddAlfa1740919792917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "order_number"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_phone"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "product_name"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_date"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "orderNumber" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "customerPhone" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveryAddress" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveryDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "items" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "items"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveryDate"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveryAddress"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customerPhone"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "orderNumber"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "product_name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "customer_phone" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "order_number" character varying(255) NOT NULL`);
    }

}
