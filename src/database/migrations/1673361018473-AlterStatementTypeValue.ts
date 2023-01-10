import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterStatementTypeValue1673361018473
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "statements",
      new TableColumn({
        name: "type",
        type: "enum",
        enum: ["deposit", "withdraw", "transfer"],
      }),
      new TableColumn({
        name: "type",
        type: "enum",
        enum: ["deposit", "withdraw", "transfers"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "statements",
      new TableColumn({
        name: "type",
        type: "enum",
        enum: ["deposit", "withdraw", "transfers"],
      }),
      new TableColumn({
        name: "type",
        type: "enum",
        enum: ["deposit", "withdraw", "transfer"],
      })
    );
  }
}
