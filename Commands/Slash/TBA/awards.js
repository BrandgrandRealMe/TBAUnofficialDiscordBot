import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder, 
  Attachment 
} from "discord.js";
import { v2 as cloudinary } from "cloudinary";
import { Pagination } from "pagination.djs";



const baseUrl = "https://www.thebluealliance.com/api/v3";

cloudinary.config({
  cloud_name: "detklnnug",
  api_key: "964959785329618",
  api_secret: process.env.CLOUDINARYTOKEN,
});

async function getTeamInfo(team, year, options = {}) {
  const url = `${baseUrl}/team/frc${team}`;
  console.log(url);
  options.headers = {
    "X-TBA-Auth-Key": process.env.TBATOKEN, // Replace with your TBA API key
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((data) => data);
}


async function getTeamAwards(team, year, options = {}) {
  let url = "";
  if (year) {
    url = `${baseUrl}/team/frc${team}/awards/${year}`;
  } else {
    url = `${baseUrl}/team/frc${team}/awards`;
  }
  
  console.log(url);
  options.headers = {
    "X-TBA-Auth-Key": process.env.TBATOKEN, // Replace with your TBA API key
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((data) => data);
}

async function tba(teamNumber, year) {
  const teamData = await getTeamInfo(teamNumber);
  console.log(teamData)
  return {
    ...teamData,
    awards: await getTeamAwards(teamNumber, year),
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

    
      pagination.setTitle(`${teaminfo.team_number} | ${teaminfo.nickname}`)
    if (year) {
      pagination.setFooter({ text: `Team ${team} | Year ${year}` });
    } else {
      pagination.setFooter({ text: `Team ${team}` });
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
