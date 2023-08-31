// src/interfaces/message.interface.ts

import { ObjectId } from "mongoose";

export interface RequestsInterface extends Document {
  receiver: ObjectId;
  transmitter: ObjectId;
  status: String;
  viewed: Boolean;
  date: any;
};
export enum TypeStatus {
  PENDING,
  REJECTED,
  ACEPTED
};
