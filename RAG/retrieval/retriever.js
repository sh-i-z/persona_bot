import { createEmbedding } from "../embeddings/embedding.js";
import { cosineSimilarity } from "./similarity.js";

export async function retrieveRelevantChunks(
    question,
    vectorStore,
    topK = 3
) {
    // 1. Convert user's question into an embedding
    const questionEmbedding = await createEmbedding(question);

    // 2. Get all documents stored in vector store
    const documents = vectorStore.getAllDocuments();

    // 3. Calculate similarity between question and every stored chunk
    const scoredDocuments = documents.map((document) => {
        const score = cosineSimilarity(
            questionEmbedding,
            document.embedding
        );

        return {
            chunk: document.chunk,
            score,
            metadata: document.metadata
        };
    });

    // 4. Highest similarity first
    scoredDocuments.sort((a, b) => b.score - a.score);

    // 5. Return only the most relevant chunks
    return scoredDocuments.slice(0, topK);
}