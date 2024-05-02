import { ApplicationCommandType, EmbedBuilder } from "discord.js";

/**
 * @type {import("../../../index").Scommand}
 */
export default {
  name: "privacy",
  description: "Get the bots Privacy policy.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {
    const PP = `https://brandonthedev.notion.site/TBAUnofficial-Privacy-Policy-1beb566aa2ce4bd79bb4a7a972818d74?pvs=4`;
    const embed = new EmbedBuilder() // Create a new embed object
      .setColor(client.config.embed.color) // Set the embed color
      .setTitle('View the Privacy policy:')
      .setDescription(`${PP}`);

    await interaction.reply({ embeds: [embed] }); // Send the embed
  },
};
