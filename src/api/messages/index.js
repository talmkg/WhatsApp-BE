import express from "express";
import { isSignedIn } from "../../lib/auth/isSignedIn.js";
import Chats from "../chats/model.js";
import Users from "../users/model.js";
import Messages from "./model.js";

const messagesRouter = express.Router()

messagesRouter.post('/:chatId', isSignedIn, async (req, res, next) => {
    try {
        const isChatMember = await Chats.isMember(req.user._id, req.params.chatId)

        if(isChatMember) {
            const currentChat = await Chats.findById(req.params.chatId)
            const currentUser = await Users.findById(req.user._id)

            const newMessage = new Messages(req.body)
            newMessage.sender = currentUser
            currentChat.messages.push(newMessage)

            await currentChat.save()
            const mess = await newMessage.save()

            res.send(mess)
        } else{
            res.status(401).send({ message: 'You are not a member of this chat room'})
        }
        
    } catch (error) {
        next(error)
    }
})


export default messagesRouter