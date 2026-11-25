"use server";

import mammoth from 'mammoth';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { cvSchema, type ParsedCV } from '@/lib/schemas/cv';

const openai = new OpenAI({
  apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
});

const DOCX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export type ActionState = {
  message: string;
  success?: boolean;
};

export async function uploadFileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { message: "Please select a valid file.", success: false };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { message: "File too large", success: false }
  }

  if (!file.type.includes("text") && !file.type.includes("application/pdf") && file.type !== DOCX_MIME_TYPE) {
    return { message: "Only text, PDF, and DOCX files allowed", success: false }
  }  

  // Perform your server logic here (e.g., save to S3, database, etc.)

  if (file.type === "application/pdf") {
  // Convert the Web File into a Node.js Buffer
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const loadingTask = pdfjs.getDocument({
      data,
      useSystemFonts: true,
    });
    const pdfDocument = await loadingTask.promise;
    const pageTexts: string[] = [];

    try {
      // Loop through each page (PDF.js is 1-indexed)
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Extract and join text items
        const pageText = textContent.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ');

        pageTexts.push(pageText);
      };
      const rawText = pageTexts.join('\n\n');
      const completion = await openai.chat.completions.parse({
        model: 'gpt-4o-mini',
        temperature: 0, // Keeps extraction deterministic and factual
        messages: [
          {
            role: 'system',
            content:
              'You are an expert HR recruitment parser. Extract structured CV data accurately from the raw document text. Never guess or invent missing details—return null for any field not explicitly stated.',
          },
          {
            role: 'user',
            content: `Parse the following CV text:\n\n${rawText}`,
          },
        ],
        response_format: zodResponseFormat(cvSchema, 'parsed_cv'),
      });
      
      const parsedData = completion.choices[0]?.message.parsed;
      
      if (!parsedData) {
        throw new Error('OpenAI failed to parse the CV structure.');
      }
      return { message: JSON.stringify(parsedData), success: true };
    } catch (error) {
      console.error('PDF parsing error:', error);
      return { message: "Failed to parse PDF text." + error };
    } finally {
      // Clean up memory
      await pdfDocument.destroy();
    }
  } else if (file.type === DOCX_MIME_TYPE) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      const completion = await openai.chat.completions.parse({
        model: 'gpt-4o-mini',
        temperature: 0, // Keeps extraction deterministic and factual
        messages: [
          {
            role: 'system',
            content:
              'You are an expert HR recruitment parser. Extract structured CV data accurately from the raw document text. Never guess or invent missing details—return null for any field not explicitly stated.',
          },
          {
            role: 'user',
            content: `Parse the following CV text:\n\n${result.value}`,
          },
        ],
        response_format: zodResponseFormat(cvSchema, 'parsed_cv'),
      });
      
      const parsedData = completion.choices[0]?.message.parsed;
      
      if (!parsedData) {
        throw new Error('OpenAI failed to parse the CV structure.');
      }
      return { message: JSON.stringify(parsedData), success: true };      
    } catch (error) {
      console.error('DOCX parsing error:', error);
      return { message: "Failed to parse DOCX text." + error };
    }
  } else {
    try {
      const text = await file.text();
      return {
        message: text,
        success: true,
      };
    } catch (error) {
      console.error('Text file parsing error:', error);
      return { message: "Failed to read text file." + error };
    }
  }
}