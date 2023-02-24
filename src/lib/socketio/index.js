let onlineUser = []

export const newConnectionHandler = client => {
    console.log(client.id)

    client.on('join_room', (chatId) => {
        client.join(chatId)

        client.on('send_message', (data) => {
            client.broadcast.to(data.chatId).emit('receive_message', data)
        })
    })

    client.on('leave_room', (chatId) => {
        client.leave(chatId)
        console.log('chat left', chatId)
    })

    client.on('disconnecting', (socket) => {
        console.log('disconnected', socket)
  
    })
}