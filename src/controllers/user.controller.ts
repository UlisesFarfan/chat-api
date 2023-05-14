import { Request, Response } from "express";
import { deleteUserById, serviceCreateUser, addContact } from "../services/user.service";

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
    const messageDelete = await deleteUserById(params._id);

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

const controllerAddContact = async ({ body }: Request, res: Response) => {
  try {
    const { userId, contactId } = body
    const addContactMessage = addContact(userId, contactId)
    res.status(200).json({
      message: addContactMessage
    })
  } catch (error: any) {
    res.status(error.status).json({
      message: "Failure To Add Contact"
    })
  }
};

export { createUser, deleteUsers, controllerAddContact };
