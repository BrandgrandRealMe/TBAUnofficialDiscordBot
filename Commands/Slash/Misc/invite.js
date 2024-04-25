import { ApplicationCommandType, EmbedBuilder } from "discord.js";

/**
 * @type {import("../../../index").Scommand}
 */
export default {
  name: "invite",
  description: "Get the bots invite.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {
    // Code
    const client_id = client.user.id;
    const invite = `https://discord.com/oauth2/authorize?client_id=${client_id}&permissions=68608&scope=bot+applications.commands`;
    const embed = new EmbedBuilder() // Create a new embed object
      .setColor(client.config.embed.color) // Set the embed color
      .setTitle('Invite me with this URL:')
      .setDescription(`${invite}`);

    await interaction.reply({ embeds: [embed] }); // Send the embed
  },
};
