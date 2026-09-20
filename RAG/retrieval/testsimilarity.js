import { createEmbedding } from "../embeddings/embedding.js";
import { cosineSimilarity } from "./similarity.js";

const textA = "What are the eligibility requirements?";
const textB = "What qualifications are required for eligibility?";
const textC = "The weather is beautiful today.";

const embeddingA = await createEmbedding(textA);
const embeddingB = await createEmbedding(textB);
const embeddingC = await createEmbedding(textC);

console.log(
    "A vs B:",
    cosineSimilarity(embeddingA, embeddingB)
);

console.log(
    "A vs C:",
    cosineSimilarity(embeddingA, embeddingC)
);