export class CreateChangeHistoryDto {
  changed_by: number;
  object_type: 'organization' | 'department' | 'position' | 'employee' | 'hr_operation' | 'file';
  object_id: number;
  old_value: any;
  new_value: any;
} 