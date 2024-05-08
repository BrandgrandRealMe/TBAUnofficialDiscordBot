import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";

import { TBAaddToken, teamInfo, getTeamMedia } from "../CMDPackages/tba.js";
import { v2 as cloudinary } from "cloudinary";

TBAaddToken(process.env.TBATOKEN);


async function tba(teamNumber, year) {
  const teamData = await teamInfo(teamNumber);
  return {
    ...teamData,
    teamMedia: await getTeamMedia(teamNumber, year),
  };
}

export default {
  name: "getcad",
  description: "Gets a teams cad for a robot.",
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
      description: "What year is the robot from?",
      type: 10,
      min_value: 0,
      max_value: 9999,
      required: false,
    }
  ],

  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const team = interaction.options.getNumber("team");
    
    const date = new Date();
    const year = interaction.options.getNumber("year") || date.getFullYear();
    
    const data = await tba(team, year);
    const cad = data.teamMedia.find(item => item.type === "onshape");  
    if (!cad) return client.sendEmbed(interaction, "No cad found for this team.");
    
    let embed = new EmbedBuilder()
      .setTitle(`${data.team_number} | ${data.nickname}`)
      .setColor(client.config.embed.color)
      .setDescription(data.name)
      .setImage(cad.details.model_image)
      .setFooter({
        text: `Team ${team}'s cad for ${year}`,
      });
    return interaction.editReply({
      embeds: [embed],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              label: "View CAD",
              url: `${cad.view_url}`
            },
          ],
        },
      ],
    });
  },
};
