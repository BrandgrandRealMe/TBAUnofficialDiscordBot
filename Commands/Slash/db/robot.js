import {
  ApplicationCommandType,
  EmbedBuilder,
  TextChannel,
  ComponentType,
} from "discord.js";
import { v2 as cloudinary } from "cloudinary";

import { TBAaddToken, teamInfo, teamRobotImage } from "frctbaapi";


TBAaddToken(process.env.TBATOKEN);

cloudinary.config({
  cloud_name: "detklnnug",
  api_key: "964959785329618",
  api_secret: process.env.CLOUDINARYTOKEN,
});

async function tba(teamNumber, year) {
  const teamData = await teamInfo(teamNumber);
  return {
    ...teamData,
    robotImageUrl: await teamRobotImage(teamNumber, year),
  };
}

const searchImages = async (searchExpression) => {
  const data = await cloudinary.search
    .expression(`public_id:${searchExpression}`)
    .execute();
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
    {
      type: 1,
      name: "remove",
      description: "Remove an robot picture from the DB.",
      options: [
        {
          type: 10,
          name: "team",
          description: "What teams robot would you like to remove from the DB?",
          required: true,
        },
        {
          type: 10,
          name: "year",
          description: "What is the year of the robot would you like to remove from the DB?",
        },
      ],
    },
  ],

  run: async ({ client, interaction }) => {
    const muser = interaction.member; // For upload
    const user = interaction.user; // For Upload
    
    if (!interaction.options.getSubcommand()) return;
    const option = interaction.options.getSubcommand();
    if (option == `get`) {
      const date = new Date();
      await interaction.deferReply();

      const team = interaction.options.getNumber("team");
      const year = interaction.options.getNumber("year") || date.getFullYear();

      const teaminfo = await tba(team, year);
      let image = null;
      let Source = null;
      if (await searchImages(`frc${team}-${year}`)) {
        image = await searchImages(`frc${team}-${year}`);
        Source = "DB";
      } else if (teaminfo.robotImageUrl) {
        image = teaminfo.robotImageUrl;
        Source = "TBA";
      } else {
        image = `https://res.cloudinary.com/detklnnug/image/upload/v1713904923/firstLogo_k0rlf2.png`;
        Source = "None";
      };
      
      const embed = new EmbedBuilder()
        .setTitle(`${teaminfo.team_number} | ${teaminfo.nickname}`)
        .setImage(image)
        .setDescription(
          `Rookie Year: ${teaminfo.rookie_year}\nSchool: ${teaminfo.school_name}`,
        )
        .setFooter({
          text: `Team ${team}'s ${year} Robot | Source: ${Source}`,
        })
        .setColor(client.config.embed.color);
      return interaction.editReply({ embeds: [embed] });
    } else if (option == `upload`) {
      let uploaded = false;
      const date = new Date();

      await interaction.deferReply();

      const team = interaction.options.getNumber("team");
      const year = interaction.options.getNumber("year") || date.getFullYear();
      const ID = `frc${team}-${year}`;

      const imageData = interaction.options.getAttachment("image");

      const Replyembed = new EmbedBuilder()
        .setDescription(`Uploaded Photo! Now up for review!\nIf you dont see it uploaded in 24 hours go to the support server and open a support post.\nGet to the support server by doing \`/support\`\n**DO NOT UPLOAD MORE THEN ONCE**`)
        .setColor(client.config.embed.color);

      const Dupeembed = new EmbedBuilder()
        .setDescription(`Image already in DB!`)
        .setColor(client.config.embed.color);

      const Reviewembed = new EmbedBuilder()
        .setDescription(`New Photo!`)
        .setImage(imageData.url)
        .setColor(client.config.embed.color)
        .setFields([
          {
            name: `Team:`,
            value: `${team}`,
            inline: true,
          },
          {
            name: `Year:`,
            value: `${year}`,
            inline: true,
          },
          {
            name: `Uploader ID:`,
            value: `${user.id}`,
            inline: true,
          },
          {
            name: `Uploader Username:`,
            value: `${user.username}`,
            inline: true,
          }
        ])
        .setTimestamp()

      const Endembed = new EmbedBuilder()
        .setDescription(`New Photo! CLOSED`)
        .setImage(imageData.url)
        .setColor(client.config.embed.color)
        .setFields([
          {
            name: `Team:`,
            value: `${team}`,
            inline: true,
          },
          {
            name: `Year:`,
            value: `${year}`,
            inline: true,
          },
          {
            name: `Uploader ID:`,
            value: `${user.id}`,
            inline: true,
          },
          {
            name: `Uploader Username:`,
            value: `${user.username}`,
            inline: true,
          }
        ])
        .setTimestamp()
      .setFooter({
        text: `Submitted at`,
      });

      if (await searchImages(`frc${team}-${year}`)) {
        return interaction.editReply({ embeds: [Dupeembed] });
      }

      interaction.editReply({ embeds: [Replyembed] });

      const msg = await client.channels.cache
        .get(client.config.reviewChannel.channelID)
        .send({
          content: `<@&1266460794456117248> <@&1266439910953320621> <@&1266439910953320620> <@&1266439910953320619>`,
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
                  custom_id: `upload_accept_${ID}`,
                },
                {
                  type: 2,
                  style: 4,
                  label: "Decline",
                  // Our button id, we can use that later to identify,
                  // that the user has clicked this specific button
                  custom_id: `upload_decline_${ID}`,
                },
              ],
            },
          ],
        });
      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 86400000,
        max: 1,
      });

      collector.on("collect", (i) => {
        if (
          i.member.roles.cache.has(`1266460794456117248`) ||
          i.member.roles.cache.has(`1266439910953320621`) ||
          i.member.roles.cache.has(`1266439910953320620`) ||
          i.member.roles.cache.has(`1266439910953320619`)
        ) {
          if (i.customId === `upload_decline_${ID}`) {
            Endembed.setFooter({
              text: `Declined | Submitted at`,
            })
            i.reply("Declined. Team: " + team + " | Year: " + year);
            return;
          }
          if (i.customId !== `upload_accept_${ID}`) return;
          const URL = imageData.url;
          Endembed.setFooter({
            text: `Uploaded! | Submitted at`,
          })
          i.reply("Uploaded! Team: " + team + " | Year: " + year);
          cloudinary.uploader.upload(
            URL,
            { public_id: ID, tags: [ID, "robots"] },
            function (error, result) {
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
                  style: 1,
                  disabled: true,
                  label: "Accept",
                  // Our button id, we can use that later to identify,
                  // that the user has clicked this specific button
                  custom_id: `upload_accept_${ID}`,
                },
                {
                  type: 2,
                  style: 4,
                  disabled: true,
                  label: "Decline",
                  // Our button id, we can use that later to identify,
                  // that the user has clicked this specific button
                  custom_id: `upload_decline_${ID}`,
                },
              ],
            },
          ],
        });
      });
    } else if (option == `remove`) {
      let uploaded = true;
      const date = new Date();

      await interaction.deferReply();

      const team = interaction.options.getNumber("team");
      const year = interaction.options.getNumber("year") || date.getFullYear();
      const ID = `frc${team}-${year}`;

      const image = await searchImages(`frc${team}-${year}`);

      const NotFoundembed = new EmbedBuilder()
        .setDescription(`Image not in DB!`)
        .setColor(client.config.embed.color);

      const Replyembed = new EmbedBuilder()
      .setDescription(`Image removal request now up for review!\nIf you dont see it removed in 24 hours go to the support server and open a support post.\nGet to the support server by doing \`/support\`\n**DO NOT REQUEST MORE THEN ONCE**`)
      .setColor(client.config.embed.color);

      const Reviewembed = new EmbedBuilder()
        .setDescription(`New Photo Removal request!`)
        .setImage(image)
        .setColor(client.config.embed.color)
        .setFields([
          {
            name: `Team:`,
            value: `${team}`,
            inline: true,
          },
          {
            name: `Year:`,
            value: `${year}`,
            inline: true,
          },
          {
            name: `Uploader ID:`,
            value: `${user.id}`,
            inline: true,
          },
          {
            name: `Uploader Username:`,
            value: `${user.username}`,
            inline: true,
          }
        ])
        .setTimestamp()

      const Endembed = new EmbedBuilder()
        .setDescription(`New Photo Removal request! CLOSED`)
        .setImage(image)
        .setColor(client.config.embed.color)
        .setFields([
          {
            name: `Team:`,
            value: `${team}`,
            inline: true,
          },
          {
            name: `Year:`,
            value: `${year}`,
            inline: true,
          },
          {
            name: `Uploader ID:`,
            value: `${user.id}`,
            inline: true,
          },
          {
            name: `Uploader Username:`,
            value: `${user.username}`,
            inline: true,
          }
        ])
        .setTimestamp()
        .setFooter({
          text: `Submitted at`,
        });

      if (!image) {
        return interaction.editReply({ embeds: [NotFoundembed] });
      }
      
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
                custom_id: `removal_accept_${ID}`,
              },
              {
                type: 2,
                style: 4,
                label: "Decline",
                // Our button id, we can use that later to identify,
                // that the user has clicked this specific button
                custom_id: `removal_decline_${ID}`,
              },
            ],
          },
        ],
      });

      const rcollector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 86400000,
        max: 1,
      });

      rcollector.on("collect", (i) => {
        if (
          i.member.roles.cache.has(`1228029338792890379`) ||
          i.member.roles.cache.has(`1228029387233038356`) ||
          i.member.roles.cache.has(`1228029254172934214`)
        ) {
          if (i.customId === `removal_decline_${ID}`) {
            Endembed.setFooter({
              text: `Declined | Submitted at`,
            })
            i.reply("Removal Declined. Team: " + team + " | Year: " + year);
            return;
          }
          if (i.customId !== `removal_accept_${ID}`) return;
          const ImageID = `frc${team}-${year}`;
          Endembed.setFooter({
            text: `Removed! | Submitted at`,
          })
          i.reply("Removed! Team: " + team + " | Year: " + year);
          cloudinary.uploader
          .destroy(ImageID);
        } else {
          i.reply({
            content: `These buttons aren't for you!`,
            ephemeral: true,
          });
        }
      });
      rcollector.on("end", (collected) => {
        msg.edit({
          content: `<@&1228029338792890379><@&1228029387233038356><@&1228029254172934214>`,
          embeds: [Endembed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 1,
                  disabled: true,
                  label: "Accept",
                  // Our button id, we can use that later to identify,
                  // that the user has clicked this specific button
                  custom_id: `removal_accept_${ID}`,
                },
                {
                  type: 2,
                  style: 4,
                  disabled: true,
                  label: "Decline",
                  // Our button id, we can use that later to identify,
                  // that the user has clicked this specific button
                  custom_id: `removal_decline_${ID}`,
                },
              ],
            },
          ],
        });
      });



      interaction.editReply({ embeds: [Replyembed] });
      
    }
  },
};
