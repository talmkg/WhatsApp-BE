import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./api/auth/index.js";
import chatsRouter from "./api/chats/index.js";
import messagesRouter from "./api/messages/index.js";
import usersRouter from "./api/users/index.js";
import createError from "http-errors";
import { Server } from 'socket.io'
import http from 'http'
import { newConnectionHandler } from "./lib/socketio/index.js";

import {
  badRequestHandler,
  genericErrHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errHandlers.js";

const port = process.env.PORT || 3001;
const app = express();

const accessOrigins = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOptions = {
  origin: (origin, corsNext) => {
    if (!origin || accessOrigins.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(
        createError(400, `Access to server denied, your origin: ${origin}`)
      );
    }
  },
};
//cors
app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);

app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrHandler);

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://wapp-fe.vercel.app']
    
  }
})

io.on('connection', newConnectionHandler)

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("DB:CONNECTED");
  server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
});
