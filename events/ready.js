import { ActivityType } from "discord.js";
import { client } from "../bot.js";
import { updateStatus } from "../handlers/status.js";
import settings from "../settings/config.js";
import { AutoPoster } from "topgg-autoposter";
import { createDjsClient } from "discordbotlist";
import server from '../handlers/ExpressServer.js';

/**
 * Event listener for when the client becomes ready.
 * This event is emitted once the bot has successfully connected to Discord and is ready to start receiving events.
 * @event client#ready
 */

client.on("ready", async () => {

  if (!settings.BETA) {
    const ap = AutoPoster(settings.topgg.token, client);

    ap.on("posted", () => {
      console.log("top.gg | Update | Posted stats");
    });

    ap.on("error", (e) => {
      console.log(`top.gg | error | ${e}`);
    });
  }

  try {
    // Log a message indicating that the client is ready
    console.log(`> ✅ ${client.user.tag} is now online`);

    // Set the activity for the client
    updateStatus();
    setInterval(updateStatus, 15 * 1000);
  } catch (error) {
    // Log any errors that occur
    console.error("An error occurred in the ready event:", error);
  }
});

/**
 * Sets the bot's presence and activity when it becomes ready.
 * @module ReadyEvent
 */
