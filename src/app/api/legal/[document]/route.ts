import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

type LegalDocument = {
  filename: string;
  file: string;
};

const DOCUMENTS: Record<string, LegalDocument> = {
  "privacy-policy": {
    filename: "jk-polityka-prywatnosci.pdf",
    file: "privacy-policy.pdf"
  },
  terms: {
    filename: "jk-regulamin.pdf",
    file: "terms.pdf"
  }
};

export async function GET(
  _request: Request,
  { params }: { params: { document: string } }
) {
  const document = DOCUMENTS[params.document];

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  try {
    const pdfPath = path.join(process.cwd(), "public", "legal", document.file);
    const fileBuffer = await readFile(pdfPath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${document.filename}"`,
        "Cache-Control": "public, max-age=3600",
        "Content-Length": String(fileBuffer.byteLength)
      }
    });
  } catch (error) {
    console.error(`Failed to read legal document: ${params.document}`, error);
    return NextResponse.json({ error: "Unable to download document" }, { status: 500 });
  }
}
