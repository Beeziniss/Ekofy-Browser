"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@/modules/shared/ui/components/editor";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

const UploadIcon = () => (
  <svg 
    className="mx-auto h-12 w-12 mb-4" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="uploadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3B54EA" />
        <stop offset="100%" stopColor="#AB4EE5" />
      </linearGradient>
    </defs>
    <path 
      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" 
      stroke="url(#uploadGradient)" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

interface RequestFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    title: string;
    description: string;
    duration: string;
  };
  onSubmit: (data: { title: string; description: string; duration: string; attachments: File[] }) => void;
  onCancel?: () => void;
}

export function RequestForm({ mode, initialData, onSubmit, onCancel }: RequestFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, duration, attachments });
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-2">Request Hub</h1>
        {mode === 'edit' && (
          <div className="flex justify-end">
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Request title"
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tell us more</label>
          <Editor
            value={description}
            onChange={setDescription}
            placeholder="Description for requests or something else..."
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration</label>
          <Input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="days"
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Attachment (optional)</label>
          <Card 
            className={`border-2 border-dashed transition-colors ${
              isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <CardContent 
              className="p-12 text-center"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={handleDrop}
            >
              <UploadIcon />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop audio files to get started
              </p>
              <Button 
                type="button" 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'audio/*,image/*';
                  input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files);
                  input.click();
                }}
                className="primary_gradient text-white "
              >
                Choose files
              </Button>
            </CardContent>
          </Card>

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {mode === 'create' ? 'Submit' : 'Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}