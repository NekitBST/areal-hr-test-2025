export class CreateEmployeeDto {
  last_name: string;
  first_name: string;
  middle_name?: string;
  date_of_birth: Date;
  passport_series?: string;
  passport_number?: string;
  passport_issue_date?: Date;
  passport_department_code?: string;
  passport_issued_by?: string;
  registration_area?: string;
  registration_city?: string;
  registration_street?: string;
  registration_house?: string;
  registration_building?: string;
  registration_apartment?: string;
} 