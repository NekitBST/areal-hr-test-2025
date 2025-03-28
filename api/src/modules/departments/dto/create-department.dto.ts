export class CreateDepartmentDto {
  name: string;
  parent_id?: number;
  organization_id: number;
  comment?: string;
}
