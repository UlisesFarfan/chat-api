// src/interfaces/message.interface.ts

import { ObjectId } from "mongoose";

export interface RequestsInterface extends Document {
  receiver: ObjectId;
  transmitter: ObjectId;
  date: any;
}
