import Tesseract from 'tesseract.js';
import fs from 'fs';

export const extractTextFromImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(imagePath, 'eng')
      .then(({ data: { text } }) => {
        fs.unlink(imagePath, () => {}); // Delete file after OCR
        resolve(text);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
