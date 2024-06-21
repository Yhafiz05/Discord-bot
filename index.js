//Require the necesssary discord.js classes
// Client is 
//Evenst represents the events that the bot can listen.
//GatewayIntentBits (permissions) are all the the type of events that the bot can follows
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config/config.json');
//Import the node's native file system module to read the command directory
const fs = require('node:fs');
//Import the node's native path module 
const path = require('node:path');
const interactionCreate = require('./events/interactionCreate');

//Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
//Construct a path relate to the OS to 'commands'
const foldersPath = path.join(__dirname, 'commands');
//Read all directories in foldersPath and put theses in an array
const commandFolders = fs.readdirSync(foldersPath);
  
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventPath = path.join(__dirname,'events');
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

for(const file of eventFiles){
	const filepath = path.join(eventPath,file);
	const event = require(filepath);
	if(event.once){
		client.once(event.name, (...args) => event.execute(...args));
	}else{
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//Define client cooldowns
client.cooldowns = new Collection();
const { cooldowns } = interaction.client;

if(!cooldowns.has(command.data.name)){
	cooldowns.set(command.data.name,new Collection());
}

const now = Date.now();
const timestamps = cooldowns.get(command.data.name);
const defaultCooldownDuration = 3;
const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

if(timestamps.has(interaction.user.id)){
	const expiration = timestamps.get(intercaction.user.id) + cooldownAmount;

	if(now < expiration){
		const expirationTimestamp = Math.round(expiration/1_000);
		return interaction.reply({
			content : `Please wait, you are on a cooldown for \'${command.data.name}\'. You can use it again in <t:${expirationTimestamp}:R>`, ephemeral : true
		});
	}
}
try{
	timestamps.set(interaction.user.id,now);
	setTimeout(() => timestamps.delete(interaction.user.id),cooldownAmount);
}catch(error){
	console.error(error);
}

client.login(token);