import vision from '@google-cloud/vision';
import fs from 'fs';

const client = new vision.ImageAnnotatorClient();

export const extractTextFromImage = async (imagePath) => {
  try {
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;

    // First element is the full text block
    const text = detections[0]?.description || '';

    // Optional: delete the image file after processing
    fs.unlink(imagePath, () => {});
    return text;
  } catch (error) {
    console.error('[Google Vision OCR Error]', error);
    throw new Error('Failed to extract text from image');
  }
};
