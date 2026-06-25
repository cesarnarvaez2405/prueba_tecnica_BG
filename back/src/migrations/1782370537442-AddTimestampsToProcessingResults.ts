import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTimestampsToProcessingResults1782370537442 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('taxonomy.processing_results', [
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('taxonomy.processing_results', 'updated_at');
    await queryRunner.dropColumn('taxonomy.processing_results', 'created_at');
  }
}
