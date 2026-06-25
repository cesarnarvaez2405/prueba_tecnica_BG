import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableProcessingResults1782361436975 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'processing_results',
        schema: 'taxonomy',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'batch_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'archivo_origen',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'nombre_transformado',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'estado',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'rule_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'processed_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'taxonomy.processing_results',
      new TableForeignKey({
        columnNames: ['rule_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'rules',
        referencedSchema: 'taxonomy',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('taxonomy.processing_results');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('rule_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('taxonomy.processing_results', foreignKey);
      }
    }
    await queryRunner.dropTable('taxonomy.processing_results', true);
  }
}
