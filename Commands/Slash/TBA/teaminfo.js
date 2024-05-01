import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";

import { TBAaddToken, teamInfo, teamLogo } from "frctbaapi";
import { v2 as cloudinary } from "cloudinary";

TBAaddToken(process.env.TBATOKEN);

cloudinary.config({
  cloud_name: "detklnnug",
  api_key: "964959785329618",
  api_secret: process.env.CLOUDINARYTOKEN,
});

async function tba(teamNumber) {
  const teamData = await teamInfo(teamNumber);
  return {
    ...teamData,
    teamLOGO: await teamLogo(teamNumber),
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
    const location = `**Country**: ${teaminfo.country || `Not Provided`}\n**State**: ${teaminfo.state_prov || `Not Provided`}\n**City**: ${teaminfo.city || `Not Provided`}\n**ZIP code**: ${teaminfo.postal_code || `Not Provided`}\n**School**: ${teaminfo.school_name || `Not Provided`}`;
    const website = teaminfo.website || "None";

    let attachment = ``;
    let embed = new EmbedBuilder()
      .setTitle(`${teaminfo.team_number} | ${teaminfo.nickname}`)
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
        text: `Team ${team}'s info`,
      });
    if (teaminfo.teamLOGO) {
      if (teaminfo.teamLOGO.details) {
        if (!teaminfo.teamLOGO.details.base64Image) return;
        attachment = new AttachmentBuilder(
          Buffer.from(teaminfo.teamLOGO.details.base64Image, "base64"),
        ).setName("img.png");
        embed.setThumbnail(`attachment://${attachment.name}`);
        return interaction.editReply({ embeds: [embed], files: [attachment] });
      } else if (teaminfo.teamLOGO.direct_url) {
        logo = item.direct_url;
        embed.setThumbnail(logo);
        return interaction.editReply({ embeds: [embed] });
      }
    }
  },
};
