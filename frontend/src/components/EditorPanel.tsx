import { autocompletion } from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
import { EditorView, keymap } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { Play, RotateCcw } from "lucide-react";

import { pythonCompletionSource } from "../editor/pythonCompletions";

type Props = {
  code: string;
  running: boolean;
  onChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
};

export function EditorPanel({ code, running, onChange, onRun, onReset }: Props) {
  const editorExtensions = [
    python(),
    autocompletion({ override: [pythonCompletionSource] }),
    keymap.of([
      {
        key: "Mod-Enter",
        run: () => {
          onRun();
          return true;
        },
      },
    ]),
    EditorView.lineWrapping,
  ];

  return (
    <section className="editor-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Python 智能编辑器</div>
          <p>带语法高亮、代码提示和自动缩进，修改后运行即可刷新执行状态。</p>
        </div>
        <div className="toolbar">
          <button className="icon-button secondary" onClick={onReset} type="button" title="重置代码" aria-label="重置代码">
            <RotateCcw size={18} />
          </button>
          <button className="run-button" disabled={running} onClick={onRun} type="button">
            <Play size={18} />
            {running ? "运行中" : "运行代码"}
          </button>
        </div>
      </div>
      <div className="editor-capabilities" aria-label="编辑器能力">
        <span>语法高亮</span>
        <span>代码提示</span>
        <span>自动缩进</span>
        <span>Ctrl/⌘ + Enter 运行</span>
      </div>
      <CodeMirror
        aria-label="Python 代码编辑器"
        basicSetup={{ autocompletion: true, bracketMatching: true, lineNumbers: true }}
        className="code-editor"
        extensions={editorExtensions}
        height="360px"
        theme="light"
        value={code}
        onChange={onChange}
      />
    </section>
  );
}
