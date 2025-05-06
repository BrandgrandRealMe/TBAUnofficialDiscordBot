import { ApplicationCommandType, EmbedBuilder } from "discord.js";

/**
 * @type {import("../../../index").Scommand}
 */
export default {
  name: "gallery",
  description: "Get the gallery link.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {
    // Code
    await interaction.reply({ content: `View the gallery here: https://frcrobots.brandgrand.rocks/` }); // Send the embed
  },
};
