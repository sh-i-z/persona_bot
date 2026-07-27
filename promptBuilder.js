import { getPersona } from "./getPersona.js";
import { searchMemory } from "./memorySearch.js";
import { PERSONALITIES } from "./personalities.js";

export function buildPrompt(memory, userMessage) {

    const persona = getPersona(memory.currentPersona);

    const messages = [];

    messages.push({
        role: "system",
        content: `${persona}${PERSONALITIES[memory.currentPersonality || "romantic"]}`
    });

    // =============================
    // Conversation Summary
    // =============================

    if (memory.summary.trim() !== "") {

        messages.push({

            role: "system",

            content:
                `Conversation Summary:\n${memory.summary}`

        });

    }

    // =============================
    // User Profile
    // =============================

    messages.push({

        role: "system",

        content:
            `User Profile:\n${JSON.stringify(memory.userProfile, null, 2)}`

    });

    // =============================
    // Relevant Memories
    // =============================

    const relevantTurns = searchMemory(
        memory,
        userMessage
    );

    if (relevantTurns.length > 0) {

        let relevantText = "";

        relevantTurns.forEach(turn => {

            relevantText +=

                `User: ${turn.user}\n`;

            relevantText +=

                `Assistant: ${turn.assistant}\n\n`;

        });

        messages.push({

            role: "system",

            content:
                `Relevant Past Conversations:\n\n${relevantText}`

        });

    }

    // =============================
    // Recent Conversation
    // =============================

    memory.recentTurns.forEach(turn => {

        messages.push({

            role: "user",

            content: turn.user

        });

        messages.push({

            role: "assistant",

            content: turn.assistant

        });

    });

    // =============================
    // Current User Message
    // =============================

    messages.push({

        role: "user",

        content: userMessage

    });

    return messages;

}