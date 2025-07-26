"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("../src/app"));
const mongoose_1 = require("../src/lib/mongoose");
const winston_1 = require("../src/lib/winston");
let isConnected = false;
const handler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isConnected) {
        yield (0, mongoose_1.connectToDatabase)();
        isConnected = true;
        winston_1.logger.info('Connected to DB');
    }
    const server = (0, http_1.createServer)(app_1.default);
    server.emit('request', req, res);
});
exports.default = handler;
