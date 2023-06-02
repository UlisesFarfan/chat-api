// src/interfaces/message.interface.ts

import { ObjectId } from "mongoose";

export interface NotificationInterface extends Document {
  user: ObjectId;
  description: ObjectId;
  date: any;
}
