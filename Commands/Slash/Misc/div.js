import { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { Pagination } from "pagination.djs";

// Cache teams data
let teamsCache = {
    data: null,
    lastFetch: 0
};

async function fetchTeamsData() {
    if (teamsCache.data && Date.now() - teamsCache.lastFetch < 300000) {
        return teamsCache.data;
    }

    try {
        const response = await fetch("http://frc.divisions.co/api/v2/team_list");
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        
        const data = await response.json();
        teamsCache = {
            data: data,
            lastFetch: Date.now()
        };
        return data;
    } catch (error) {
        console.error("Error fetching teams data:", error);
        throw error;
    }
}

async function getDivisionFromTeam(teamNumber) {
    try {
        const response = await fetch(`http://frc.divisions.co/api/v2/team/${teamNumber}`);
        if (!response.ok) throw new Error(`Team ${teamNumber} not found`);
        const data = await response.json();
        return data.division_name || "Unknown Division";
    } catch (error) {
        console.error("Error fetching team division:", error);
        return "Unknown Division";
    }
}

async function getTeamsInDivision(divisionName) {
    try {
        const teamsData = await fetchTeamsData();
        
        if (!Array.isArray(teamsData)) {
            throw new Error("Unexpected API response format");
        }

        return teamsData
            .filter(team => team.division_name === divisionName)
            .map(team => team.team_number)
            .sort((a, b) => a - b);
    } catch (error) {
        console.error("Error filtering teams:", error);
        throw error;
    }
}

export default {
    name: "div",
    description: "Find a team's division or list teams in a division",
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages", "EmbedLinks"],
    category: "Misc",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "team",
            description: "Team number to find division",
            type: ApplicationCommandOptionType.Number,
            min_value: 0,
            max_value: 10000,
            required: false,
        },
        {
            name: "division",
            description: "Division to list teams from",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                { name: "Archimedes", value: "Archimedes" },
                { name: "Curie", value: "Curie" },
                { name: "Daly", value: "Daly" },
                { name: "Galileo", value: "Galileo" },
                { name: "Hopper", value: "Hopper" },
                { name: "Johnson", value: "Johnson" },
                { name: "Milstein", value: "Milstein" },
                { name: "Newton", value: "Newton" },
            ],
        },
    ],

    run: async ({ client, interaction }) => {
        await interaction.deferReply();

        const team = interaction.options.getNumber("team");
        const division = interaction.options.getString("division");

        if (team && division) {
            return interaction.editReply({ 
                content: "Please specify either a team number or a division, not both.",
            });
        }

        try {
            if (team) {
                // Find team's division
                const divisionName = await getDivisionFromTeam(team);
                const embed = new EmbedBuilder()
                    .setTitle(`Team ${team}`)
                    .setDescription(`This team is in the **${divisionName}** division.`)
                    .setColor("#0099FF")
                    .addFields({
                        name: "Links",
                        value: `[The Blue Alliance](https://www.thebluealliance.com/team/${team})\n[FRC Divisions](http://frc.divisions.co/team/${team})`
                    });

                return interaction.editReply({ embeds: [embed] });
            } 
            else if (division) {
                // List teams in division
                const divTeams = await getTeamsInDivision(division);
                
                if (divTeams.length === 0) {
                    return interaction.editReply({ 
                        content: `No teams found in ${division} division.`,
                    });
                }

                const pagination = new Pagination(interaction);
                pagination.setTitle(`Teams in ${division} Division`)
                    .setColor("#0099FF")
                    .setDescription(`**Total Teams:** ${divTeams.length}`);

                const teamsMap = divTeams.map((team) => {
                    return {
                        name: `Team ${team}`,
                        value: `[View on TBA](https://www.thebluealliance.com/team/${team})`
                    };
                });

                pagination.addFields(teamsMap);
                pagination.paginateFields(true);
                return pagination.render();
            } 
            else {
                return interaction.editReply({ 
                    content: "Please specify either a team number or division.\nExample: `/div team: 254` or `/div division: Newton`",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            return interaction.editReply({ 
                content: "An error occurred. Please try again later.",
            });
        }
    },
};