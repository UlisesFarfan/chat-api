"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
require("dotenv/config");
// application with express
const app_1 = __importDefault(require("./src/app"));
// database connection
const database_1 = __importDefault(require("./src/config/database"));
// if the connection to the database is successful, we start the server
database_1.default.then(() => {
    app_1.default.listen(process.env.PORT, () => {
        console.log('listening on port ' + process.env.PORT);
    });
});
