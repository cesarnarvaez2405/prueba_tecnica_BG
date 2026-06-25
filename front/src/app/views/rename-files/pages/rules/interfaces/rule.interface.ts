export interface Rule {
  id: string;
  pattern: string;
  dateFormat: string;
  outTemplate: string;
  priority: number;
  isActive: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface CreateRuleDto {
  pattern: string;
  dateFormat: string;
  outTemplate: string;
  priority: number;
  isActive: boolean;
}
