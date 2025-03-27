
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import pool from './database.js';

const PORT = 5000;
 const app =express();
app.use(express.json());
app.use(cors()); 

const insertQuery = `INSERT INTO JobRoles(Job_description) VALUES ($1)`

app.post("/generate", async (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ error: "Job role is required" });
  }
    try {
      
      const client = await pool.connect();
      await client.query(insertQuery, [role]);
      client.release();
    }
    catch (error) {
      
      res.status(500).json({ error: "server issue try again later" });

     }
  
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: `Generate a job description for a ${role}` }],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    res.json({ description: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate job description" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});