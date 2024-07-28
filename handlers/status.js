import { ActivityType } from "discord.js";
import { client } from "../bot.js";
import settings from "../settings/config.js";

const statuses = [
  { text: "and staring at your robot!", type: ActivityType.Watching },
  { text: "with code.", type: ActivityType.Playing },
  { text: "with Data.", type: ActivityType.Playing },
  { text: "and Helping users ✨", type: ActivityType.Watching },
  { text: `Running version ${settings.VER}`, type: ActivityType.Watching },
];

let currentStatusIndex = 0; // Keeps track of the current status

export function updateStatus() {
  // Choose the next status
  currentStatusIndex = (currentStatusIndex + 1) % statuses.length;

  // Destructure the current status object
  const { text, type } = statuses[currentStatusIndex];
  client.user.setActivity({
    name: text, // Set the activity name
    type: type, // Set the activity type
  });
}
