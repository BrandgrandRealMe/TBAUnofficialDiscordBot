export default {
  name: "kill",
  description: "Kill the bot. (owner)",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages"],
  category: "util",
  cooldown: 5,

  run: async ({ client, message }) => {
    const userID = message.author.id;
    if (userID !== client.config.Dev.ID) return;
    client.sendEmbed(message, `Killing bot now!`)
    .then(message => client.destroy())
    }
};
