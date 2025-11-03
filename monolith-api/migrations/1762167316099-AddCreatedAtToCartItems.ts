import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToCartItems1762167316099 implements MigrationInterface {
    name = 'AddCreatedAtToCartItems1762167316099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "created_at"`);
    }

}
