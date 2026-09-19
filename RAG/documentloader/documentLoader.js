import path from "path";

export async function extractText(file) {

    const extension = path.extname(file.originalname).toLowerCase();

    // Text based files
    if (
        extension === ".txt" ||
        extension === ".md" ||
        extension === ".markdown"
    ) {
        return file.buffer.toString("utf-8");
    }

    throw new Error(
        `Unsupported file type: ${extension}`
    );
}