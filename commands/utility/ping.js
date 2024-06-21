const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  // How long the user have to wait before using the command again(cooldown)
  cooldown : 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};