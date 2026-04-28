const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        const { jobDescription, additionalCriteria } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);
        formData.append('jobDescription', jobDescription);
        if (additionalCriteria) formData.append('additionalCriteria', additionalCriteria);

        const response = await axios.post('https://resume-screener-backend-761w.onrender.com/analyze', formData, {
            headers: { ...formData.getHeaders() }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Analysis failed:", error.message);
        res.status(500).json({ error: "Failed to process resume" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Middleware running on port ${PORT}`));