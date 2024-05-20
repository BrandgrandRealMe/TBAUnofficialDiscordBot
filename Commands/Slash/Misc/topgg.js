import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { Pagination } from "pagination.djs";

function countUsernames(users) {
  const userCount = users.reduce((acc, user) => {
    const username = user.username;
    if (!acc[username]) {
      acc[username] = { user, amount: 0 };
    }
    acc[username].amount++;
    return acc;
  }, {});

  const result = Object.values(userCount);
  return result;
}



export default {
  name: "topgg",
  description: "Get info from the bots topgg.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: 1,
      name: "link",
      description: "Get the topgg link.",
    },
    {
      type: 1,
      name: "voted",
      description: "Check if you or a user has voted in the last 12 hours.",
      options: [
        {
          name: 'user',
          description: 'The user you want to know if they have voted.',
          type: 6
        }
      ],
    },
    {
      type: 1,
      name: "votes",
      description: "Get the bots amount of votes on topgg.",
    },
    {
      type: 1,
      name: "voters",
      description: "Get a list of who voted for the bot on topgg.",
    },
  ],

  run: async ({ client, interaction }) => {
    const option = interaction.options.getSubcommand();
    const link = client.config.topgg.url;
    
    if (option === "link") {
      const embed = new EmbedBuilder() // Create a new embed object
        .setColor(client.config.embed.color) // Set the embed color
        .setDescription(`${link}`);

      await interaction.reply({ embeds: [embed] }); // Send the embed
    } else if (option === "voted") {
      const user = interaction.options.getUser("user") || interaction.user;
      const voted = await client.topgg.hasVoted(user.id);

      const embed = new EmbedBuilder() // Create a new embed object
        .setColor(client.config.embed.color) // Set the embed color
        .setDescription(`${voted ? "You have voted!" : `You have not voted yet!\nYou can vote [here](${link})`}`);

      await interaction.reply({ embeds: [embed] }); // Send the embed
    } else if (option === "votes") {
      const votesList = await client.topgg.getVotes();
      const votesAmount = votesList.length;

      const embed = new EmbedBuilder() // Create a new embed object
        .setColor(client.config.embed.color) // Set the embed color
        .setDescription(`I have ${votesAmount} votes!`);

      await interaction.reply({ embeds: [embed] });
    } else if (option === "voters") {
      const votersData = await client.topgg.getVotes();
      
      const voters = countUsernames(votersData);

      console.log(voters)
      const votersAmount = votersData.length;

      const pagination = new Pagination(interaction);

      pagination.setTitle(`List of voters:`).setColor(client.config.embed.color).setFooter({ text: `Total votes: ${votersAmount}` });

      if (voters.length > 0) {
        const votersList = voters.map((voter) => {
          
          return {
            name: `${voter.user.username} x${voter.amount}`,
            value: `ID: ${voter.user.id} | Mention: <@${voter.user.id}>`
          };
        });

        pagination.addFields(votersList);
        pagination.paginateFields(true);

        return pagination.render();
      } else {
        client.sendEmbed(interaction, "No votes found.");
      }
    
    }
  },
};
