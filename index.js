//Require the necesssary discord.js classes
// Client is 
//Evenst represents the events that the bot can listen.
//GatewayIntentBits (permissions) are all the the type of events that the bot can follows
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('../config/config.json');

//Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
//Import the node's native file system module to read the command directory
const fs = require('node:fs');
//Import the node's native path module 
const path = require('node:path');
const { sourceMapsEnabled } = require('node:process');

client.commands = new Collection();
//Contrusct a path relate to the OS to 'commands'
const foldersPath = path.join(__dirname, 'commands');
console.log(foldersPath);
//Read all directories in foldersPath and put theses in an array
const commandFolders = fs.readdirSync(foldersPath);
  
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
  console.log(commandsPath);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  console.log(commandFiles);
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