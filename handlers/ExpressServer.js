import express from 'express';

import settings from "../settings/config.js";

import statusModule from "./StatusJSON.js";

const app = express();
const port = settings.PORT; // Adjust port as needed


app.get('/status/raw', async (req, res) => {
  try {
    const status = await statusModule();
    res.json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

  export default app;   
 // Export the app for testing or other modules
