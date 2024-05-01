import { ActivityType } from "discord.js";
import { client } from "../bot.js";

function getUserCount() {
  const userCount = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0); // Efficient user count
  return [{ text: `over ${userCount} users`, type: ActivityType.Watching }];
}

function getServerCount() {
  const serverCount = client.guilds.cache.size;
  return [{ text: `in ${serverCount} servers`, type: ActivityType.Playing }];
}
const statuses = [
  { text: "and staring at your robot!", type: ActivityType.Watching },
  { text: "with code.", type: ActivityType.Playing },
  { text: "with Data.", type: ActivityType.Playing },
  { text: "and Helping users ✨", type: ActivityType.Playing },
  ...getServerCount(),
  ...getUserCount(),
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
