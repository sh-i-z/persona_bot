import OpenAI from "openai";
import dotenv from "dotenv";
import { buildPrompt } from "./promptBuilder.js";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function callLLM(userMessage, memory) {

    const messages = buildPrompt(memory, userMessage);

    const response = await client.chat.completions.create({

        model: "openai/gpt-oss-120b",

        messages,

        temperature: 1,

        max_tokens: 500,
        top_p: 0.95,
        frequency_penalty: 0.8,
        presence_penalty: 0.7

    });

    return response.choices[0].message.content;

}