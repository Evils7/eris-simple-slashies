const Eris = require('eris');
require('dotenv').config()

const client = new Eris.Client(`Bot {token}`, {
    restMode: true,
    defaultImageFormat: 'png',
    getAllUsers: true,
    intents: 32767
})

client.commands = new Eris.Collection();
client.slashCommands = []

const fs = require('fs');
const {CommandInteraction} = require("eris");
fs.readdirSync(__dirname+'/commands/').forEach((dir) => {
	const commandFiles = fs.readdirSync(__dirname+`/commands/${dir}/`).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(__dirname+`/commands/${dir}/${file}`);
		client.commands.set(command.name, command)
	}
	commandFiles.forEach((f, i) => {
		require(__dirname+`/commands/${dir}/${f}`);
	});
});
client.on("ready", () => {
	fs.readdirSync(__dirname+'/commands/').forEach((dir) => {
		const commandFiles = fs.readdirSync(__dirname+`/commands/${dir}/`).filter((file) => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(__dirname+`/commands/${dir}/${file}`);
			if (command.data.name) {
				client.createCommand({
					name: command.data.name,
					description: command.data.description,
					options: command.data.options,
					type: 1
				})
				client.slashCommands.push({
					name: command.data.name,
					slashExecute: command.slashExecute
				})
			}
		}
		commandFiles.forEach((f, i) => {
			require(`./commands/${dir}/${f}`);
		});
	});
})


fs.readdirSync(__dirname+'/events/').forEach((dir) => {
	const events = fs.readdirSync(__dirname+`/events/${dir}/`).filter((file) => file.endsWith('.js'));
	for (let file of events) {
		const evt = require(__dirname+`/events/${dir}/${file}`);
		let eName = file.split('.')[0];
		console.log(eName);
		client.on(eName, evt.bind(null, client));
	}
});

client.on("interactionCreate", async (interaction) => {
	if(interaction instanceof CommandInteraction) {
		for(let slashCommand of client.slashCommands) {
			if (slashCommand.name === interaction.data.name) {
				await slashCommand.slashExecute(client, interaction)
				break
			}
		}
	}
})

const connect = async () => {
	await client.connect();
};
connect();