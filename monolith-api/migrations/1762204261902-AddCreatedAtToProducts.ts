import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToProducts1762204261902 implements MigrationInterface {
    name = 'AddCreatedAtToProducts1762204261902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "created_at"`);
    }

}
