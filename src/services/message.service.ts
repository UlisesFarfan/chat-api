import MessageModel from "../models/message.schema";
import ChatModel from "../models/chat.schema";
import { MessageInterface } from "../interfaces/message.interface";

const newMessage = async (body: MessageInterface) => {
  try {
    const newMessage = new MessageModel(body);

    await newMessage.save();

    const addMessageToChat = await ChatModel.findByIdAndUpdate(
      body.chatId,
      {
        $push: {
          messagesId: newMessage._id,
        },
        messageToview: true
      },
      { new: true }
    );

    if (addMessageToChat) {
      await addMessageToChat.save();
    }

    return newMessage;
  } catch (error: any) {
    throw error;
  }
}

export { newMessage }