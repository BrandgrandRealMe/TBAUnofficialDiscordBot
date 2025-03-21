import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { TBAaddToken, matchInfo } from "frctbaapi";

TBAaddToken(process.env.TBATOKEN);

export default {
  name: "matchinfo",
  description: "Get info on a match.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "TBA",
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
    console.log(MatchInfodata)
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
        `**Event:** ${MatchInfodata.event_key}\n` +
        `**Match:** ${MatchInfodata.comp_level.toUpperCase()} ${MatchInfodata.match_number}\n` +
        `**Winner:** ${MatchInfodata.winning_alliance.toUpperCase()} Alliance`
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
        `**Event:** ${MatchInfodata.event_key}\n` +
        `**Match:** ${MatchInfodata.comp_level.toUpperCase()} ${MatchInfodata.match_number}\n` +
        `**Winner:** ${MatchInfodata.winning_alliance.toUpperCase()} Alliance`
      )
      .setFields([
        {
          name: `🔵 Blue Alliance`,
          value:
            `**Final Score:** ${MatchInfodata.alliances.blue.score}\n` +
            `**Teams:** ${MatchInfodata.alliances.blue.team_keys.join(", ")}\n` +
            `**Surrogate Teams:** ${MatchInfodata.alliances.blue.surrogate_team_keys.join(", ") || "None"}\n` +
            `**Disqualified Teams:** ${MatchInfodata.alliances.blue.dq_team_keys.join(", ") || "None"}\n` +
            `**Auto Points:** ${MatchInfodata.score_breakdown.blue.autoPoints}\n` +
            `**Teleop Points:** ${MatchInfodata.score_breakdown.blue.teleopPoints}\n` +
            `**Foul Points:** ${MatchInfodata.score_breakdown.blue.foulPoints}\n` +
            `**Total Points:** ${MatchInfodata.score_breakdown.blue.totalPoints}`,
        },
        {
          name: `🔴 Red Alliance`,
          value:
            `**Final Score:** ${MatchInfodata.alliances.red.score}\n` +
            `**Teams:** ${MatchInfodata.alliances.red.team_keys.join(", ")}\n` +
            `**Surrogate Teams:** ${MatchInfodata.alliances.red.surrogate_team_keys.join(", ") || "None"}\n` +
            `**Disqualified Teams:** ${MatchInfodata.alliances.red.dq_team_keys.join(", ") || "None"}\n` +
            `**Auto Points:** ${MatchInfodata.score_breakdown.red.autoPoints}\n` +
            `**Teleop Points:** ${MatchInfodata.score_breakdown.red.teleopPoints}\n` +
            `**Foul Points:** ${MatchInfodata.score_breakdown.red.foulPoints}\n` +
            `**Total Points:** ${MatchInfodata.score_breakdown.red.totalPoints}`,
        }
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
