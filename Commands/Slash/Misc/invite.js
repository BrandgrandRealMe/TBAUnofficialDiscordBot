import { ApplicationCommandType } from "discord.js";

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
    const invite = `https://discord.com/oauth2/authorize?client_id=${client_id}&permissions=68608&scope=bot+applications.commands` 
    await client.sendEmbed(interaction, `Invite me with this URL:\n${invite}`);
  },
};
