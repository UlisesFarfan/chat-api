"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = require("express");
const fs_1 = require("fs");
const cleanFile_1 = require("../utils/cleanFile");
const router = (0, express_1.Router)();
const PATH_ROUTER = `${__dirname}`;
(0, fs_1.readdirSync)(PATH_ROUTER).filter(fileName => {
    const cleanName = (0, cleanFile_1.cleanFileName)(fileName);
    if (cleanName !== 'index') {
        Promise.resolve(`${`./${cleanName}.routes`}`).then(s => __importStar(require(s))).then(modelRouter => {
            console.log('Route ->', cleanName);
            router.use(`/${cleanName}`, modelRouter.router);
        });
    }
});
exports.default = router;
