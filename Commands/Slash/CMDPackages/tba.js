const baseUrl = "https://www.thebluealliance.com/api/v3";
let token = null;

export function TBAaddToken(newToken) {
  // Store the token in a global variable
  token = newToken;
}

export async function teamInfo(team, options = {}) {
  const url = `${baseUrl}/team/frc${team}`;
  options.headers = {
    "X-TBA-Auth-Key": token,
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((data) => data);
}

export async function teamLogo(team, options = {}) {
  const date = new Date();
  const year = date.getFullYear();
  const url = `${baseUrl}/team/frc${team}/media/${year}`;
  options.headers = {
    "X-TBA-Auth-Key": token,
  };

  const mediadata = await fetch(url, options);
  const mediajson = await mediadata.json();
  let firstImage = null;
  for (const item of mediajson) {
    if (item.type === "avatar") {
      firstImage = item;
      break;
    }
  }

  if (firstImage) {
    return firstImage;
  } else {
    return null;
  }
}

export async function teamAwards(team, year, options = {}) {
  let url = "";
  if (year) {
    url = `${baseUrl}/team/frc${team}/awards/${year}`;
  } else {
    url = `${baseUrl}/team/frc${team}/awards`;
  }

  options.headers = {
    "X-TBA-Auth-Key": token,
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((data) => data);
}

export async function matchInfo(matchkey, options = {}) {
  const url = `${baseUrl}/match/${matchkey}`;
  options.headers = {
    "X-TBA-Auth-Key": token,
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((data) => data);
}

export async function teamRobotImage(team, year, options = {}) {
  const url = `${baseUrl}/team/frc${team}/media/${year}`;
  options.headers = {
    "X-TBA-Auth-Key": token,
  };

  const mediadata = await fetch(url, options);
  const mediajson = await mediadata.json();
  let firstImage = null;
  for (const item of mediajson) {
    if (item.type === "imgur") {
      firstImage = `https://i.imgur.com/${item.foreign_key}.png`;
      break;
    } else if (item.type === "image") {
      firstImage = item.direct_url;
      break;
    }
  }

  if (firstImage) {
    return firstImage;
  } else {
    return null;
  }
}
