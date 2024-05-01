import { ApplicationCommandType, EmbedBuilder, ActionRowBuilder,ButtonBuilder } from "discord.js";

/**
 * @type {import("../../../index").Scommand}
 */
export default {
  name: "stats",
  description: "Get the bots stats.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {
    const client_id = client.user.id;
    const invite = `https://discord.com/oauth2/authorize?client_id=${client_id}&permissions=68608&scope=bot+applications.commands`;

    const embed = new EmbedBuilder() // Create a new embed object
      .setColor(client.config.embed.color) // Set the embed color
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle(`🤖 Bot Stats`)
      .setFields([
        {
          name: `Bot Name:`,
          value: `${client.user.username}`,
          inline: true,
        },
        {
          name: `Bot Developer:`,
          value: `${client.config.Dev.name}`,
          inline: true,
        },
        {
          name: `Servers:`,
          value: `${client.guilds.cache.size}`,
          inline: true,
        },
        {
          name: `Users:`,
          value: `${client.users.cache.size}`,
          inline: true,
        },
        {
          name: `Library:`,
          value: `discord.js`,
          inline: true,
        },
      ]);
    const actionRow = new ActionRowBuilder().addComponents([
      new ButtonBuilder().setLabel("Invite").setURL(invite).setStyle(5),
    ]);

    await interaction.reply({ embeds: [embed], components: [actionRow] }); // Send the embed
  },
};
