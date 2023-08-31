"use strict";
// src/utils/cleanFile.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanFileName = void 0;
const cleanFileName = (fileName) => {
    const file = fileName.split('.').shift();
    return file;
};
exports.cleanFileName = cleanFileName;
