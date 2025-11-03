import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWalletTransactionTable1762181042991 implements MigrationInterface {
    name = 'CreateWalletTransactionTable1762181042991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."wallet_transactions_type_enum" AS ENUM('top_up', 'transfer_in', 'transfer_out', 'purchase')`);
        await queryRunner.query(`CREATE TABLE "wallet_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."wallet_transactions_type_enum" NOT NULL, "amount_minor" bigint NOT NULL DEFAULT '0', "currency" character varying(3) NOT NULL, "description" text, "related_transaction_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "wallet_id" uuid NOT NULL, CONSTRAINT "PK_5120f131bde2cda940ec1a621db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6956721ecd7d2f8bd5a1d99046" ON "wallet_transactions" ("wallet_id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_c57d19129968160f4db28fc8b28" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_c57d19129968160f4db28fc8b28"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6956721ecd7d2f8bd5a1d99046"`);
        await queryRunner.query(`DROP TABLE "wallet_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transactions_type_enum"`);
    }

}
