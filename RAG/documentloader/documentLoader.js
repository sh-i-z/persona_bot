import path from "path";

export async function extractText(file) {

    console.log("🔥 LOADER CALLED");

    const extension = path.extname(file.originalname).toLowerCase();

    console.log("Extension:", extension);

    if (
        extension === ".txt" ||
        extension === ".md" ||
        extension === ".markdown"
    ) {
        console.log("🔥 Reading text file");

        return file.buffer.toString("utf-8");
    }

    throw new Error(
        `Unsupported file type: ${extension}`
    );
}