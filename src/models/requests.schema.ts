import { Schema, model, Types } from "mongoose";
import { RequestsInterface } from "../interfaces/requests.interface";

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
    date: {
      type: Date,
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
