import { VectorStore } from "./vectorStore.js";

const store = new VectorStore();

store.addDocument(
    "Government procurement has eligibility requirements.",
    [0.1, 0.2, 0.3],
    { filename: "agent.md" }
);

store.addDocument(
    "The bidder must submit certificates.",
    [0.4, 0.5, 0.6],
    { filename: "agent.md" }
);

console.log("Stored documents:", store.size());

console.log(
    "Documents:",
    store.getAllDocuments()
);