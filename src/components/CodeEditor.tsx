import { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";

const CodeEditor = () => {
  const defaultCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website with Codepad</title>

  <style>
    /* Add your styles here */
  </style>
</head>

<body>
  <h1>Hello, World!</h1>

  <script>
    // Add your JavaScript here
    console.log("Hello from the script!");
  </script>
</body>
</html>`;
  
  const [value, setValue] = useState<string>(
    localStorage.getItem("code") || defaultCode
  );
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const onMount = (editorInstance: editor.IStandaloneCodeEditor, monaco: any): void => {
    editorRef.current = editorInstance;
    editorInstance.focus();

    // Configure embedded languages for HTML
    monaco.languages.html.htmlDefaults.setOptions({
      autoClosingTags: true,
      format: true,
      suggest: true,
      embeddedLanguages: {
        script: "javascript", // Enable JavaScript in <script> tags
        style: "css",         // Enable CSS in <style> tags
      },
    });
  };

  const handleRun = () => {
    if (iframeRef.current) {
      const iframeWindow = iframeRef.current.contentWindow;
      if (iframeWindow) {
        const iframeDoc = iframeWindow.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(value);
          iframeDoc.close();
        }
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("code", value);
  }, [value]);

  const handleEditorChange = (newValue: string | undefined) => {
    setValue(newValue || "");
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codepad_project.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setValue(defaultCode);
  };

  return (
    <div className="editor-container">
      <Editor
        height="90vh"
        theme="vs-dark"
        defaultLanguage="html"
        value={value}
        onChange={handleEditorChange}
        className="editor"
        onMount={onMount}
      />

      <div className="controls">
        <button onClick={handleRun}>
          <i className="bi bi-caret-right-fill"></i> Run
        </button>
        <button onClick={handleDownload}>
          <i className="bi bi-download"></i> Download as HTML
        </button>
        <button onClick={handleReset}>
          <i className="bi bi-arrow-clockwise"></i> Reset to Default
        </button>
      </div>

      <div className="output">
        <iframe
          ref={iframeRef}
          style={{ width: "100%", height: "300px" }}
          title="Output"
        ></iframe>
      </div>
    </div>
  );
};

export default CodeEditor;
