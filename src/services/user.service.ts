import { UserInterface } from "../interfaces/user.interface";
import UserModel from "../models/user.schema";
import { verifyRefreshToken } from "../utils/jwt.utils";
import { hashPassword } from "../utils/password.utils";
import { ObjectId } from "mongoose";

type OrganizationRegister = {
  duns?: string;
  siret?: string;
  name: string;
};

interface RegisterInput extends UserInterface {
  password: string;
  organization: OrganizationRegister;
};

const serviceCreateUser = async (body: RegisterInput) => {
  const { name, email, password } = body;

  const userData = {
    email,
    name,
    password,
  };

  try {
    let { user } = await register(userData);

    return user

  } catch (error: any) {
    console.log(error);
    throw error;

  }
};

export const register = async (user: any) => {
  try {
    const { hash, salt } = hashPassword(user.password);

    user.hash = hash;
    user.salt = salt;

    delete user.password;

    let newUser: any = new UserModel(user);

    await newUser.save();

    newUser = Object.fromEntries(
      Object.entries(newUser.toObject()).filter(
        ([key]: any) => !key.includes.hash && !key.includes.salt
      )
    );

    return {
      user: newUser,
      message: "User created successfully",
    };
  } catch (error: any) {
    throw error;
  }
};

const deleteUserById = async (_id: string) => {
  try {
    await UserModel.findByIdAndDelete(_id);
    return "User deleted successfully";
  } catch (error: any) {
    throw error;
  }
};

const extractUser = async (headers: any): Promise<string> => {
  try {
    const { authorization }: any = headers;

    let [type, value] = authorization?.split(" ");

    if (type !== "Bearer") {
      throw new Error("Invalid token");
    }

    const { email } = verifyRefreshToken(value);

    const user: any = UserModel.findOne({ email });

    return user._id;
  } catch (error: any) {
    throw error;
  }
};

const addContact = async (userId: string, contactId: string) => {
  try {
    console.log(userId, contactId)
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          contacts: contactId
        }
      },
      { new: true }
    )
    await UserModel.findByIdAndUpdate(
      contactId,
      {
        $push: {
          contacts: userId
        }
      },
      { new: true }
    )
    return "Contact Added Successfully"
  } catch (error: any) {
    throw error;
  }
};

const removeChat = async (userId: string, chatId: string) => {
  try {
    UserModel.updateOne(
      { _id: userId },
      { $pull: { chat: chatId } }
    );
    return "Contact removed Successfully";
  } catch (error: any) {
    throw error;
  }
};

const getUserById = async (id: string) => {
  try {
    const user = await UserModel.findById(id);
    return user;
  } catch (error: any) {
    throw error;
  }
};

const getContactByUserId = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId).populate({ path: "contacts", select: "name description" });
    return user?.contacts;
  } catch (error: any) {
    throw error;
  }
}

export { serviceCreateUser, deleteUserById, extractUser, addContact, removeChat, getUserById, getContactByUserId };
