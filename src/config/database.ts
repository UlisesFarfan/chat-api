// src/config/database.ts

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_DB as string;

// I connect to my mongo database
const connection = mongoose.connect(MONGO_URI);

export default connection;
