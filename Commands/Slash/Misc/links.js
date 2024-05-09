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
    
    const botInvite = `https://discord.com/oauth2/authorize?client_id=${client_id}&permissions=68608&scope=bot+applications.commands`;
    const supportServer = `https://discord.gg/27qSubkcqV`;
    const sourceCode = `https://github.com/BrandgrandRealMe/TBAUnofficialDiscordBot`;
    const TOS = `https://brandonthedev.notion.site/Terms-of-Service-for-TBAUnofficial-Discord-Bot-0433859325d74d979f04fa4c75c447ed`;
    const PP = `https://brandonthedev.notion.site/TBAUnofficial-Privacy-Policy-1beb566aa2ce4bd79bb4a7a972818d74?pvs=4`;
    
    
    const embed = new EmbedBuilder() // Create a new embed object
      .setColor(client.config.embed.color) // Set the embed color
      .setTitle('Here are the bots links:')
      .setDescription(`[Invite](${botInvite}) the bot!\n[Join](${supportServer}) the support server.\n[View](${sourceCode}) the source code.\n[View](${TOS}) the TOS.\n[View](${PP}) the Privacy Policy.\n[Vote](${client.config.topgg.url}/vote) for the bot or leave a [review](${client.config.topgg.url}#reviews) on top.gg.`);

    await interaction.reply({ embeds: [embed] }); // Send the embed
  },
};
