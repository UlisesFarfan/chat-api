import MessageModel from "../models/message.schema";
import ChatModel from "../models/chat.schema";
import { MessageInterface } from "../interfaces/message.interface";

const newMessage = async (body: MessageInterface) => {
  try {
    body.date = new Date()
    const newMessage = new MessageModel(body);

    await newMessage.save();

    const addMessageToChat = await ChatModel.findByIdAndUpdate(
      body.chatId,
      {
        $push: {
          messagesId: newMessage._id,
        },
        lastMessage: newMessage._id
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
};

const deleteMessageById = async (id: string) => {
  try {
    console.log(id)
    const a = await MessageModel.findByIdAndUpdate(id, {
      _delete: true
    })
    return "delete successfully"
  } catch (error: any) {
    throw error;
  }
}

export {
  newMessage,
  deleteMessageById,
}