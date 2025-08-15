import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Write your content here..."
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertList = (ordered: boolean = false) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const listElement = document.createElement(ordered ? 'ol' : 'ul');
    listElement.style.marginTop = '16px';
    listElement.style.marginBottom = '16px';
    listElement.style.paddingLeft = '24px';
    
    const listItem = document.createElement('li');
    listItem.style.marginBottom = '8px';
    listItem.innerHTML = 'List item';
    listElement.appendChild(listItem);

    range.deleteContents();
    range.insertNode(listElement);
    
    // Position cursor at the end of the first list item
    const newRange = document.createRange();
    newRange.setStart(listItem, 1);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    updateContent();
  };

  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const heading = document.createElement(`h${level}`);
    
    // Set heading styles
    const styles = {
      1: { fontSize: '2rem', fontWeight: '700', marginTop: '32px', marginBottom: '16px' },
      2: { fontSize: '1.5rem', fontWeight: '600', marginTop: '24px', marginBottom: '12px' },
      3: { fontSize: '1.25rem', fontWeight: '600', marginTop: '20px', marginBottom: '10px' }
    };
    
    const style = styles[level as keyof typeof styles];
    Object.assign(heading.style, style);
    
    heading.innerHTML = selection.toString() || `Heading ${level}`;
    
    range.deleteContents();
    range.insertNode(heading);
    
    // Add a paragraph after the heading
    const paragraph = document.createElement('p');
    paragraph.style.marginBottom = '16px';
    paragraph.innerHTML = '<br>';
    heading.parentNode?.insertBefore(paragraph, heading.nextSibling);
    
    updateContent();
  };

  const insertLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const changeTextColor = () => {
    const color = prompt('Enter color (hex code, e.g., #ff0000):');
    if (color) {
      execCommand('foreColor', color);
    }
  };

  const insertParagraph = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const paragraph = document.createElement('p');
    paragraph.style.marginBottom = '16px';
    paragraph.innerHTML = '<br>';
    
    range.deleteContents();
    range.insertNode(paragraph);
    
    // Position cursor inside the paragraph
    const newRange = document.createRange();
    newRange.setStart(paragraph, 0);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    updateContent();
  };

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', tag);
  };

  return (
    <div className="border border-input rounded-md overflow-hidden">
      {/* Formatting Toolbar */}
      <div className="border-b bg-muted/20 px-3 py-2 flex items-center gap-1 flex-wrap">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('bold')}
            className="h-8 w-8 p-0"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('italic')}
            className="h-8 w-8 p-0"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('underline')}
            className="h-8 w-8 p-0"
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={changeTextColor}
            className="h-8 w-8 p-0"
            title="Text Color"
          >
            <Palette className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertHeading(1)}
            className="h-8 w-8 p-0"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertHeading(2)}
            className="h-8 w-8 p-0"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertHeading(3)}
            className="h-8 w-8 p-0"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertList(false)}
            className="h-8 w-8 p-0"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertList(true)}
            className="h-8 w-8 p-0"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyLeft')}
            className="h-8 w-8 p-0"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyCenter')}
            className="h-8 w-8 p-0"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyRight')}
            className="h-8 w-8 p-0"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Links & Utilities */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertLink}
            className="h-8 w-8 p-0"
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertParagraph}
            className="h-8 w-8 p-0"
            title="New Paragraph"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "min-h-[400px] p-4 focus:outline-none",
          "prose prose-sm max-w-none",
          "[&_p]:mb-4 [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:mt-4 [&_h3]:mb-2",
          "[&_ul]:mb-4 [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:pl-6",
          "[&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:mb-4",
          "[&_a]:text-primary [&_a]:underline [&_a:hover]:text-primary/80"
        )}
        onInput={updateContent}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData?.getData('text/plain') || '';
          document.execCommand('insertText', false, text);
        }}
        suppressContentEditableWarning={true}
        style={{
          lineHeight: '1.6',
          color: 'hsl(var(--foreground))',
          fontSize: '14px'
        }}
      >
        {!content && (
          <div className="text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};