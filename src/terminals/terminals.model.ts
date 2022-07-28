import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TerminalsDocument = TerminalsModel & Document;

@Schema()
export class TerminalsModel {
  @Prop()
  imei: string;

  @Prop()
  name: string;
}

export const TerminalsSchema = SchemaFactory.createForClass(TerminalsModel);
TerminalsSchema.virtual('PointItems', {
  ref: 'PointsModel',
  localField: '_id',
  foreignField: 'terminalId',
});
