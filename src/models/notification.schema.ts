import { Schema, model, Types } from "mongoose";
import { NotificationInterface } from "../interfaces/notifications.interface";


const notificationSchema = new Schema<NotificationInterface>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: new Date()
    }
  },
  {
    versionKey: false,
    collection: "notification",
  }
);

const NotificationModel = model("Notification", notificationSchema, "notification");
NotificationModel.syncIndexes();
export default NotificationModel;
