import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCurrencyTable1762174423048 implements MigrationInterface {
  name = 'CreateCurrencyTable1762174423048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "currencies" ("code" character varying(3) NOT NULL, "rate" numeric(18,4) NOT NULL, CONSTRAINT "PK_9f8d0972aeeb5a2277e40332d29" PRIMARY KEY ("code"))`
    );

    await queryRunner.query(`
            INSERT INTO "currencies" ("code", "rate") VALUES 
            ('TRY', 1.0000),
            ('USD', 0.0290),
            ('EUR', 0.0270),
            ('GBP', 0.0230)
        `);

    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_5c6e495365af3c3db047e561184" FOREIGN KEY ("currency") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "FK_fb16def8216eca9cdeac169d5db" FOREIGN KEY ("currency") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "FK_fb16def8216eca9cdeac169d5db"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_5c6e495365af3c3db047e561184"`
    );
    await queryRunner.query(`DROP TABLE "currencies"`);
  }
}
