import express from 'express';
import axios from 'axios';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors()); // Enable CORS for all routes

app.get('/distance', async (req, res) => {
  const { origins, destinations, key } = req.query;
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
      params: {
        origins: origins,
        destinations: destinations,
        key: key,
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
