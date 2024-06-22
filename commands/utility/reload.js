const {SlashCommandBuilder} = require('discord.js');

module.export = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload a command')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The command to relload')
        .setRequired(true)),
  async execute(interaction){
    const commandName = interaction.option.getString('command',true).toLowerCase();
    const command = interaction.client.commands.get(commandName);
    if (!command) {
      return interaction.reply(`There is no command with the name \`${commandName}\`!`);
  }
    delete require.cache[require.resolve(`./${command.data.name}.js`)];
    try{
      const newCommand = require(`./${command.data.name}.js`);
      interaction.client.commands.set(commandName, newCommand);
      await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded successfully`);
    }catch(error){
      console.error(error);
      await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
    }

}
};