import { Paperclip } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ButtonOutlineCSS } from "@/consts/button-css";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { dracula } from "@uiw/codemirror-theme-dracula";
import CodeMirror from "@uiw/react-codemirror";

interface Props {
  content: unknown;
  text?: string;
}

export default function CodeEditorDialog({
  content,
  text = "Detail Data (JSON)",
}: Props) {
  const readOnlyExtensions = [
    javascript({ jsx: true }),
    EditorView.editable.of(false),
    EditorView.lineWrapping,
  ];

  // Estimasi tinggi berdasarkan jumlah baris
  const jsonString = JSON.stringify(content, null, 2);
  const lineCount = jsonString.split("\n").length;
  const estimatedHeight = `${Math.max(lineCount * 20, 200)}px`;

  return (
    <Dialog>
      <DialogTrigger className={ButtonOutlineCSS}>
        <Paperclip /> {text}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Detail Data</DialogTitle>
          <DialogDescription className="mb-4">
            Dialog ini menampilkan detail data yang digunakan sistem dalam JSON.
          </DialogDescription>
        </DialogHeader>

        <div
          className="border rounded-md overflow-auto"
          style={{
            height: estimatedHeight,
            maxHeight: "60vh",
            minHeight: "200px",
          }}>
          <CodeMirror
            value={jsonString}
            height="100%"
            width="100%"
            theme={dracula}
            extensions={readOnlyExtensions}
            readOnly={true}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              bracketMatching: true,
              syntaxHighlighting: true,
              // lineWrapping: true,
              highlightActiveLine: false,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
