import { MigrationInterface, QueryRunner } from "typeorm";

export class InitEmptyMigration1742116903738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "admins" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "role" VARCHAR(255) NOT NULL CHECK (role IN ('admin', 'superadmin'))
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" SERIAL PRIMARY KEY,
        "orderNumber" VARCHAR(255) NOT NULL,
        "customerPhone" VARCHAR(20) NOT NULL,
        "deliveryAddress" VARCHAR(255) NOT NULL,
        "deliveryDate" DATE NOT NULL,
        "status" VARCHAR(255) NOT NULL CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
        "items" JSONB NOT NULL DEFAULT '[]'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orders";`);
    await queryRunner.query(`DROP TABLE "admins";`);
  }
}
