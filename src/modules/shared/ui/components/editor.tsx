"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
} from "lucide-react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
}

export function Editor({
  value,
  onChange,
  placeholder = "Tell us more about your request...",
  className,
  minHeight = "200px",
  maxHeight = "400px",
  disabled = false,
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  // Check current formatting state
  const updateActiveFormats = () => {
    const formats = new Set<string>();

    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("insertUnorderedList")) formats.add("insertUnorderedList");
    if (document.queryCommandState("insertOrderedList")) formats.add("insertOrderedList");
    if (document.queryCommandState("justifyLeft")) formats.add("justifyLeft");
    if (document.queryCommandState("justifyCenter")) formats.add("justifyCenter");
    if (document.queryCommandState("justifyRight")) formats.add("justifyRight");

    setActiveFormats(formats);
  };

  // Enhanced toolbar commands with better list handling
  const execCommand = (command: string, value?: string) => {
    // Ensure editor is focused
    editorRef.current?.focus();

    if (command === "insertUnorderedList" || command === "insertOrderedList") {
      // Better list handling - preserve selection
      const selection = window.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

      // Execute the command
      document.execCommand(command, false, value);

      // Restore selection if possible
      if (range && selection) {
        try {
          selection.removeAllRanges();
          selection.addRange(range);
        } catch {
          // Ignore selection restoration errors
        }
      }

      // Force update after list command with slight delay
      setTimeout(() => {
        updateContent();
        updateActiveFormats();
      }, 50);
    } else {
      // Standard command execution
      document.execCommand(command, false, value);
      updateContent();
      updateActiveFormats();
    }
  };

  // Update content and call onChange
  const updateContent = () => {
    if (editorRef.current) {
      // Get HTML content to preserve formatting
      const htmlContent = editorRef.current.innerHTML || "";
      onChange(htmlContent);
    }
  };

  // Handle input changes and cursor movement
  const handleInput = () => {
    updateContent();
    updateActiveFormats();
  };

  const handleSelectionChange = useCallback(() => {
    updateActiveFormats();
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    updateActiveFormats();
    // Listen for selection changes
    document.addEventListener("selectionchange", handleSelectionChange);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Remove selection change listener
    document.removeEventListener("selectionchange", handleSelectionChange);
  };

  // Set initial content and cleanup
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [value, handleSelectionChange]);

  // Handle paste to clean up formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    updateContent();
  };

  const toolbarButtons = [
    {
      icon: Bold,
      command: "bold",
      title: "Bold (Ctrl+B)",
    },
    {
      icon: Italic,
      command: "italic",
      title: "Italic (Ctrl+I)",
    },
    {
      icon: Underline,
      command: "underline",
      title: "Underline (Ctrl+U)",
    },
    {
      icon: List,
      command: "insertUnorderedList",
      title: "Bullet List",
    },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      title: "Numbered List",
    },
    {
      icon: Quote,
      command: "formatBlock",
      value: "blockquote",
      title: "Quote",
    },
  ];

  const alignmentButtons = [
    {
      icon: AlignLeft,
      command: "justifyLeft",
      title: "Align Left",
    },
    {
      icon: AlignCenter,
      command: "justifyCenter",
      title: "Align Center",
    },
    {
      icon: AlignRight,
      command: "justifyRight",
      title: "Align Right",
    },
  ];

  return (
    <div
      className={cn(
        "border-border bg-background overflow-hidden rounded-lg border",
        isFocused && "ring-primary/20 border-primary/30 ring-2",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="bg-muted/50 flex items-center justify-between gap-2 border-b p-3">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => {
            const Icon = button.icon;
            const isActive = activeFormats.has(button.command);
            return (
              <Button
                key={index}
                type="button"
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn("h-8 w-8 p-0", isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10")}
                onClick={() => execCommand(button.command, button.value)}
                title={button.title}
                disabled={disabled}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          {alignmentButtons.map((button, index) => {
            const Icon = button.icon;
            const isActive = activeFormats.has(button.command);
            return (
              <Button
                key={index}
                type="button"
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn("h-8 w-8 p-0", isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10")}
                onClick={() => execCommand(button.command)}
                title={button.title}
                disabled={disabled}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Editor content */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        className={cn(
          "text-foreground w-full p-4 leading-relaxed outline-none",
          "focus:bg-muted/10 transition-colors",
          disabled && "bg-muted text-muted-foreground cursor-not-allowed",
          "empty:before:text-muted-foreground empty:before:pointer-events-none empty:before:content-[attr(data-placeholder)]",
          // List styling
          "[&_ul]:my-2 [&_ul]:ml-6 [&_ul]:list-disc",
          "[&_ol]:my-2 [&_ol]:ml-6 [&_ol]:list-decimal",
          "[&_li]:my-1",
          "[&_blockquote]:border-primary/20 [&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic",
        )}
        style={{
          minHeight,
          maxHeight,
          overflowY: "auto",
        }}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Footer with character count */}
      <div className="text-muted-foreground bg-muted/30 flex items-center justify-between border-t px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Type className="h-3 w-3" />
          <span>{isFocused ? "Use toolbar for formatting" : "Rich text editor"}</span>
        </div>
        <span className="font-medium">{editorRef.current?.innerText.length || 0} characters</span>
      </div>
    </div>
  );
}
