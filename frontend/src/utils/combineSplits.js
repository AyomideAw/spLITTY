// frontend/src/utils/combineSplits.js
// combineSplits.js
export function combineSplits(textSplit, receiptSplit) {
    const combined = {};
  
    // Add text split entries
    if (textSplit) {
      Object.entries(textSplit).forEach(([person, amount]) => {
        if (!person) return;
        combined[person] = (combined[person] || 0) + amount;
      });
    }
  
    // Add receipt split entries
    if (receiptSplit) {
      Object.entries(receiptSplit).forEach(([person, amount]) => {
        if (!person) return;
        combined[person] = (combined[person] || 0) + amount;
      });
    }
  
    return combined;
  }
  