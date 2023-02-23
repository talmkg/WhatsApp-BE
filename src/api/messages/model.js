import { Schema, model } from "mongoose";

const MessagesSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: {
      text: { type: String, required: true },
    },
  },
  { timestamps: true }
);

MessagesSchema.methods.toJSON = function () {
  const message = this.toObject()

  delete message.updatedAt
  delete message.__v

  return message
}

const Messages = model("Message", MessagesSchema);

export default Messages;
