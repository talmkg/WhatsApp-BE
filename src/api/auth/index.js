import express from "express";
import { createAccessToken } from "../../lib/auth/jwtTokens.js";
import Users from "../users/model.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (email && password && username) {
      const newUser = new Users(req.body);
      const { _id } = await newUser.save();

      res.status(201).send({ user: _id });
    } else {
      res
        .status(400)
        .send({ message: "Please sign up with email, username and password" });
    }
  } catch (error) {
    next(error);
  }
});
authRouter.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const user = await Users.checkCredentials(email, password);

      if (user) {
        const userPayload = { _id: user._id, username: user.username };
        const token = await createAccessToken(userPayload);
        res.status(200).send({ token });
      } else {
        res.status(404).send({ message: `Email and password don't match` });
      }
    } else {
      res.status(400).send({ message: "Please enter both email and password" });
    }
  } catch (error) {
    next(error);
  }
});

export default authRouter;
