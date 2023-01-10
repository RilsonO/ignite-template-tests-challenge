import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStatementType1673349822548 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER type statements_type_enum ADD VALUE 'transfer'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER type statements_type_enum DROP VALUE 'transfer'`
    );
  }
}
