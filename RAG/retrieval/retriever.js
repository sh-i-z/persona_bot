import { createEmbedding } from "../embeddings/embedding.js";
import { cosineSimilarity } from "./similarity.js";

export async function retrieveRelevantChunks(
    question,
    chunks,
    embeddings,
    topK = 3
) {

    const questionEmbedding = await createEmbedding(question);

    const scoredChunks = chunks.map((chunk, index) => {

        const score = cosineSimilarity(
            questionEmbedding,
            embeddings[index]
        );

        return {
            chunk,
            score
        };
    });

    scoredChunks.sort((a, b) => b.score - a.score);

    return scoredChunks.slice(0, topK);
}