import { ApplicationCommandType, EmbedBuilder } from "discord.js";

/**
 * @type {import("../../../index").Scommand}
 */
export default {
  name: "servers",
  description: "Get some FRC servers.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {
    // Code
    const embed = new EmbedBuilder() // Create a new embed object
      .setColor(client.config.embed.color) // Set the embed color
      .setDescription(`Here are some FRC servers:`)
      .addFields([
        {
          name: `Unofficial FIRST Robotics Server`,
          value: `https://discord.gg/frc`,
        },
        {
          name: `FRC Media Server`,
          value: `https://discord.gg/27qSubkcqV`,
        },
        {
          name: `FRC Scouting & Strategy Server`,
          value: `https://discord.gg/69RA3ArNA5`,
        }
      ]);

    await interaction.reply({ embeds: [embed] }); // Send the embed
  },
};
