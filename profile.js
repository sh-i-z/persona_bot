import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function updateUserProfile(memory, userMessage, assistantReply) {

    const profile = memory.userProfile || {
        name: "",
        nickname: "",
        relationship: "",
        mood: "",
        likes: [],
        dislikes: [],
        hobbies: [],
        goals: [],
        importantFacts: [],
        promises: []
    };

    const prompt = `
You are an AI profile extractor.

Current User Profile:

${JSON.stringify(profile, null, 2)}

Conversation:

User: ${userMessage}

Assistant: ${assistantReply}

Update the profile only if new information is found.

Rules:
- Don't remove existing information.
- Don't make assumptions.
- Avoid duplicates.
- Return ONLY valid JSON.

Format:

{
  "name":"",
  "nickname":"",
  "relationship":"",
  "mood":"",
  "likes":[],
  "dislikes":[],
  "hobbies":[],
  "goals":[],
  "importantFacts":[],
  "promises":[]
}
`;

    const response = await client.chat.completions.create({

        model: "openai/gpt-oss-120b",

        messages: [
            {
                role: "system",
                content: "You extract user profile information."
            },
            {
                role: "user",
                content: prompt
            }
        ],

        temperature: 0.2,

        response_format: {
            type: "json_object"
        }

    });

    try {

        const updatedProfile = JSON.parse(
            response.choices[0].message.content
        );

        memory.userProfile = updatedProfile;

    }

    catch (err) {

        console.log("Profile Parse Error");

    }

}