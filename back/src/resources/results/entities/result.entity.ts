import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { entityBase } from 'src/utils/entityBase';
import { Rule } from 'src/resources/rules/entities/rule.entity';

@Entity({ name: 'processing_results', schema: 'taxonomy' })
export class ProcessingResult extends entityBase {
  @Column({ name: 'batch_id', type: 'uuid' })
  batchId!: string;

  @Column({ name: 'archivo_origen' })
  archivoOrigen!: string;

  @Column({ name: 'nombre_transformado', nullable: true })
  nombreTransformado!: string;

  @Column({ name: 'estado', length: 20 })
  estado!: string;

  @Column({ name: 'rule_id', type: 'uuid', nullable: true })
  ruleId!: string;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string;

  @Column({ name: 'processed_at', type: 'timestamp', default: () => 'now()' })
  processedAt!: Date;

  @ManyToOne(() => Rule, { nullable: true })
  @JoinColumn({ name: 'rule_id' })
  rule!: Rule;
}
