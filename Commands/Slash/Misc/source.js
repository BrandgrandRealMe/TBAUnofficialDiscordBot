import { ApplicationCommandType, EmbedBuilder } from "discord.js";

/**
 * @type {import("../../../index").Scommand}
 */
export default {
  name: "source",
  description: "Get the bots source code.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {
    // Code
    const embed = new EmbedBuilder() // Create a new embed object
      .setColor(client.config.embed.color) // Set the embed color
      .setDescription(`https://github.com/BrandgrandRealMe/FRCTBAAPI`)
      .setTitle(`Here is the bots source code!`)

    await interaction.reply({ embeds: [embed] }); // Send the embed
  },
};
