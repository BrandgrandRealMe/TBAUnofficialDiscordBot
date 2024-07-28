import { ApplicationCommandType, EmbedBuilder } from "discord.js";
const project_id = process.env.DOCSAI_ID;
const project_key = process.env.DOCSAI_KEY;
var answer = `Error: No answer found.`;
/**
 * @type {import("../../../index").Scommand}
 */

async function GetAnswer(q) {
  const data = await fetch("https://docsai.app/api/v1/chat", {
    method: "POST",
    body: JSON.stringify({ projectId: project_id, question: q }),
    headers: {
      Authorization: "Bearer " + project_key,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data);
  if (data.answer) return data.answer;
  if (data.message) return "error " + data.message;
  if (!data.answer) return "error";
}
export default {
  name: "ai",
  description: "Get a AI response from the 2024 game manual.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "question",
      description: "What is the question?",
      type: 3,
      required: true,
    },
  ],

  run: async ({ client, interaction }) => {
    const question = interaction.options.getString("question");
    const answer = await GetAnswer(question);
    const embed = new EmbedBuilder() // Create a new embed object
      .setColor(client.config.embed.color) // Set the embed color
      .setDescription(answer)
      .setFooter({ text: `Question: ${question}` });

    await interaction.reply({ embeds: [embed] }); // Send the embed
  },
};
