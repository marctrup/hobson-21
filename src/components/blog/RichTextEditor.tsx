import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (startTag: string, endTag: string, defaultText?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const insertText = selectedText || defaultText || '';
    
    const newContent = 
      content.substring(0, start) + 
      startTag + insertText + endTag + 
      content.substring(end);
    
    onChange(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + startTag.length + insertText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertBlock = (blockContent: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = 
      content.substring(0, start) + 
      '\n\n' + blockContent + '\n\n' + 
      content.substring(end);
    
    onChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + blockContent.length + 4;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleBold = () => insertAtCursor('<strong>', '</strong>', 'bold text');
  const handleItalic = () => insertAtCursor('<em>', '</em>', 'italic text');
  const handleUnderline = () => insertAtCursor('<u>', '</u>', 'underlined text');
  
  const handleHeading = (level: number) => {
    const tag = `h${level}`;
    insertAtCursor(`<${tag}>`, `</${tag}>`, `Heading ${level}`);
  };

  const handleList = (ordered: boolean = false) => {
    const listType = ordered ? 'ol' : 'ul';
    const listContent = `<${listType}>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</${listType}>`;
    insertBlock(listContent);
  };

  const handleLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      insertAtCursor(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>', 'link text');
    }
  };

  const handleColor = () => {
    const color = prompt('Enter color (e.g., #ff0000, red, blue):');
    if (color) {
      insertAtCursor(`<span style="color: ${color}">`, '</span>', 'colored text');
    }
  };

  const handleAlignment = (align: string) => {
    insertAtCursor(`<div style="text-align: ${align}">`, '</div>', 'aligned text');
  };

  const handleParagraph = () => {
    insertBlock('<p>New paragraph content here.</p>');
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
            onClick={handleBold}
            className="h-8 w-8 p-0"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleItalic}
            className="h-8 w-8 p-0"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUnderline}
            className="h-8 w-8 p-0"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleColor}
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
            onClick={() => handleHeading(1)}
            className="h-8 w-8 p-0"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleHeading(2)}
            className="h-8 w-8 p-0"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleHeading(3)}
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
            onClick={() => handleList(false)}
            className="h-8 w-8 p-0"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleList(true)}
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
            onClick={() => handleAlignment('left')}
            className="h-8 w-8 p-0"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleAlignment('center')}
            className="h-8 w-8 p-0"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleAlignment('right')}
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
            onClick={handleLink}
            className="h-8 w-8 p-0"
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleParagraph}
            className="h-8 w-8 p-0"
            title="New Paragraph"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[400px] border-0 rounded-none resize-none focus-visible:ring-0 font-mono text-sm"
        style={{ lineHeight: '1.6' }}
      />
      
      {/* Helper Text */}
      <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/10 border-t">
        Use the toolbar buttons to add HTML formatting. The content will be properly rendered when published.
      </div>
    </div>
  );
};