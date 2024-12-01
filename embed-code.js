// Direct embed code for websites
const embedCode = `<iframe 
  src="https://provisionpicks.com"
  style="width: 100%; height: 100vh; border: none; min-height: 100vh; max-width: 100%; overflow: hidden;"
  allow="clipboard-write; encrypted-media"
  allowfullscreen
  referrerpolicy="strict-origin"
  loading="eager"
  importance="high"
></iframe>`;

// For direct usage in HTML
document.write(\`
  <div style="width: 100%; height: 100vh; overflow: hidden; position: relative;">
    \${embedCode}
  </div>
\`);