import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bold, List, Link as LinkIcon } from "lucide-react";
import { useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  rows?: number;
}

export function RichTextEditor({ value, onChange, id, rows = 10 }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const selectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

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

  const openLinkDialog = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    selectionRef.current = { start, end };
    setLinkText(value.substring(start, end));
    setLinkUrl("");
    setLinkOpen(true);
  };

  const applyLink = () => {
    const { start, end } = selectionRef.current;
    const text = linkText.trim() || linkUrl.trim();
    let url = linkUrl.trim();
    if (!url || !text) return;

    // Allow relative, mailto and tel links; default everything else to https
    if (!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url)) {
      url = `https://${url}`;
    }

    const markdown = `[${text}](${url})`;
    const newText = value.substring(0, start) + markdown + value.substring(end);
    onChange(newText);
    setLinkOpen(false);

    setTimeout(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      const position = start + markdown.length;
      textarea.setSelectionRange(position, position);
    }, 0);
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openLinkDialog}
          title="Insert link"
        >
          <LinkIcon className="h-4 w-4" />
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

      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-text">Link text</Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Text readers will see"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">Link address</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyLink();
                  }
                }}
                placeholder="https://example.com or /pricing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setLinkOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={applyLink} disabled={!linkUrl.trim()}>
              Insert link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
