import { ApplicationCommandType, EmbedBuilder, ActionRowBuilder,ButtonBuilder } from "discord.js";

/**
 * @type {import("../../../index").Scommand}
 */
export default {
  name: "eventinfo",
  description: "Get info on a event.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "TBA",
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {


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
          value: `${servers}`,
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
