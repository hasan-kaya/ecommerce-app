import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteUserPassword1762110443231 implements MigrationInterface {
    name = 'DeleteUserPassword1762110443231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(255) NOT NULL`);
    }

}
