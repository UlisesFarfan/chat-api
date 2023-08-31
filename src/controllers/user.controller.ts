import { Request, Response } from "express";
import {
  deleteUserById,
  serviceCreateUser,
  addContact,
  getContactByUserId,
  getContactsByName,
  getContactBlocked,
  upDateInfo,
  putBlockUser,
  deleteContact,
  deleteAccountUser
} from "../services/user.service";

const createUser = async ({ body }: Request, res: Response) => {
  try {
    let messageCreate = await serviceCreateUser(body);
    messageCreate.password = body.password
    res.status(201).json({
      message: messageCreate,
    });
  } catch (error: any) {
    if (!error.status) {
      return res.status(400).json({
        message: error.message,
      });
    }
    res.status(error.status).json({
      keys: error.keys ? error.keys : undefined,
      message: error.message,
    });
  }
};

const deleteUserController = async ({ params }: Request, res: Response) => {
  try {
    const messageDelete = await deleteUserById(params.id);

    res.status(201).json({
      message: messageDelete,
    });
  } catch (error: any) {
    if (!error.status) {
      return res.status(400).json({
        message: error.message,
      });
    }
    res.status(error.status).json({
      keys: error.keys ? error.keys : undefined,
      message: error.message,
    });
  };
};

const addContactController = async (req: Request, res: Response) => {
  try {
    const { userId, userTag } = req.body;
    console.log(userId, userTag)
    if (typeof userId !== "string" || typeof userTag !== "string") return "Invalid Data.";
    const addContactMessage = await addContact(userId, userTag);
    res.status(200).json(addContactMessage);
  } catch (error: any) {
    res.status(404).json({
      message: "User not found."
    });
  };
};

const getContactByUserIdController = async ({ params }: Request, res: Response) => {
  try {
    const { id } = params;
    const contacts = await getContactByUserId(id);
    res.status(200).json(contacts);
  } catch (error: any) {
    res.status(400).json({
      message: "Failure To Get Contacts"
    });
  };
};

const getContactByContactNameController = async ({ query, params }: Request, res: Response) => {
  try {
    const { userName } = query;
    const { id } = params;
    if (typeof id !== "string" || typeof userName !== "string") throw { message: "invalid data" };
    const contacts = await getContactsByName(id, userName);
    res.status(200).json(contacts);
  } catch (error: any) {
    res.status(error.status).json({
      message: "Failure To Get Contacts"
    });
  };
};

const getContactBlockedController = async ({ query, params }: Request, res: Response) => {
  try {
    const { id } = params;
    const usersNumber = await getContactBlocked(id);
    res.status(200).json(usersNumber);
  } catch (error: any) {
    res.status(error.status).json({
      message: "Failure To Get Contacts"
    });
  }
};

const upDateInfoController = async ({ body }: Request, res: Response) => {
  try {
    const usersNumber = await upDateInfo(body);
    res.status(200).json(usersNumber);
  } catch (error: any) {
    res.status(error.status).json({
      message: "Failure To Get Contacts"
    });
  }
};

const putBlockUserController = async (req: Request, res: Response) => {
  try {
    const { id, otherUser, action } = req.query
    if (typeof (id) !== "string" || typeof (otherUser) !== "string" || typeof (action) !== "string") throw { message: "Invalid data" }
    const usersNumber = await putBlockUser(id, otherUser, action);
    res.status(200).json(usersNumber);
  } catch (error: any) {
    res.status(error.status).json({
      message: "Failure To Get Contacts"
    });
  }
};

const deleteContactController = async (req: Request, res: Response) => {
  try {
    const { id, otherUser } = req.query
    if (typeof (id) !== "string" || typeof (otherUser) !== "string") throw { message: "Invalid data" }
    const usersNumber = await deleteContact(id, otherUser);
    res.status(200).json(usersNumber);
  } catch (error: any) {
    res.status(error.status).json({
      message: "Failure To Get Contacts"
    });
  }
};

const deleteAccountUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email } = req.query;
    if (typeof (email) !== "string") throw { message: "Invalid data" };
    const usersNumber = await deleteAccountUser(id, email);
    res.status(200).json(usersNumber);
  } catch (error: any) {
    res.status(500).json({
      message: "Something went wrong."
    });
  }
};

export {
  createUser,
  deleteUserController,
  addContactController,
  getContactByUserIdController,
  getContactByContactNameController,
  getContactBlockedController,
  upDateInfoController,
  putBlockUserController,
  deleteContactController,
  deleteAccountUserController
};
