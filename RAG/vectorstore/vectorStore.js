export class VectorStore {

    constructor() {
        this.documents = [];
    }

    addDocument(chunk, embedding, metadata = {}) {

        this.documents.push({
            chunk,
            embedding,
            metadata
        });
    }

    getAllDocuments() {
        return this.documents;
    }

    size() {
        return this.documents.length;
    }
}