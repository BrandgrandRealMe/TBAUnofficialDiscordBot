import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
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

async function getTeamRobotImage(team, year, options = {}) {
  const url = `${baseUrl}/team/frc${team}/media/${year}`;
  console.log(url);
  options.headers = {
    "X-TBA-Auth-Key": process.env.TBATOKEN, // Replace with your TBA API key
  };

  const mediadata = await fetch(url, options);
  const mediajson = await mediadata.json();
  let firstImage = null;
  for (const item of mediajson) {
    if (item.type === "image" || item.type === "imgur") {
      firstImage = `https://i.imgur.com/${item.foreign_key}.png`;
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

async function tba(teamNumber, year) {
  const teamData = await getTeamInfo(teamNumber, year);
  return {
    ...teamData,
    robotImageUrl: await getTeamRobotImage(teamNumber, year),
  };
}

const searchImages = async (searchExpression) => {
  const data = await cloudinary.search
    .expression(`public_id:${searchExpression}`)
    .execute();
  console.log(data);
  if (data.total_count !== 0) {
    return data.resources[0].url;
  } else {
    return null;
  }
};

export default {
  name: "get",
  description: "Gets a bots image from TBA or our db.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "DB",
  options: [
    {
      name: "team",
      description: "What team do you want to fetch the robot of?",
      type: 10,
      min_value: 0,
      max_value: 10000,
      required: true,
    },
    {
      name: "year",
      description: "What year do you want the image to be from?",
      type: 10,
      min_value: 0,
      max_value: 10000,
      required: false,
    },
  ],

  run: async ({ client, interaction }) => {
    const date = new Date();
    await interaction.deferReply();

    const team = interaction.options.getNumber("team");
    const year = interaction.options.getNumber("year") || date.getFullYear();
    console.log(year);

    const teaminfo = await tba(team, year);
    const image =
      (await searchImages(`frc${team}-${year}`)) ||
      teaminfo.robotImageUrl ||
      `https://res.cloudinary.com/detklnnug/image/upload/v1713904923/firstLogo_k0rlf2.png`;
    console.log(`Image URL: ${image}`);

    const embed = new EmbedBuilder()
      .setTitle(`${teaminfo.team_number} | ${teaminfo.nickname}`)
      .setImage(image)
      .setDescription(
        `Rookie Year: ${teaminfo.rookie_year}\nSchool: ${teaminfo.school_name}`,
      )
      .setFooter({
        text: `Team ${team} | Year ${year}`,
      });
    return interaction.editReply({ embeds: [embed] });
  },
};
