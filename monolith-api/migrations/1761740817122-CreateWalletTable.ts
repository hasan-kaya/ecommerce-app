import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWalletTable1761740817122 implements MigrationInterface {
    name = 'CreateWalletTable1761740817122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "currency" character varying(3) NOT NULL, "balance_minor" bigint NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "UQ_87fd1a36dcc4d5979379a7027c9" UNIQUE ("user_id", "currency"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD CONSTRAINT "FK_92558c08091598f7a4439586cda" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP CONSTRAINT "FK_92558c08091598f7a4439586cda"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
    }

}
