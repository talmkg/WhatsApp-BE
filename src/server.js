import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./api/auth/index.js";
import chatsRouter from "./api/chats/index.js";
import messagesRouter from "./api/messages/index.js";
import usersRouter from "./api/users/index.js";
import createError from "http-errors";

import {
  badRequestHandler,
  genericErrHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errHandlers.js";

const port = process.env.PORT || 3001;
const server = express();

const accessOrigins = [process.env.FE_DEV_URL]

const corsOptions = {
  origin: (origin, corsNext) => {
      console.log(origin)
    if (!origin || accessOrigins.indexOf(origin) !== -1) {
      corsNext(null, true)
    } else {
      corsNext(createError(400, `Access to server denied, your origin: ${origin}`))
    }
  },
}

server.use(cors(corsOptions));
server.use(express.json());

server.use("/auth", authRouter);
server.use("/users", usersRouter);
server.use("/chats", chatsRouter);
server.use("/messages", messagesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("DB:CONNECTED");
  server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
});
