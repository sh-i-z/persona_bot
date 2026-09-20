import { pipeline } from "@huggingface/transformers";

let extractor = null;

export async function createEmbedding(text) {

    if (!extractor) {
        console.log("Loading embedding model...");

        extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );

        console.log("Embedding model loaded.");
    }

    const output = await extractor(text, {
        pooling: "mean",
        normalize: true
    });

    return Array.from(output.data);
}

export async function embedChunks(chunks) {

    const embeddings = [];

    for (const chunk of chunks) {

        const embedding = await createEmbedding(chunk);

        embeddings.push(embedding);
    }

    return embeddings;
}