import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddForeinKeyToStatementsTable1673354456259
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      "statements",
      new TableForeignKey({
        name: "FKSender_id_users",
        columnNames: ["sender_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("statements", "FKSender_id_users");
  }
}
