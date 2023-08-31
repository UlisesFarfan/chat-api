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
  const { name, email, password, tag } = body;

  const userData = {
    email,
    name,
    password,
    tag
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

const addContact = async (userId: string, userTag: string) => {
  try {
    const newContact = await UserModel.find({
      tag: userTag
    })
    if (newContact[0]._id.toString() === userId) throw new Error("User invalid.");
    if (newContact.length === 0) throw new Error("User not found.");
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          contacts: newContact[0]._id
        },
        $pull: {
          blocked: newContact[0]._id
        },
      },
      { new: true }
    ).populate({ path: "contacts blocked", select: "name description" })

    if (!user) throw Error("Invalid data.")

    return {
      block_users: user.blocked,
      friends: user.contacts
    }
  } catch (error: any) {
    throw error;
  }
};

const deleteContact = async (userId: string, contactId: string) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          contacts: contactId
        }
      },
      { new: true }
    ).populate({ path: "contacts", select: "name description" });
    if (!user) throw new Error("Invalid data.")
    return user.contacts
  } catch (error: any) {
    console.log(error)
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

const getContactBlocked = async (id: string) => {
  try {
    const user = await UserModel.findById(id, {
      blocked: 1,
      _id: 0
    })
      .populate({ path: "blocked", select: "name description" });
    if (!user) throw Error("Invalid data.")
    return user.blocked;
  } catch (error: any) {
    throw error;
  };
};

const putBlockUser = async (id: string, otherUser: string, action: string) => {
  try {
    let blocked;
    let contacts;
    if (action === "block") {
      const user = await UserModel.findByIdAndUpdate(id, {
        $pull: {
          contacts: otherUser
        },
        $addToSet: {
          blocked: otherUser
        }
      },
        {
          new: true
        }
      ).populate(
        { path: "contacts blocked", select: "name description" }
      )
      if (!user) throw Error("Invalid data.")
      blocked = user.blocked;
      contacts = user.contacts
    };
    if (action === "unblock") {
      const user = await UserModel.findByIdAndUpdate(id, {
        $pull: {
          blocked: otherUser
        }
      },
        {
          new: true
        }
      ).populate(
        { path: "contacts blocked", select: "name description" }
      );
      if (!user) throw Error("Invalid data.")
      blocked = user.blocked;
      contacts = user.contacts;
    };
    return {
      block_users: blocked,
      friends: contacts
    }
  } catch (error: any) {
    console.log(error)
    throw error;
  };
};

const upDateInfo = async (body: {
  name: string;
  description: string;
  tag: string;
  userId: string;
}) => {
  const { name, description, tag, userId } = body
  try {
    const upDateUser = await UserModel.findByIdAndUpdate(userId, {
      name: name,
      description: description,
      tag: tag,
    },
      { new: true }
    );
    if (!upDateUser) throw new Error("Invalid user.")
    const user = {
      _id: upDateUser._id,
      name: upDateUser.name,
      tag: upDateUser.tag,
      description: upDateUser.description,
      email: upDateUser.email
    }

    return user;
  } catch (error: any) {
    console.log(error)
    throw error;
  };
};

const deleteAccountUser = async (userId: string, email: string) => {
  try {
    const user = await UserModel.findByIdAndUpdate(userId, {
      name: "User deleted.",
      contacts: [],
      blocked: [],
      chats: [],
      archive_chats: [],
      requests: [],
      tag: email + "delete account.",
      description: "",
      notifications: [],
      email: email + "delete account.",
      delete_at: new Date(),
    }, {
      new: true
    })
    return "Account deleted successfully."
  } catch (error: any) {
    console.log(error)
    throw error;
  };
};

export {
  serviceCreateUser,
  deleteUserById,
  extractUser,
  addContact,
  removeChat,
  getUserById,
  getContactByUserId,
  getContactsByName,
  getContactBlocked,
  upDateInfo,
  putBlockUser,
  deleteContact,
  deleteAccountUser
};

