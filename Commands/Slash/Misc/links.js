import { ApplicationCommandType, EmbedBuilder } from "discord.js";

/**
 * @type {import("../../../index").Scommand}
 */
export default {
  name: "links",
  aliases: ["link", "support", "invite"],
  description: "Get the bots links.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {
    const client_id = client.user.id;

    const websiteURL = client.urls.website;
    const botInvite = client.urls.invite;
    const supportServer = client.urls.support;
    const sourceCode = client.urls.source;
    const TOS = `${websiteURL}tos`;
    const PP = `${websiteURL}privacy`;
    
    
    const embed = new EmbedBuilder() // Create a new embed object
      .setColor(client.config.embed.color) // Set the embed color
      .setTitle('Here are the bots links:')
      .setDescription(`View the [Website](${websiteURL})!\n[Invite](${botInvite}) the bot!\n[Join](${supportServer}) the support server.\n[View](${sourceCode}) the source code.\n[View](${TOS}) the TOS.\n[View](${PP}) the Privacy Policy.\n[Vote](${client.config.topgg.url}/vote) for the bot or leave a [review](${client.config.topgg.url}#reviews) on top.gg.`);

    await interaction.reply({ embeds: [embed] }); // Send the embed
  },
};
