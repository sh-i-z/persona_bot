# 🧠 PersonaAI

### A Multi-Persona AI Companion with Long-Term Memory, Context Engineering, and Dynamic Prompting

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Groq](https://img.shields.io/badge/Groq_API-F55036?style=for-the-badge)
![Llama](https://img.shields.io/badge/Llama_3.3_70B-8A2BE2?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</p>

> *Most AI chatbots remember only the latest message.*
>
> *PersonaAI explores what happens when an AI remembers who you are, adapts its personality, understands previous conversations, and builds rich conversational context before generating every response.*

PersonaAI is an experimental GenAI project built to explore **how modern AI assistants should be engineered beyond simple prompt engineering**.

Instead of forwarding only the user's latest message to an LLM, PersonaAI constructs a complete conversational context by combining long-term memory, user profiling, conversation summaries, emotion awareness, personality layers, and dynamically selected AI personas before every request.

The result is an assistant that feels significantly more personalized, context-aware, and consistent across conversations.

---

# 📖 Why I Built This

While learning Generative AI, I noticed that most beginner chatbot projects follow a very simple pipeline:

```text
User Message
      ↓
    Prompt
      ↓
     LLM
      ↓
   AI Response
```

Although this approach generates fluent responses, it has several practical limitations.

- The AI forgets previous conversations.
- Users repeatedly provide the same information.
- Every conversation starts almost from zero.
- One chatbot personality must handle every possible use case.
- Responses become generic because the model lacks long-term context.

I wanted to explore a different question:

> **What if an AI assistant could remember previous conversations, understand the user's preferences, switch between different personalities, and intelligently build context before every response?**

PersonaAI became an experiment in **Context Engineering** rather than just Prompt Engineering.

Instead of making the language model smarter, the project focuses on making the information sent to the language model significantly better.

---

# ❓ Problem Statement

Large Language Models are incredibly powerful at generating responses, but they are naturally **stateless**.

Without additional engineering, an LLM:

- forgets previous conversations,
- cannot maintain persistent user information,
- asks repetitive questions,
- struggles to adapt to different conversational roles,
- and quickly loses important context during long conversations.

Most chatbot projects simply send the latest user message to the model, which makes conversations feel disconnected over time.

PersonaAI solves this by introducing multiple context layers that work together before every LLM request.

Instead of relying on one static prompt, PersonaAI dynamically builds context using:

- Long-Term Memory
- Recent Conversation History
- User Profile
- Conversation Summary
- Selected Persona
- Personality Layer
- Emotion State

This allows responses to remain personalized while keeping prompt size manageable.

---

# ✨ What Makes PersonaAI Different?

PersonaAI is **not designed as another chatbot**.

It is designed as a **modular AI personalization engine** capable of powering multiple AI experiences through the same underlying architecture.

Instead of creating one large prompt containing every behavior, the project separates different responsibilities into independent modules.

For example,

- memory management is handled independently,
- prompt construction is isolated,
- personas are modular,
- user profiling happens automatically,
- conversation summaries reduce token usage,
- and relevant memories are retrieved only when needed.

This architecture makes the system easier to extend, easier to maintain, and significantly more scalable than a traditional single-prompt chatbot.

---

# 🚀 Core Features

### 🧠 Long-Term Memory

Stores important user information across conversations so the assistant can remember preferences, goals, promises, and important facts instead of repeatedly asking the same questions.

---

### 🎭 Multiple AI Personas

Instead of one generic chatbot, PersonaAI supports multiple specialized personalities.

Current personas include:

- ❤️ Boyfriend
- 📚 StudyMate
- 👨‍🏫 Teacher
- 💪 Motivator
- 🧠 Therapist
- 😊 Best Friend

Each persona has its own independent system instructions, allowing completely different conversational styles while sharing the same AI engine.

---

### 🔄 Dynamic Persona Switching

Users can switch between personas during runtime without changing the underlying application.

The backend automatically loads the appropriate system instructions before generating the next response.

---

### 👤 Automatic User Profiling

The assistant continuously extracts useful user information during conversations.

Examples include:

- goals
- hobbies
- likes
- dislikes
- important facts
- promises
- relationship context

Instead of requiring manual profile setup, PersonaAI gradually learns about the user naturally through conversation.

---

### 📝 Conversation Summarization

Rather than continuously sending every historical message to the LLM, PersonaAI periodically summarizes older conversations.

This preserves important context while reducing prompt size, improving both efficiency and scalability.

---

### 😊 Emotion Awareness

The system tracks the user's emotional state throughout conversations.

Future responses can adapt based on whether the user appears happy, sad, frustrated, excited, or stressed, making interactions feel more natural.

---

### 🔍 Relevant Memory Retrieval

Instead of attaching every previous conversation to the prompt, PersonaAI retrieves only the memories that are relevant to the current message.

This improves response quality while avoiding unnecessary token usage.

---

### 🧩 Dynamic Prompt Builder

One of the core components of PersonaAI is the Prompt Builder.

Instead of relying on one static system prompt, every request is dynamically assembled using multiple context layers before being sent to the LLM.

# 🏗️ System Architecture

Unlike traditional chatbot applications, PersonaAI does not directly forward the user's latest message to the language model.

Instead, every response is generated through a context construction pipeline.

```text
                        User Message
                              │
                              ▼
                     Load User Memory
                              │
                              ▼
                  Retrieve Relevant Memories
                              │
                              ▼
                    Load User Profile
                              │
                              ▼
               Load Conversation Summary
                              │
                              ▼
                  Load Selected Persona
                              │
                              ▼
                 Apply Personality Layer
                              │
                              ▼
                  Build Dynamic Prompt
                              │
                              ▼
                     Groq (Llama 3.3 70B)
                              │
                              ▼
                     Generate Response
                              │
                              ▼
               Update Profile & Memory
                              │
                              ▼
                    Save Conversation
```

Instead of treating the LLM as the application's brain, PersonaAI treats the LLM as only one component inside a larger AI pipeline.

Most of the intelligence comes from **how the context is prepared before the request reaches the model.**

---

# 🧠 AI Concepts Used

PersonaAI intentionally explores multiple modern Generative AI concepts instead of relying on a single prompt.

### ✅ Prompt Engineering

Each persona contains carefully designed system instructions that guide the model's behaviour without modifying the underlying language model.

---

### ✅ Context Engineering

Rather than sending only the user's latest message, PersonaAI dynamically constructs context using multiple information layers.

Current context includes:

- Selected Persona
- Personality Layer
- User Profile
- Conversation Summary
- Relevant Memories
- Recent Conversation
- Current User Message

This enables significantly richer conversations compared to static prompting.

---

### ✅ Long-Term Memory

Important user information is stored across conversations, allowing the assistant to remember preferences, goals, promises, and previous discussions.

---

### ✅ Short-Term Memory

Recent conversations are preserved separately from long-term memory to maintain conversational continuity while keeping prompts efficient.

---

### ✅ User Profiling

Instead of asking users to manually create profiles, PersonaAI continuously extracts useful information from natural conversations.

---

### ✅ Conversation Summarization

Older conversations are periodically summarized instead of continuously attaching every historical message.

This helps preserve important context while reducing prompt size.

---

### ✅ Persona Engineering

Every AI persona has independent system instructions.

Instead of maintaining one massive prompt capable of every behaviour, PersonaAI keeps personas modular and interchangeable.

---

### ✅ Memory Retrieval

Before generating every response, PersonaAI searches previous conversations to retrieve only context that is relevant to the current message.

---

### ✅ Emotion Awareness

The system tracks user emotions to enable emotionally adaptive responses and more natural conversations.

---

# 💻 Technology Stack

## Frontend

- HTML
- CSS
- Vanilla JavaScript

---

## Backend

- Node.js
- Express.js

---

## AI

- Groq API
- Llama 3.3 70B Versatile

---

## Storage

Current Prototype

- JSON-based persistent memory

Future Production

- MongoDB
- Vector Database (planned)

---

# 📂 Project Structure

```text
PersonaAI
│
├── UI/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── persona/
│   ├── boyfriend.js
│   ├── teacher.js
│   ├── therapist.js
│   ├── motivator.js
│   ├── bestfriend.js
│   └── studymate.js
│
├── server.js
├── llm.js
├── promptBuilder.js
├── getPersona.js
├── memory.js
├── memorySearch.js
├── profile.js
├── summary.js
├── emotion.js
└── memory.json
```

---

# ⚙️ Engineering Decisions

One of the primary goals of PersonaAI was not simply generating responses, but designing an AI system that is modular, scalable, and easy to evolve.

Every architectural decision was made with future scalability in mind.

---

## Why Dynamic Prompt Building?

Most chatbot projects rely on one static system prompt.

PersonaAI instead constructs a new prompt for every request by combining multiple context sources.

This keeps responses highly personalized while allowing each module to evolve independently.

---

## Why Separate Personas?

Instead of maintaining one large prompt containing every possible behaviour, each persona lives in its own module.

This makes adding new personas simple without affecting existing behaviour.

---

## Why Long-Term Memory?

Without memory, every conversation begins from scratch.

Persistent memory allows PersonaAI to naturally remember user preferences and previous discussions instead of repeatedly asking the same questions.

---

## Why Conversation Summaries?

Sending every historical conversation to an LLM quickly becomes expensive and inefficient.

Summaries preserve important information while significantly reducing token usage.

---

## Why User Profiles?

Rather than expecting users to configure preferences manually, PersonaAI gradually learns information through conversations.

This creates a more natural conversational experience.

---

## Why Relevant Memory Retrieval?

Not every previous conversation is useful.

Instead of sending everything to the model, PersonaAI retrieves only memories related to the current message.

This improves response quality while keeping prompts compact.

---

## Why JSON Instead of MongoDB?

During the prototype stage, the focus was AI architecture rather than database infrastructure.

JSON provided a lightweight persistence layer that allowed rapid experimentation.

Because memory operations are already isolated inside dedicated modules, migrating to MongoDB later requires minimal architectural changes.

---

## Why Modular Architecture?

Every major responsibility has its own module.

Instead of creating one large server file, PersonaAI separates:

- Prompt Construction
- Memory Management
- User Profiling
- Emotion Tracking
- Conversation Summaries
- Persona Management
- LLM Communication

This improves readability, maintainability, testing, and future scalability.

---

# 🚧 Challenges Faced

Developing PersonaAI involved solving several practical engineering challenges beyond simply calling an LLM API.

- Preventing repetitive AI responses
- Maintaining conversational consistency
- Managing token limits efficiently
- Designing scalable memory architecture
- Building reusable personas
- Separating AI logic from application logic
- Creating maintainable prompt construction
- Preparing the architecture for future multi-user support

This enables significantly richer and more personalized conversations compared to traditional chatbot implementations.

---
