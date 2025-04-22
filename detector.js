window.detector = {
    check: async (text) => {
      // Placeholder logic — replace with actual AI detection logic
      const isAI = text.length % 2 === 0; // Random rule
      return isAI ? "Likely AI-generated." : "Likely human-written.";
    }
  };
  