import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, List } from "lucide-react";
import { useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  rows?: number;
}

export function RichTextEditor({ value, onChange, id, rows = 10 }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = beforeText + before + selectedText + after + afterText;
    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertBulletPoint = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(start);

    // Check if we're at the start of a line
    const lastNewline = beforeText.lastIndexOf('\n');
    const currentLineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    const currentLine = beforeText.substring(currentLineStart);

    let newText: string;
    if (currentLine.trim() === '') {
      // Empty line, just add bullet
      newText = beforeText + '- ' + afterText;
    } else {
      // Add bullet on new line
      newText = beforeText + '\n- ' + afterText;
    }

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newPosition = newText.length - afterText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleBoldClick = () => {
    insertMarkdown('**', '**');
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 border-b border-border pb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBoldClick}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertBulletPoint}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground flex items-center ml-2">
          Markdown formatting supported
        </span>
      </div>
      <Textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="font-mono text-sm"
      />
    </div>
  );
}
