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

const deleteUserById = async (id: string) => {
  try {
    await UserModel.findByIdAndDelete(id);
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

const getContactsByName = async (userId: string, userName: string) => {
  try {
    let user = await UserModel.findById(userId, {
      contacts: 1
    })
      .populate({ path: "contacts", select: "name description" });
    const result: any = [];
    if (user) {
      user.contacts.forEach((el: any) => {
        if (el.name.toLocaleLowerCase().includes(userName.toLocaleLowerCase())) {
          result.push(el)
        }
      })
    }
    return result;
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
};

const getAllKpisData = async (id: string) => {
  try {
    const users = await UserModel.find()
    const contacts = await UserModel.findById(id, {
      contacts: 1,
      blocked: 1,
      requests: 1,
      _id: 0
    })
      .populate({ path: "contacts", select: "name description" });
    return {
      total_users: users.length,
      contacts: contacts?.contacts,
      blocked: contacts?.blocked.length,
      requests: contacts?.requests.length
    }
  } catch (error: any) {
    throw error;
  }
}

export {
  serviceCreateUser,
  deleteUserById,
  extractUser,
  addContact,
  removeChat,
  getUserById,
  getContactByUserId,
  getContactsByName,
  getAllKpisData
};

