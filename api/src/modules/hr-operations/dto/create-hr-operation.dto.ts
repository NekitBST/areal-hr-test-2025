export class CreateHrOperationDto {
  employee_id: number;
  department_id: number;
  position_id: number;
  action_date?: Date;
  salary?: number;
  action: string;
} 