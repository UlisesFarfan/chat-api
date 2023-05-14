import { Schema, model } from "mongoose";

const jwtSchema = new Schema(
  {
    access: {
      type: String,
      required: true,
    },
    refresh: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const JwtModel = model("Tokens", jwtSchema);
JwtModel.syncIndexes();
export default JwtModel;
