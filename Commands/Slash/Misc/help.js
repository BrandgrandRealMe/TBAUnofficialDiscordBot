import { ApplicationCommandType, EmbedBuilder } from "discord.js";

/**
 * @type {import("../../../index").Scommand}
 */
export default {
  name: "help",
  description: "Get help with the bot.",
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
    const topgg = client.urls.vote.topgg;
    const dbl = client.urls.vote.discordbotlist;
    const donate = client.urls.donate;
    const TOS = `${websiteURL}tos`;
    const PP = `${websiteURL}privacy`;

    const embed = new EmbedBuilder() // Create a new embed object
      .setColor(client.config.embed.color) // Set the embed color
      .setAuthor({
        name: `${client.user.username} Help`,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields(
        {
          name: "Learn about the bot!",
          value: `You can learn more about the bot on its website [here](${websiteURL}).`,
        },
        {
          name: "Get support",
          value: `You can get support in our [Discord server](${supportServer}).`,
        },
        {
          name: "Invite the bot",
          value: `You can invite the bot [here](${botInvite}).`,
        },
        {
          name: "View the source code",
          value: `You can view how the bot works under the hood [here](${sourceCode}).`,
        },
        {
          name: "View the legal stuff",
          value: `You can view the [TOS](${TOS}) and the [Privacy Policy](${PP}).`,
        },
        {
          name: "Vote for the bot",
          value: `You can vote on [topgg](${topgg}) and [discordbotlist](${dbl}).`,
        },
        {
          name: "Donate to the developer",
          value: `You can give me money [here](${donate}).`,
        },
      );

    await interaction.reply({ embeds: [embed] }); // Send the embed
  },
};
