import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, {
      abortEarly: false,
      allowUnknown: false
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw new BadRequestException({
        message: 'Ошибка валидации',
        errors: errorMessages
      });
    }
    
    return value;
  }
}