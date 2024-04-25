import {
  ApplicationCommandType,
  EmbedBuilder,
  TextChannel,
  ComponentType,
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
  name: "robot",
  description: "Get or Upload a robot picture.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "DB",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: 1,
      name: "get",
      description: "Get a robot picture.",
      options: [
        {
          type: 10,
          name: "team",
          description: "What team do you want to fetch the robot of?",
          required: true,
        },
        {
          type: 10,
          name: "year",
          description: "What year do you want the image to be from?",
        },
      ],
    },
    {
      type: 1,
      name: "upload",
      description: "Upload an robot picture to the DB.",
      options: [
        {
          type: 10,
          name: "team",
          description: "What team is the robot from?",
          required: true,
        },
        {
          type: 11,
          name: "image",
          description: "The image you want to upload.",
          required: true,
        },
        {
          type: 10,
          name: "year",
          description: "What year is the robot from?",
        },
      ],
    },
  ],

  run: async ({ client, interaction }) => {
    if (!interaction.options.getSubcommand()) return;
    const option = interaction.options.getSubcommand();
    if (option == `get`) {
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
          text: `Team ${team}'s ${year} Robot`,
        })
        .setColor(client.config.embed.color);
      return interaction.editReply({ embeds: [embed] });
    } else if (option == `upload`) {
      const date = new Date();

      await interaction.deferReply();

      const team = interaction.options.getNumber("team");
      const year = interaction.options.getNumber("year") || date.getFullYear();
      const ID = `frc${team}-${year}`;

      const imageData = interaction.options.getAttachment("image");

      const Replyembed = new EmbedBuilder()
        .setDescription(`Uploaded Photo! Now up for review!`)
        .setColor(client.config.embed.color);

      const Dupeembed = new EmbedBuilder()
        .setDescription(`Image already in DB!`)
        .setColor(client.config.embed.color);

      const Reviewembed = new EmbedBuilder()
        .setDescription(`New Photo!`)
        .setImage(imageData.url)
        .setFooter({
          text: `Team ${team}`,
        });

      const Endembed = new EmbedBuilder()
        .setDescription(`New Photo! CLOSED`)
        .setImage(imageData.url)
        .setFooter({
          text: `Team ${team}`,
        })
        .setColor(client.config.embed.color);

      if (await searchImages(`frc${team}-${year}`)) {
        return interaction.editReply({ embeds: [Dupeembed] });
      }

      interaction.editReply({ embeds: [Replyembed] });

      const msg = await client.channels.cache
        .get(client.config.reviewChannel.channelID)
        .send({
          content: `<@&1228029338792890379><@&1228029387233038356><@&1228029254172934214>`,
          embeds: [Reviewembed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 1,
                  label: "Accept",
                  // Our button id, we can use that later to identify,
                  // that the user has clicked this specific button
                  custom_id: `accept_${ID}`,
                },
              ],
            },
          ],
        });
      const filter = (click) => console.log(click);
      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 86400000,
        max: 1,
      });

      collector.on("collect", (i) => {
        console.log(i.member.roles);
        if (
          i.member.roles.cache.has(`1228029338792890379`) ||
          i.member.roles.cache.has(`1228029387233038356`) ||
          i.member.roles.cache.has(`1228029254172934214`)
        ) {
          if (i.customId !== `accept_${ID}`) return;
          const URL = imageData.url;
          i.reply("Uploaded! Team: " + team + " | Year: " + year);
          cloudinary.uploader.upload(
            URL,
            { public_id: ID, tags: ID },
            function (error, result) {
              console.log(result);
            },
          );
        } else {
          i.reply({
            content: `These buttons aren't for you!`,
            ephemeral: true,
          });
        }
      });
      collector.on("end", (collected) => {
        msg.edit({
          content: `<@&1228029338792890379><@&1228029387233038356><@&1228029254172934214>`,
          embeds: [Endembed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 4,
                  disabled: true,
                  label: "Accept",
                  // Our button id, we can use that later to identify,
                  // that the user has clicked this specific button
                  custom_id: `accept_${ID}`,
                },
              ],
            },
          ],
        });
      });
    }
  },
};
