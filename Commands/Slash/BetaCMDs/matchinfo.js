import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { TBAaddToken, matchInfo } from "frctbaapi";

TBAaddToken(process.env.TBATOKEN);

export default {
  name: "matchinfo",
  description: "Get info on a match.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "TBA",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "matchkey",
      description: "What is the key of the match you want info on?",
      type: 3,
      required: true,
    },
    {
      name: "simple",
      description: "Do you want simple info?",
      type: 5,
      required: true,
    },
  ],

  run: async ({ client, interaction }) => {
    const MatchInfodata = await matchInfo(
      interaction.options.getString("matchkey"),
    );
    if (MatchInfodata.Error) {
      client.sendEmbed(interaction, MatchInfodata.Error);
      return;
    }
    const simple = interaction.options.getBoolean("simple");
    if (
      !interaction.options.getString("matchkey").includes("2025") &&
      !simple
    ) {
      client.sendEmbed(
        interaction,
        `Complex match info for matches older then 2025 are not available.`,
      );
      return;
    }
    await interaction.deferReply();

    const Simpleembed = new EmbedBuilder()
      .setTitle(`Match Info Simple`)
      .setColor(client.config.embed.color)
      .setDescription(
        `Event: ${MatchInfodata.event_key} Match: ${MatchInfodata.comp_level}${MatchInfodata.match_number}\nWinner: ${MatchInfodata.winning_alliance}`,
      )
      .setFields([
        {
          name: `🔵 Blue Alliance`,
          value: `${MatchInfodata.alliances.blue.score}`,
        },
        {
          name: `🔴 Red Alliance`,
          value: `${MatchInfodata.alliances.red.score}`,
        },
      ]);

    const ComplexembedFirst = new EmbedBuilder()
      .setTitle(`Match Info Complex`)
      .setColor(client.config.embed.color)
      .setDescription(
        `Event: ${MatchInfodata.event_key} Match: ${MatchInfodata.comp_level}${MatchInfodata.match_number}\nWinner: ${MatchInfodata.winning_alliance}`,
      )
      .setFields([
        {
          name: `🔵 Blue Alliance`,
          value: `Final Score: ${MatchInfodata.alliances.blue.score}`,
        },
        {
          name: `🔴 Red Alliance`,
          value: `Final Score: ${MatchInfodata.alliances.red.score}`,
        },
      ]);
    if (simple) {
      return interaction.editReply({ embeds: [Simpleembed] });
    } else {
      return interaction.editReply({
        embeds: [ComplexembedFirst],
      });
    }
  },
};
