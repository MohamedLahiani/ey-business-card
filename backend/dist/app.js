"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// Middleware to parse JSON
app.use(express_1.default.json());
// Basic test route
app.get('/', (req, res) => {
    res.send('EY Business Card Backend is running!');
});
exports.default = app;
