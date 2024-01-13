import { PartialType } from '@nestjs/mapped-types';
import { CreateShepherdDto } from './create-shepherd.dto';

export class UpdateShepherdDto extends PartialType(CreateShepherdDto) {}
