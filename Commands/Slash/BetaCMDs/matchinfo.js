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
    console.log(MatchInfodata)
    const simple = interaction.options.getBoolean("simple");
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
    const ComplexembedRed = new EmbedBuilder()
      .setTitle(`🔴 Red Alliance`)
      .setColor(`#ff0000`)
      .setDescription(
        `${MatchInfodata.alliances.red.team_keys[0]} ${MatchInfodata.alliances.red.team_keys[1]} ${MatchInfodata.alliances.red.team_keys[2]}`,
      )
      .setFields([
        {
          name: `adjust Points`,
          value: `${MatchInfodata.score_breakdown.red.adjustPoints}`,
        },
        {
          name: `auto Amp`,
          value: `Note Count: ${MatchInfodata.score_breakdown.red.autoAmpNoteCount}\nNote Points: ${MatchInfodata.score_breakdown.autoAmpNotePoints}`,
        },
        {
          name: `auto Speaker`,
          value: `Note Count: ${MatchInfodata.score_breakdown.red.autoSpeakerNoteCount}\nNote Points: ${MatchInfodata.score_breakdown.autoSpeakerNotePoints}`,
        },
        {
          name: `auto Leave`,
          value: `Points: ${MatchInfodata.score_breakdown.red.autoLeavePoints}\nRobot 1 leave?: ${MatchInfodata.score_breakdown.red.autoLineRobot1}\nRobot 2 leave?: ${MatchInfodata.score_breakdown.red.autoLineRobot2}\nRobot 3 leave?: ${MatchInfodata.score_breakdown.red.autoLineRobot3}`,
        },
        {
          name: `auto Points`,
          value: `Total Points: ${MatchInfodata.score_breakdown.red.autoPoints}`,
        },
        {
          name: `Coop`,
          value: `coop Note Played: ${MatchInfodata.score_breakdown.red.coopNotePlayed}\ncoop Bonus Achieved: ${MatchInfodata.score_breakdown.red.coopertitionBonusAchieved}\ncoop Criteria Met: ${MatchInfodata.score_breakdown.red.coopertitionCriteriaMet}`,
        },
        {
          name: `Teleop`,
          value: `coop Note Played: ${MatchInfodata.score_breakdown.red.coopNotePlayed}\ncoop Bonus Achieved: ${MatchInfodata.score_breakdown.red.coopertitionBonusAchieved}\ncoop Criteria Met: ${MatchInfodata.score_breakdown.red.coopertitionCriteriaMet}`,
        },
        {
          name: `Endgame`,
          value: `endGameHarmonyPoints: ${MatchInfodata.score_breakdown.red.endGameHarmonyPoints}\nendGameNoteInTrapPoints: ${MatchInfodata.score_breakdown.red.endGameNoteInTrapPoints}\nendGameOnStagePoints: ${MatchInfodata.score_breakdown.red.endGameOnStagePoints}\nendGameParkPoints: ${MatchInfodata.score_breakdown.red.endGameParkPoints}\nendGameSpotLightBonusPoints: ${MatchInfodata.score_breakdown.red.endGameSpotLightBonusPoints}\nendGameTotalStagePoints: ${MatchInfodata.score_breakdown.red.endGameTotalStagePoints}`,
        },
        {
          name: `ensemble`,
          value: `ensembleBonusAchieved: ${MatchInfodata.score_breakdown.red.ensembleBonusAchieved}\nensembleBonusOnStageRobotsThreshold: ${MatchInfodata.score_breakdown.red.ensembleBonusOnStageRobotsThreshold}\nensembleBonusStagePointsThreshold: ${MatchInfodata.score_breakdown.red.ensembleBonusStagePointsThreshold}`,
        },
      ]);
    if (simple) {
      return interaction.editReply({ embeds: [Simpleembed] });
    } else {
      return interaction.editReply({
        embeds: [ComplexembedFirst, ComplexembedRed],
      });
    }
  },
};
