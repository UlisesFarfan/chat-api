// src/interfaces/message.interface.ts

import { ObjectId } from "mongoose";

export interface MessageInterface extends Document {
  message: string;
  user: ObjectId;
  chatId: ObjectId;
  _delete: Boolean;
  date: any;
}
