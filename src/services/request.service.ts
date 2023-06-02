import RequestModel from "../models/requests.schema";
import UserModel from "../models/user.schema";
import { RequestsInterface } from "../interfaces/requests.interface";

const postRequest = async (body: RequestsInterface) => {
  try {
    const newRequest = new RequestModel(body)

    await newRequest.save()

    await UserModel.findByIdAndUpdate(
      body.transmitter,
      {
        $push: {
          messagesId: newRequest._id,
        }
      },
      { new: true }
    );
    
    await UserModel.findByIdAndUpdate(
      body.receiver,
      {
        $push: {
          messagesId: newRequest._id,
        }
      },
      { new: true }
    );

  } catch (error: any) {
    throw error;
  }
}

export { postRequest }