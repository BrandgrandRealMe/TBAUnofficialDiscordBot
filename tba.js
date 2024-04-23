const baseUrl = "https://www.thebluealliance.com/api/v3";

function get(path, options = {}) {
  const url = new URL(path, baseUrl);
  options.headers = {
    "X-TBA-Auth-Key": your_tba_key, // Replace with your TBA API key
    ...options.headers,
  };

  return fetch(url, options)
    .then((response) => response.json())
    .then((data) => data);
}

function getTeamRobotImage(team) {
  // Check if media object exists and has a robot image url
  if (team.media && team.media.content_type === "image" && team.media.details.type === "robot") {
    return team.media.details.url;
  }
  // If no robot image found, return null or a placeholder url
  return null; // Or "https://placeholder-image.com/..."
}

export default {
  getTeamInfo: async (teamNumber) => {
    const teamData = await get(`/team/${teamNumber}`);
    return {
      ...teamData,
      robotImageUrl: getTeamRobotImage(teamData),
    };
  },
  // Add more functions for other API endpoints as needed
};
