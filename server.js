import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(cors());

app.get('/api/places', async (req, res) => {
    const placeId = req.query.id;
    if (!placeId) {
        return res.status(400).json({ error: "Place ID is required" });
    }

    try {
        const apiUrl = `https://api.inaturalist.org/v1/places/${placeId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            return res.status(500).json({ error: "Failed to fetch place" });
        }
        const placeData = await response.json();
        res.json(placeData.results);
    } catch (error) {
        console.error("Error fetching place:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/identifications', async (req, res) => {
    const placeId = req.query.place_id;
    if (!placeId) {
        return res.status(400).json({ error: "Place ID is required" });
    }

    try {
        const apiUrl = `https://api.inaturalist.org/v1/identifications?place_id=${placeId}`;
        const response = await fetch(apiUrl);
        const idData = await response.json();
        res.json(idData.results);
    } catch (error) {
        console.error("Error fetching identifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
