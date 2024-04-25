import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder, 
  Attachment 
} from "discord.js";
import { v2 as cloudinary } from "cloudinary";

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

async function getTeamLogoImage(team, options = {}) {
  const date = new Date();
  const year = date.getFullYear();
  const url = `${baseUrl}/team/frc${team}/media/${year}`;
  console.log(url);
  options.headers = {
    "X-TBA-Auth-Key": process.env.TBATOKEN, // Replace with your TBA API key
  };

  const mediadata = await fetch(url, options);
  const mediajson = await mediadata.json();
  let firstImage = null;
  for (const item of mediajson) {
    if (item.type === "avatar") {
      if (item.details) {
        firstImage = `https://res.cloudinary.com/detklnnug/image/upload/v1713990383/FRClogo.jpg`;

      } else if (item.direct_url) {
        firstImage = item.direct_url;
      }
      
      break;
    }
  }

  if (firstImage) {
    console.log(`Found Image in TBA: ${firstImage}`);
    return firstImage;
  } else {
    return null;
  }
}

async function tba(teamNumber) {
  const teamData = await getTeamInfo(teamNumber);
  console.log(teamData)
  return {
    ...teamData,
    teamLOGO: await getTeamLogoImage(teamNumber),
  };
}


export default {
  name: "teaminfo",
  description: "Gets info from TBA on a team.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "TBA",
  options: [
    {
      name: "team",
      description: "What team do you want to fetch the info of?",
      type: 10,
      min_value: 0,
      max_value: 10000,
      required: true,
    },
    {
      name: "year",
      description: "What year do you want the info to be from?",
      type: 10,
      min_value: 1992,
      max_value: 10000,
      required: false,
    },
  ],

  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const team = interaction.options.getNumber("team");


    const teaminfo = await tba(team);
    console.log(teaminfo)
    const logo = teaminfo.teamLOGO ||
      `https://res.cloudinary.com/detklnnug/image/upload/v1713904923/firstLogo_k0rlf2.png`;

    const embed = new EmbedBuilder()
      .setTitle(`${teaminfo.team_number} | ${teaminfo.nickname}`)
      .setThumbnail(logo)
      .setDescription(
        ``,
      )
      .setFooter({
        text: `Team ${team}`,
      });
    return interaction.editReply({ embeds: [embed] });
  },
};
