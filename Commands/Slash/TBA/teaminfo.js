import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  Attachment,
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
    return firstImage;
  } else {
    return null;
  }
}

async function tba(teamNumber) {
  const teamData = await getTeamInfo(teamNumber);
  console.log(teamData);
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
  ],

  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const team = interaction.options.getNumber("team");

    const teaminfo = await tba(team);

    const rookieyear = `${teaminfo.rookie_year}` || "None";
    const motto = teaminfo.motto || "None";
    const location = `Country: ${teaminfo.country || `Not Provided`}\nState: ${teaminfo.state_prov || `Not Provided`}\nCity: ${teaminfo.city || `Not Provided`}\nZIP code: ${teaminfo.postal_code || `Not Provided`}\nSchool: ${teaminfo.school_name || `Not Provided`}`;
    const website = teaminfo.website || "None";
    const logo =
      teaminfo.teamLOGO ||
      `https://res.cloudinary.com/detklnnug/image/upload/v1713904923/firstLogo_k0rlf2.png`;

    const embed = new EmbedBuilder()
      .setTitle(`${teaminfo.team_number} | ${teaminfo.nickname}`)
      .setThumbnail(logo)
      .setColor(client.config.embed.color)
      .setDescription(teaminfo.name)
      .addFields([
        {
          name: `Rookie Year`,
          value: rookieyear,
        },
        {
          name: `Motto`,
          value: motto,
        },
        {
          name: `Location`,
          value: location,
        },
        {
          name: `Website`,
          value: website,
        },
      ])
      .setFooter({
        text: `Team ${team}`,
      });
    return interaction.editReply({ embeds: [embed] });
  },
};
