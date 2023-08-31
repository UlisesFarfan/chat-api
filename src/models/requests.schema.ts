import { Schema, model, Types } from "mongoose";
import { RequestsInterface, TypeStatus } from "../interfaces/requests.interface";

const requestSchema = new Schema<RequestsInterface>(
  {
    receiver: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    transmitter: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: [
        TypeStatus.PENDING,
        TypeStatus.REJECTED,
        TypeStatus.ACEPTED,
      ],
      default: TypeStatus.PENDING
    },
    viewed: {
      type: Boolean,
      require: true,
      default: false
    },
    date: {
      type: Date,
      default: new Date()
    }
  },
  {
    versionKey: false,
    collection: "requests",
  }
);

const RequestModel = model("Request", requestSchema, "requests");
RequestModel.syncIndexes();
export default RequestModel;
