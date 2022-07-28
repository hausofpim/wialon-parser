import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

export type PointsDocument = PointsModel & Document;

@Schema()
export class PointsModel {
  @Prop()
  date: string;
  @Prop()
  time: string;
  @Prop()
  lat1: string;
  @Prop()
  lat2: string;
  @Prop()
  lon1: string;
  @Prop()
  lon2: string;
  @Prop()
  speed: string;
  @Prop()
  course: string;
  @Prop()
  height: string;
  @Prop()
  sats: string;
  @Prop()
  imei: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'TerminalsModel' })
  terminalId: Types.ObjectId;
}

export const PointsSchema = SchemaFactory.createForClass(PointsModel);
