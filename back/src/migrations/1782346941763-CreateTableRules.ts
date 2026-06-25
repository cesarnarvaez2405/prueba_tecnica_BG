import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableRules1782346941763 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.createSchema('taxonomy', true);

    await queryRunner.createTable(
      new Table({
        name: 'rules',
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
            name: 'pattern',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'date_format',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'out_template',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'priority',
            type: 'integer',
            isNullable: false,
            default: 1,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('taxonomy.rules', true);
    await queryRunner.dropSchema('taxonomy', true);
  }
}
