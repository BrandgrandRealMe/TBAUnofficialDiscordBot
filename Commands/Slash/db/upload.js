import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from "discord.js";
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: "detklnnug",
  api_key: "964959785329618",
  api_secret: process.env.CLOUDINARYTOKEN,
});

export default {
  name: "upload",
  description: "Upload a image to the DB.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "DB",
  options: [
    {
      name: 'team',
      description: 'What team do you want to fetch the robot of?',
      type: 10,
      min_value: 0,
      max_value: 10000,
      required: true
    },
    {
      name: 'image',
      description: 'What image do you want to upload?',
      type: 11,
      
      required: true
    }
  ],

  run: async ({ client, interaction }) => {
    const date = new Date();
    await interaction.deferReply();

    const team = interaction.options.getNumber('team');
    const imageData = interaction.options.getAttachment('image');

    const year = date.getFullYear();
    const ID = `frc${team}-${year}`;

    const URL = imageData.url;
  cloudinary.uploader.upload(URL,
    { public_id: ID, tags: ID}, 
    function(error, result) {console.log(result); });

    const embed = new EmbedBuilder()
      .setDescription(
        `Uploaded Photo!`,
      );
    return interaction.editReply({ embeds: [embed] });
  },
};
