import { ApplicationCommandType, EmbedBuilder } from "discord.js";

/**
 * @type {import("../../../index").Scommand}
 */
export default {
  name: "tos",
  description: "Get the bots TOS.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {
    const TOS = `https://brandonthedev.notion.site/Terms-of-Service-for-TBAUnofficial-Discord-Bot-0433859325d74d979f04fa4c75c447ed`;
    const embed = new EmbedBuilder() // Create a new embed object
      .setColor(client.config.embed.color) // Set the embed color
      .setTitle('View the TOS:')
      .setDescription(`${TOS}`);

    await interaction.reply({ embeds: [embed] }); // Send the embed
  },
};
