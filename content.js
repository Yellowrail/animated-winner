window.addEventListener("message", async (event) => {
    if (event.source !== window || event.data.type !== "DETECT_AI") return;
  
    const text = event.data.text;
    const result = await detectAI(text);
  
    let banner = document.getElementById("ai-detect-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "ai-detect-banner";
      banner.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        border: 2px solid #444;
        padding: 15px;
        z-index: 9999;
        font-family: sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        border-radius: 10px;
        max-width: 300px;
      `;
      document.body.appendChild(banner);
    }
  
    banner.innerHTML = `
      <strong>AI Detection Result:</strong><br>
      ${result}
    `;
  });
  
  async function detectAI(text) {
    try {
      const response = await fetch("https://animated-winner-2.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });
  
      const data = await response.json();
      return data.result || "Could not classify the text.";
    } catch (error) {
      return "Error connecting to detection service.";
    }
  }
  
  
