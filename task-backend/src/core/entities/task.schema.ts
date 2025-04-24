import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
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
  title: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, enum: Importance, default: Importance.ORDINARY })
  importance: string;

  @Prop({ type: Types.UUID, ref: 'User', required: true })
  user: Types.UUID;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
