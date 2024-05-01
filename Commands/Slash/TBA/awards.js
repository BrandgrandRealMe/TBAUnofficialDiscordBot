import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder, 
  Attachment 
} from "discord.js";
import { v2 as cloudinary } from "cloudinary";
import { Pagination } from "pagination.djs";
import { TBAaddToken, teamInfo, teamAwards } from "../CMDPackages/tba.js";

cloudinary.config({
  cloud_name: "detklnnug",
  api_key: "964959785329618",
  api_secret: process.env.CLOUDINARYTOKEN,
});

TBAaddToken(process.env.TBATOKEN);

async function tba(teamNumber, year) {
  const teamData = await teamInfo(teamNumber);
  console.log(teamData)
  return {
    ...teamData,
    awards: await teamAwards(teamNumber, year),
  };
}


export default {
  name: "awards",
  description: "Gets a teams awards from TBA.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "TBA",
  options: [
    {
      name: "team",
      description: "What team do you want to fetch the awards of?",
      type: 10,
      min_value: 0,
      max_value: 10000,
      required: true,
    },
    {
      name: "year",
      description: "What year do you want the awards to be from?",
      type: 10,
      min_value: 0,
      max_value: 10000,
      required: false,
    }
  ],

  run: async ({ client, interaction }) => {
    const date = new Date();
    
    const pagination = new Pagination(interaction);


    const team = interaction.options.getNumber("team");
    const year = interaction.options.getNumber("year");


    const teaminfo = await tba(team, year);
    const awards = teaminfo.awards;

    
      pagination.setTitle(`${teaminfo.team_number} | ${teaminfo.nickname}`).setColor(client.config.embed.color)
    if (year) {
      pagination.setFooter({ text: `Team ${team}'s ${year} Awards` });
    } else {
      pagination.setFooter({ text: `Team ${team}'s Awards` });
    }
      


    if (awards.length > 0) {
      const awardList = awards.map((award) => {
        console.log(award)
        const awardName = award.name;
        const event = award.event_key;
        const year = award.year;

        return {
          name: `${awardName}`,
          value: `Year: \`${year}\` | Event: \`${event}\``
        };
      });

      pagination.addFields(awardList);
    }
    pagination.paginateFields(true);

    return pagination.render();
  },
};
