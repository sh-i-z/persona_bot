import express from "express";
import cors from "cors";

import { callLLM } from "./llm.js";
import { loadMemory, saveMemory } from "./memory.js";
import { updateUserProfile } from "./profile.js";
import { generateSummary } from "./summary.js";
import { detectEmotion } from "./emotion.js";
import { changePersona } from "./memory.js";

const app = express();

app.use(cors());
app.use(express.json());

// Load memory once when server starts
const memory = loadMemory();

app.post("/persona", (req, res) => {

    const { persona } = req.body;
    memory.currentPersona = persona;
    saveMemory(memory);

    res.json({
        success: true,
        currentPersona: persona
    });

});

app.post("/chat", async (req, res) => {

    try {

        const { message } = req.body;
        if (!message || typeof message !== "string") {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        // ==========================
        // Generate AI Reply
        // ==========================

        const reply = await callLLM(message, memory);

        // ==========================
        // Store Conversation Turn
        // ==========================

        const turn = {
            user: message,
            assistant: reply
        };

        if (memory.firstTurns.length < 10) {
            memory.firstTurns.push(turn);
        }

        else {
            memory.recentTurns.push(turn);
        }

        // Keep only latest 20 turns

        while (memory.recentTurns.length > 20) {
            memory.recentTurns.shift();
        }

        // ==========================
        // Update User Profile
        // ==========================

        await updateUserProfile(
            memory,
            message,
            reply
        );

        // ==========================
        // Generate Summary
        // ==========================

        if (memory.recentTurns.length >= 20) {
            memory.summary = await generateSummary(memory);
            memory.recentTurns = [];
        }

        //Personality Update
        memory.personalityCount++;

        if (memory.personalityCount >= 5) {
            const moods = [
                "romantic",
                "funny",
                "protective",
                "supportive",
                "flirty"
            ];

            const random =

                moods[
                Math.floor(
                    Math.random() * moods.length
                )
                ];

            memory.currentPersonality = random;

            memory.personalityCount = 0;

        }

        // ==========================
        // Save Memory
        // ==========================

        saveMemory(memory);

        // ==========================

        res.json({
            reply,
            memory
        });

    }

    catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message

        });

    }


});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on ${PORT}`
    );
});
