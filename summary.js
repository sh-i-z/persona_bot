import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({

    apiKey: process.env.GROQ_API_KEY,

    baseURL: "https://api.groq.com/openai/v1"

});

export async function generateSummary(memory) {

    let conversation = "";

    memory.recentTurns.forEach(turn => {

        conversation +=

            `User: ${turn.user}\n`;

        conversation +=

            `Assistant: ${turn.assistant}\n\n`;

    });

    const prompt = `

Previous Summary

${memory.summary}

--------------------------------------

New Conversation

${conversation}

--------------------------------------

Update the memory.

Rules:

1. Don't forget old memories.

2. Add new important information.

3. Ignore greetings.

4. Ignore small talk.

5. Remember:

- Promises

- Plans

- Favorite Things

- Nicknames

- College

- Friends

- Relationship

- Emotional Moments

- Important Dates

Return only the updated summary.
`;

    const response = await client.chat.completions.create({

        model: "openai/gpt-oss-120b",

        messages: [

            {

                role: "system",

                content:

                    "You summarize long conversations."

            },

            {

                role: "user",

                content: prompt

            }

        ],

        temperature: 0.2,

        max_tokens: 300

    });

    return response.choices[0].message.content;

}