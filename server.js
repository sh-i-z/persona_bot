import express from "express";
import cors from "cors";
import multer from "multer";

import { callLLM } from "./llm.js";
import { loadMemory, saveMemory } from "./memory.js";
import { updateUserProfile } from "./profile.js";
import { generateSummary } from "./summary.js";
import { detectEmotion } from "./emotion.js";
import { changePersona } from "./memory.js";
import { extractText } from "./RAG/documentloader/documentLoader.js";
import { chunkText } from "./RAG/chunker/textChunker.js";
import { embedChunks } from "./RAG/embeddings/embedding.js";
import { VectorStore } from "./RAG/vectorstore/vectorStore.js";
import { retrieveRelevantChunks } from "./RAG/retrieval/retriever.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Load memory once when server starts
const memory = loadMemory();

const vectorStore = new VectorStore();

app.post("/upload", upload.single("document"), async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded"
            });
        }

        console.log("File received:", req.file.originalname);
        console.log("File type:", req.file.mimetype);
        console.log("File size:", req.file.size);

        const text = await extractText(req.file);
        console.log("Extracted text length:", text.length);

        console.log("Text preview:");
        console.log(text.slice(0, 500));

        const chunks = chunkText(text);
        console.log("Total chunks:", chunks.length);

        const embeddings = await embedChunks(chunks);
        console.log("Embeddings created:", embeddings.length);

        for (let i = 0; i < chunks.length; i++) {

            vectorStore.addDocument(
                chunks[i],
                embeddings[i],
                {
                    filename: req.file.originalname
                }
            );
        }

        console.log("Documents in vector store:", vectorStore.size());

        console.log("First chunk:");
        console.log(chunks[0]);

        res.json({
            success: true,
            filename: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
            textLength: text.length,
            chunks: chunks.length,
            preview: text.slice(0, 500)
        });

    } catch (err) {

        console.error("Document extraction failed:", err);

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/retrieve", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        console.log("Retrieval question:", question);

        const results = await retrieveRelevantChunks(
            question,
            vectorStore,
            3
        );

        console.log("Retrieved chunks:", results);

        res.json({
            success: true,
            results
        });

    } catch (err) {
        console.error("Retrieval failed:", err);

        res.status(500).json({
            error: err.message
        });
    }
});

app.post("/persona", (req, res) => {

    const { persona } = req.body;
    changePersona(memory, persona);
    saveMemory(memory);

    res.json({
        success: true,
        currentPersona: persona
    });

});



app.post("/chat", async (req, res) => {

    try {

        const {
            message,
            persona
        } = req.body;

        if (persona) {
            changePersona(memory, persona);
        }
        console.log(memory.currentPersona);
        if (!message || typeof message !== "string") {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        // ==========================
        // Retrieve Relevant Document Context
        // ==========================

        let ragMessage = message;

        if (vectorStore.size() > 0) {

            const retrievedChunks = await retrieveRelevantChunks(
                message,
                vectorStore,
                3
            );

            const context = retrievedChunks
                .map((result, index) => {
                    return `--- Context ${index + 1} ---\n${result.chunk}`;
                })
                .join("\n\n");

            ragMessage = `
Use the following context from the user's uploaded documents
to help answer the user's message.

If the answer is not available in the provided context,
answer normally based on your existing knowledge.

Context:
${context}

User message:
${message}
`;

            console.log("RAG Context:");
            console.log(context);
        }

        // ==========================
        // Generate AI Reply
        // ==========================

        const reply = await callLLM(ragMessage, memory);

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
