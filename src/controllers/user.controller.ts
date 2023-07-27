import { Request, Response } from "express";
import {
  deleteUserById,
  serviceCreateUser,
  addContact,
  getContactByUserId,
  getContactsByName,
  getAllKpisData
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

const deleteUsers = async ({ params }: Request, res: Response) => {
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
  }
};

const addContactController = async ({ body }: Request, res: Response) => {
  try {
    const { userId, contactId } = body
    const addContactMessage = await addContact(userId, contactId)
    res.status(200).json({
      message: addContactMessage
    })
  } catch (error: any) {
    res.status(error.status).json({
      message: "Failure To Add Contact"
    })
  }
};

const getContactByUserIdController = async ({ params }: Request, res: Response) => {
  try {
    const { id } = params
    const contacts = await getContactByUserId(id)
    res.status(200).json(contacts)
  } catch (error: any) {
    res.status(error.status).json({
      message: "Failure To Get Contacts"
    })
  }
}

const getContactByContactNameController = async ({ query, params }: Request, res: Response) => {
  try {
    const { userName } = query
    const { id } = params
    if (typeof id !== "string" || typeof userName !== "string") throw { message: "invalid data" }
    const contacts = await getContactsByName(id, userName)
    res.status(200).json(contacts)
  } catch (error: any) {
    res.status(error.status).json({
      message: "Failure To Get Contacts"
    })
  }
}

const getAllKpisDataController = async ({ query, params }: Request, res: Response) => {
  try {
    const { id } = params
    const usersNumber = await getAllKpisData(id)
    res.status(200).json(usersNumber)
  } catch (error: any) {
    res.status(error.status).json({
      message: "Failure To Get Contacts"
    })
  }
}

export {
  createUser,
  deleteUsers,
  addContactController,
  getContactByUserIdController,
  getContactByContactNameController,
  getAllKpisDataController,
};
