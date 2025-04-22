chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "detectAIText",
    title: "Check if text is AI-generated",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "detectAIText") {
    const selectedText = info.selectionText;

    // Send text to Flask backend
    const response = await fetch("https://animated-winner-2.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedText })
    });

    const data = await response.json();

    // Inject banner into the page
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: ({ result, confidence }) => {
        if (window.getSelection) window.getSelection().removeAllRanges();
    
        const existing = document.getElementById("ai-detect-sidebar");
        if (existing) existing.remove();
    
        const sidebar = document.createElement("div");
        sidebar.id = "ai-detect-sidebar";
        sidebar.style.position = "fixed";
        sidebar.style.top = "0";
        sidebar.style.right = "0";
        sidebar.style.width = "320px";
        sidebar.style.height = "100%";
        sidebar.style.backgroundColor = "#1e1e1e";
        sidebar.style.color = "#fff";
        sidebar.style.zIndex = 99999;
        sidebar.style.padding = "20px";
        sidebar.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
        sidebar.style.fontFamily = "Arial, sans-serif";
        sidebar.style.display = "flex";
        sidebar.style.flexDirection = "column";
        sidebar.style.justifyContent = "space-between";
    
        const content = document.createElement("div");
    
        const title = document.createElement("h2");
        title.textContent = "🧠 AI Text Detection";
        title.style.marginBottom = "15px";
        content.appendChild(title);
    
        const resultText = document.createElement("p");
        resultText.innerHTML = `
          <strong>Result:</strong> ${result}<br/>
          <strong>AI confidence:</strong> ${confidence.ai}%<br/>
          <strong>Human confidence:</strong> ${confidence.human}%
        `;
        resultText.style.fontSize = "16px";
        resultText.style.marginBottom = "20px";
        content.appendChild(resultText);
    
        const link = document.createElement("a");
        link.href = "https://docs.google.com/forms/d/e/1FAIpQLSce77FhdxFSmAyQiyBoJ4hYAoSDXSDC-y-wgjXIC_xtxqFosA/viewform";
        link.textContent = "Let us know your thoughts on how we can make this better.";
        link.style.color = "#4ea3f1";
        link.style.textDecoration = "underline";
        link.target = "_blank";
        content.appendChild(link);
    
        sidebar.appendChild(content);
    
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.style.marginTop = "100px";
        closeBtn.style.padding = "40px";
        closeBtn.style.border = "none";
        closeBtn.style.background = "#444";
        closeBtn.style.color = "#fff";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = () => sidebar.remove();
    
        sidebar.appendChild(closeBtn);
    
        document.body.appendChild(sidebar);
      },
      args: [{ result: data.result, confidence: data.confidence }]
    });
    
    
    
  }
});
