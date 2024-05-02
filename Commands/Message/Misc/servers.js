import { Pagination } from "pagination.djs";

export default {
  name: "servers",
  description: "Get a list of servers the bot is in.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  cooldown: 5,

  run: async ({ client, message, args, prefix }) => {
    const userID = message.author.id;
    if (userID !== client.config.Dev.ID) return;
    const pagination = new Pagination(message);
    pagination.setTitle(`Here are the servers I am in:`).setColor(client.config.embed.color)
    const guilds = await client.guilds.fetch();
    console.log(guilds)
    const guildsMap = guilds.map((guild) => {
      return {
        name: guild.name,
        value: `${guild.id}`
      };
    });
    pagination.addFields(guildsMap);
    pagination.paginateFields(true);
    return pagination.render();
  },
};