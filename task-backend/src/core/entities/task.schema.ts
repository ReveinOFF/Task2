import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from './base.schema';
import { Importance } from '../enums';

export type TaskType = HydratedDocument<Task>;

@Schema()
export class Task extends BaseEntity {
  @Prop({
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  })
  name: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: Importance, default: Importance.ORDINARY })
  importance: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
