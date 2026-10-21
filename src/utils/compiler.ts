import { VirtualFile } from '../types';

/**
 * Builds the complete standalone HTML payload for the sandboxed iframe.
 */
export function buildSandboxedHtml(files: VirtualFile[]): string {
  const indexHtmlFile = files.find(f => f.path === '/index.html');
  const appTsxFile = files.find(f => f.path === '/src/App.tsx');
  const indexCssFile = files.find(f => f.path === '/src/index.css');

  // Any custom CSS
  const customCss = indexCssFile ? indexCssFile.content.replace('@import "tailwindcss";', '') : '';

  // Clean React component code
  let appCode = appTsxFile ? appTsxFile.content : `export default function App() { return <div>No App.tsx found</div>; }`;

  // Escape any raw script closing tags in user code
  const safeAppCode = JSON.stringify(appCode);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevForge Sandbox</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- React & ReactDOM -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin></script>
  
  <!-- Babel Standalone for live JSX/TSX compilation -->
  <script src="https://unpkg.com/@babel/standalone@7.24.4/babel.min.js"></script>
  
  <!-- Lucide Icons for sandbox preview -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #09090b;
      color: #f4f4f5;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    #error-container {
      display: none;
      padding: 1rem;
      background: #450a0a;
      border: 1px solid #991b1b;
      border-radius: 0.5rem;
      color: #fca5a5;
      margin: 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      white-space: pre-wrap;
      line-height: 1.5;
    }
    ${customCss}
  </style>

  <script>
    // Console log interception to parent
    (function() {
      const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
      };

      function sendLog(level, args) {
        try {
          const text = args.map(arg => {
            if (arg === null) return 'null';
            if (arg === undefined) return 'undefined';
            if (typeof arg === 'object') {
              try { return JSON.stringify(arg, null, 2); } catch (_) { return String(arg); }
            }
            return String(arg);
          }).join(' ');

          window.parent.postMessage({
            type: 'DEVFORGE_CONSOLE',
            level: level,
            text: text,
            timestamp: new Date().toLocaleTimeString()
          }, '*');
        } catch (e) {
          originalConsole.error('Failed to post console message', e);
        }
      }

      console.log = function(...args) {
        originalConsole.log.apply(console, args);
        sendLog('log', args);
      };
      console.info = function(...args) {
        originalConsole.info.apply(console, args);
        sendLog('info', args);
      };
      console.warn = function(...args) {
        originalConsole.warn.apply(console, args);
        sendLog('warn', args);
      };
      console.error = function(...args) {
        originalConsole.error.apply(console, args);
        sendLog('error', args);
      };

      window.onerror = function(message, source, lineno, colno, error) {
        const errorText = 'Runtime Error: ' + message + (lineno ? ' (Line ' + lineno + ')' : '');
        showError(errorText);
        sendLog('error', [errorText]);
        return false;
      };

      window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason ? (event.reason.stack || event.reason.message || event.reason) : 'Unknown Promise Rejection';
        const errorText = 'Unhandled Promise: ' + reason;
        showError(errorText);
        sendLog('error', [errorText]);
      });
    })();

    function showError(msg) {
      const box = document.getElementById('error-container');
      if (box) {
        box.style.display = 'block';
        box.textContent = msg;
      }
    }

    function hideError() {
      const box = document.getElementById('error-container');
      if (box) {
        box.style.display = 'none';
        box.textContent = '';
      }
    }
  </script>
</head>
<body>
  <div id="error-container"></div>
  <div id="root"></div>

  <script>
    (function runUserCode() {
      const rawCode = ${safeAppCode};
      
      try {
        hideError();

        // Prepare code: replace ES module imports of React with window.React
        let processedCode = rawCode
          .replace(/import\\s+React\\s*,\\s*\\{([^}]+)\\}\\s*from\\s*['"][^'"]+['"];?/g, 'const { $1 } = React;')
          .replace(/import\\s+\\{\\s*([^}]+)\\s*\\}\\s*from\\s*['"]react['"];?/g, 'const { $1 } = React;')
          .replace(/import\\s+React\\s*from\\s*['"][^'"]+['"];?/g, '/* React from window */')
          .replace(/import\\s+['"][^'"]+\\.css['"];?/g, '/* css imported */')
          .replace(/import\\s+.*from\\s*['"][^'"]+['"];?/g, '/* generic import stripped */')
          .replace(/export\\s+default\\s+function\\s+([A-Za-z0-9_]+)/g, 'function $1')
          .replace(/export\\s+default\\s+/g, 'window.__DevForgeRootComponent = ');

        // If function App exists and not yet set to window.__DevForgeRootComponent
        if (!processedCode.includes('window.__DevForgeRootComponent')) {
          processedCode += '\\nwindow.__DevForgeRootComponent = typeof App !== "undefined" ? App : null;';
        }

        // Transpile using Babel Standalone
        const transformed = Babel.transform(processedCode, {
          presets: ['react', 'typescript'],
          filename: 'App.tsx'
        }).code;

        // Execute transpiled script
        const executeFn = new Function('React', 'ReactDOM', transformed + '\\nreturn window.__DevForgeRootComponent;');
        const RootComponent = executeFn(window.React, window.ReactDOM);

        if (!RootComponent) {
          throw new Error('No default exported component or App() function found in App.tsx');
        }

        const rootEl = document.getElementById('root');
        const reactRoot = ReactDOM.createRoot(rootEl);
        reactRoot.render(React.createElement(RootComponent));
        console.log('[DevForge] Sandbox loaded and mounted successfully.');
      } catch (err) {
        const errorMsg = 'Compilation/Render Error:\\n' + (err.message || String(err));
        showError(errorMsg);
        console.error(errorMsg);
      }
    })();
  </script>
</body>
</html>`;
}
