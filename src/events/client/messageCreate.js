const Eris = require('eris-additions')(require('eris'));
const cooldowns = new Eris.Collection();
const cmdCooldown = new Map();

module.exports = async (client, message) => {
	let prefix = require('../../config.json').prefix;

	const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message.content) || message.author.bot) return;
	const [ , mp ] = message.content.match(prefixRegex);
	const args = message.content.slice(mp.length).trim().split(/ +/g);
	const commandName = args.shift().toLowerCase();
	const command =
		client.commands.get(commandName) ||
		client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Eris.Collection());
	}

	const now = Date.now();
	const cooldownss = cooldowns.get(command.name);
	const amount = command.cooldown;

	if (cooldownss.has(message.author.id)) {
		const gec = cooldownss.get(message.author.id) + amount;

		if (now < gec) {
			const time = (gec - now) / 1000;
			return message.channel.createMessage(`${message.member.mention}, bu komutu kullanmak için **${time.toFixed(2)}** saniye beklemelisin.`).then((e) => setTimeout(async () => await e.delete(), amount));
		}
	}

	cooldownss.set(message.author.id, now);
	setTimeout(() => cooldownss.delete(message.author.id), amount);

	cooldownss.set(message.author.id, now);
	if (!cmdCooldown.has(message.author.id)) cmdCooldown.set(message.author.id, [ Date.now() ]);
	else {
		cmdCooldown.set(message.author.id, cooldownss);
	}

	try {
		command.execute(message, client, args);
	} catch (e) {
		console.log(e);
	}
};