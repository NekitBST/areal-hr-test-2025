export class CreateHrOperationDto {
  employee_id: number;
  department_id: number;
  position_id: number;
  salary?: number;
  action: string;
} 