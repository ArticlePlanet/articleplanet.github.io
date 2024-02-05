if (localStorage.accessToken) {
    document.getElementById("account").innerText = "Account";
  }
  
  let img = document.createElement("img");
  img.src = "https://iplogger.com/ArticlePlanet";
img.width = "0";
  img.alt = "Image For Analysis Purpose";
  document.body.appendChild(img);
img.hidden = true;
  
  // Create a script element for gtag.js
  var scriptElement = document.createElement('script');
  scriptElement.async = true;
  scriptElement.src = 'https://www.googletagmanager.com/gtag/js?id=G-1992S8P4VR';
  
  // Append the gtag.js script element to the head tag
  document.head.appendChild(scriptElement);
  
  // Create a script element for gtag configuration
  var configScript = document.createElement('script');
  configScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-1992S8P4VR');
  `;
  
  // Append the gtag configuration script element to the head tag
  document.head.appendChild(configScript);
  
  class ParseMark {
    constructor(markdown) {
      this.markdown = markdown;
      this.metadata = {};
      this.content = "";
      this.parse();
    }
  
    parse() {
      const match = this.markdown.match(/^---([\s\S]*?)\n---([\s\S]*)/);
  
      if (match) {
        this.extractMetadata(match[1]);
        this.content = match[2].trim();
      } else {
        // If no front matter found, consider the entire content as the content
        this.content = this.markdown.trim();
      }
    }
  
    extractMetadata(yamlString) {
      const metadataLines = yamlString
        .split("\n")
        .filter((line) => line.trim() !== "");
      this.metadata = {};
      metadataLines.forEach((line) => {
        const [key, ...valueParts] = line.split(":").map((item) => item.trim());
        this.metadata[key] = valueParts
          .join(":")
          .replace(/(^"|"$)/g, "")
          .trim();
      });
      this.metadata.tags = this.metadata.tags
        ? this.metadata.tags.split(",").map((tag) => tag.trim())
        : [];
    }
  
    getMetadata() {
      return this.metadata;
    }
  
    getRawMetadata() {
      const metadataString = `---${Object.entries(this.metadata)
        .map(([key, value]) => `\n${key}: ${value}`)
        .join("")}\n---`;
      return metadataString.trim();
    }
  
    getContent() {
      return this.content;
    }
  }
  
