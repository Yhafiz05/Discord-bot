const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data : new SlashCommandBuilder()
      .setName('hello')
      .setDescription('Just say hello to the user'),

    async execute(interaction){
        interaction.reply(`Hello ${interaction.user.username}, glad to see you`)
    },

};