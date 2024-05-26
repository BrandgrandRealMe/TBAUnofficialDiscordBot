import { Bot } from "./Client.js";
import { DBL } from "../events/ready.js";
import { readdir } from "node:fs/promises";
import settings from "../settings/config.js";

/**
 * Loads slash commands for the client and registers them globally or in a specific guild.
 * @param {Bot} client - The client instance.
 */
export default async function loadSlashCommands(client) {
  const {
    Slash: { Global, GuildID },
  } = client.config;

  try {
    let allCommands = [];
    let betaCommands = [];
    const commandsDir = await readdir(`./Commands/Slash`);

    await Promise.all(
      commandsDir.map(async (dir) => {
        const commands = await readdir(`./Commands/Slash/${dir}`);
        let filterCommands = commands.filter((f) => f.endsWith(".js"));

        await Promise.all(
          filterCommands.map(async (cmd) => {
            try {
              /**
               * @type {import("../index.js").Scommand}
               */
              if (dir === `CMDPackages` || dir === `DisabledCMDs`) return;
              if (dir === `BetaCMDs`) {
                const command = await import(
                  `../Commands/Slash/${dir}/${cmd}`
                ).then((r) => r.default);

                if (command.name) {
                  client.scommands.set(command.name, command);
                  betaCommands.push(command);
                }
                return;
              }
              const command = await import(
                `../Commands/Slash/${dir}/${cmd}`
              ).then((r) => r.default);

              if (command.name) {
                client.scommands.set(command.name, command);
                allCommands.push(command);
              }
            } catch (error) {
              console.error(`Error loading command from file ${cmd}:`, error);
            }
          }),
        );
      }),
    );

    // Register commands globally or in a specific guild
    await client.on("ready", async () => {
      if (!settings.BETA) {
        console.log("DBL | Update | Uploaded Slash Commands");
        DBL.postBotCommands(allCommands);
      }
      if (Global) {
        client.application.commands.set(allCommands);
        const guild = client.guilds.cache.get(GuildID);
        if (guild) await guild.commands.set(betaCommands);
      } else {
        const guild = client.guilds.cache.get(GuildID);
        if (guild) await guild.commands.set(allCommands);
      }
    });

    console.log(
      `> ✅ Successfully loaded ${client.scommands.size} slash commands.`,
    );
  } catch (error) {
    console.error(
      "An error occurred while reading the commands directory:",
      error,
    );
  }
}
