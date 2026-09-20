import { embedChunks } from "./embedding.js";

const chunks = [
    "Government procurement has eligibility requirements.",
    "The bidder must submit the required certificates.",
    "Technical specifications must comply with the tender."
];

const embeddings = await embedChunks(chunks);

console.log("Number of embeddings:", embeddings.length);
console.log("First embedding length:", embeddings[0].length);
console.log("Second embedding length:", embeddings[1].length);

