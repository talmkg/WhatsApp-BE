import express from "express";
import { isSignedIn } from "../../lib/auth/isSignedIn.js";
import Users from "./model.js";

const usersRouter = express.Router();

usersRouter.get("/me", isSignedIn, async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id);

    if (user) {
      res.status(200).send({ user });
    } else {
      res
        .status(404)
        .send({ message: `User with id: ${req.user._id} not found` });
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.get("/", isSignedIn, async (req, res, next) => {
  try {
    const { search } = req.query;

    const foundUsers = await Users.find({
      username: { $regex: search, $options: "i" },
    });

    if(foundUsers) {
        res.status(200).send(foundUsers)
    } else {
        res.status(404).send([])
    }
  } catch (error) {
    next(error);
  }
});


export default usersRouter;
