import { entityBase } from 'src/utils/entityBase';
import { Column, Entity } from 'typeorm';
import { DateFormatEnum } from '../enums/date-format.enum';

@Entity({ name: 'rules', schema: 'taxonomy' })
export class Rule extends entityBase {
  @Column({ name: 'pattern' })
  pattern!: string;

  @Column({ name: 'date_format' })
  dateFormat!: DateFormatEnum;

  @Column({ name: 'out_template' })
  outTemplate!: string;

  @Column({ name: 'priority', default: 1 })
  priority!: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;
}
