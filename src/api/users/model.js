import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UsersSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  avatar: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg",
  },
  status: { type: String, enum: ["online", "offline"], default: "offline" },
});

UsersSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const plainPw = user.password;

    const hashedPw = await bcrypt.hash(plainPw, 11);
    user.password = hashedPw;
  }

  next();
});

UsersSchema.static("checkCredentials", async function (email, password) {
  const foundUser = await this.findOne({ email: email });

  if (foundUser) {
    const pwMatch = await bcrypt.compare(password, foundUser.password);

    if (pwMatch) {
      return foundUser;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

UsersSchema.methods.toJSON = function () {
  const userDoc = this;
  const user = userDoc.toObject();

  delete user.password;
  delete user.__v;
  delete user.email;

  return user;
};

const Users = model("User", UsersSchema);

export default Users;
