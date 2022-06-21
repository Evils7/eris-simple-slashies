module.exports = {
    name: 'ping',
    description: 'Get the bots latency',
    category: 'Utility',
    cooldown: 5000,
    data: {
        name: 'ping',
        description: 'Shows the bot latency',
        options: []
    },

    execute: async (message, client, args) => {
        const mess = await message.channel.createMessage(`Ping?`)
        await mess.edit(`🏓 Pong! ${Math.abs(message.createdAt - mess.createdAt)}ms`)
    },
    slashExecute: async(client, interaction) => {
        await interaction.createMessage('Pong!')
    }
};