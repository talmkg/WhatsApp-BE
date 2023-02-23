import { Schema, model } from 'mongoose'

const ChatsSchema = new Schema({
    members: { type: [Schema.Types.ObjectId], required: true, ref: 'User'},
    messages: { type: [Schema.Types.ObjectId], ref: 'Message'}
})

ChatsSchema.static('isMember', async function(userId, chatId) {
    const foundChat = await this.findById(chatId)
    const isChatMember = foundChat.members.find(member => member._id.toString() === userId)

    if(isChatMember) {
        return true
    } else {
        return false
    }
})

const Chats = model('Chat', ChatsSchema)

export default Chats