"use client";

import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Image as ImageIcon,
  Undo,
  Redo,
  X,
  Pencil,
  ChevronUp,
  ChevronDown,
  Plus,
  GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MediaPicker, type MediaPickerResult } from "@/components/admin/media-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your post...",
  required = false 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<{ element: HTMLImageElement; url: string; alt: string; title: string; caption: string } | null>(null);

  // Add block styling and make blocks more visible
  const enhanceBlocks = () => {
    if (!editorRef.current) return;
    
    // Add block class to block elements for styling
    const blockElements = editorRef.current.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote');
    blockElements.forEach((el) => {
      if (!el.classList.contains('rich-text-block')) {
        el.classList.add('rich-text-block');
      }
    });
  };

  useEffect(() => {
    if (editorRef.current) {
      // Only update if the value has changed and is different from current content
      if (value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value || '';
        
        // Ensure images are wrapped in block elements and have edit buttons
        const images = editorRef.current.querySelectorAll('img');
        images.forEach((img) => {
          // Check if image is not already in a block
          if (!img.closest('.rich-text-image-block')) {
            const figure = document.createElement('figure');
            figure.className = 'rich-text-image-block';
            figure.contentEditable = 'false';
            img.parentNode?.insertBefore(figure, img);
            figure.appendChild(img);
          }
          
          // Add edit button if it doesn't exist
          const figure = img.closest('.rich-text-image-block');
          if (figure && !figure.querySelector('.rich-text-image-edit-btn')) {
            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'rich-text-image-edit-btn';
            editButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
            editButton.title = 'Edit image metadata';
            editButton.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEditImage(img as HTMLImageElement);
            };
            figure.appendChild(editButton);
          }
          
          // Store URL and ensure data attributes exist
          if (!img.dataset.imageUrl && img.src) {
            img.dataset.imageUrl = img.src;
          }
          // Ensure all metadata data attributes exist
          if (!img.dataset.imageAlt) {
            img.dataset.imageAlt = img.alt || '';
          }
          if (!img.dataset.imageTitle) {
            img.dataset.imageTitle = img.title || '';
          }
          if (!img.dataset.imageCaption) {
            const figure = img.closest('.rich-text-image-block');
            const figcaption = figure?.querySelector('figcaption') as HTMLElement | null;
            img.dataset.imageCaption = figcaption?.textContent || '';
          }
        });
        
        // Enhance blocks with styling
        enhanceBlocks();
      }
    }
  }, [value]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = () => {
      const html = editor.innerHTML;
      onChange(html);
      
      // Check undo/redo state
      try {
        setCanUndo(document.queryCommandEnabled('undo'));
        setCanRedo(document.queryCommandEnabled('redo'));
      } catch (e) {
        // Some browsers don't support these commands
      }
    };

    editor.addEventListener('input', handleInput);
    return () => editor.removeEventListener('input', handleInput);
  }, [onChange]);

  const executeCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value || undefined);
    editorRef.current?.focus();
    
    // Update the onChange after command
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatText = (command: string) => {
    executeCommand(command);
  };

  const insertHeading = (level: number) => {
    executeCommand('formatBlock', `h${level}`);
  };

  const insertList = (ordered: boolean) => {
    executeCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  };

  const insertQuote = () => {
    executeCommand('formatBlock', 'blockquote');
  };

  const insertImage = () => {
    setShowImageDialog(true);
  };

  const handleMediaSelect = (media: MediaPickerResult) => {
    const url = media.url;
    const editor = editorRef.current;
    if (!editor) return;

    // Create a block element for the image (like block editor)
    const imageBlock = document.createElement('figure');
    imageBlock.className = 'rich-text-image-block';
    imageBlock.contentEditable = 'false';
    
    const img = document.createElement('img');
    img.src = url;
    img.alt = media.alt || '';
    img.title = media.title || '';
    img.dataset.imageUrl = url;
    img.dataset.imageAlt = media.alt || '';
    img.dataset.imageTitle = media.title || '';
    img.dataset.imageCaption = media.caption || '';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '0 auto';
    
    // Add edit button
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'rich-text-image-edit-btn';
    editButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
    editButton.title = 'Edit image metadata';
    editButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleEditImage(img);
    };
    
    imageBlock.appendChild(img);
    imageBlock.appendChild(editButton);
    
    // Insert the block at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(imageBlock);
      
      // Add a paragraph after the image block for continued editing
      const paragraph = document.createElement('p');
      paragraph.innerHTML = '<br>';
      range.setStartAfter(imageBlock);
      range.insertNode(paragraph);
      
      // Move cursor to the new paragraph
      range.setStart(paragraph, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Fallback: append to end
      editor.appendChild(imageBlock);
      const paragraph = document.createElement('p');
      paragraph.innerHTML = '<br>';
      editor.appendChild(paragraph);
    }
    
    // Update the content
    onChange(editor.innerHTML);
    editor.focus();
    
    setShowImageDialog(false);
    toast.success("Image inserted!");
  };

  const handleEditImage = (imgElement: HTMLImageElement) => {
    const url = imgElement.src || imgElement.dataset.imageUrl || '';
    const alt = imgElement.alt || '';
    const title = imgElement.title || '';
    const caption = imgElement.dataset.caption || '';
    setEditingImage({ element: imgElement, url, alt, title, caption });
  };

  const handleSaveImageMetadata = (metadata: { alt: string; title: string; caption: string }) => {
    if (editingImage) {
      // Save to HTML attributes
      editingImage.element.alt = metadata.alt || '';
      editingImage.element.title = metadata.title || '';
      
      // Save to data attributes for additional metadata
      editingImage.element.dataset.imageAlt = metadata.alt || '';
      editingImage.element.dataset.imageTitle = metadata.title || '';
      editingImage.element.dataset.imageCaption = metadata.caption || '';
      
      // Also set aria-label for accessibility
      if (metadata.alt) {
        editingImage.element.setAttribute('aria-label', metadata.alt);
      } else {
        editingImage.element.removeAttribute('aria-label');
      }
      
      // Update the figure element with caption
      const figure = editingImage.element.closest('.rich-text-image-block') as HTMLElement | null;
      if (figure) {
        // Set data attributes on figure as well
        figure.dataset.imageAlt = metadata.alt || '';
        figure.dataset.imageTitle = metadata.title || '';
        figure.dataset.imageCaption = metadata.caption || '';
        
        // Update or create figcaption
        let figcaption = figure.querySelector('figcaption');
        if (metadata.caption) {
          if (!figcaption) {
            figcaption = document.createElement('figcaption');
            figure.appendChild(figcaption);
          }
          figcaption.textContent = metadata.caption;
          figcaption.className = 'rich-text-image-caption';
          figcaption.setAttribute('data-image-caption', metadata.caption);
        } else if (figcaption) {
          figcaption.remove();
        }
      }
      
      // Update the content
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
      
      setEditingImage(null);
      toast.success("Image metadata updated!");
    }
  };

  const handleUndo = () => {
    executeCommand('undo');
  };

  const handleRedo = () => {
    executeCommand('redo');
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const html = e.clipboardData.getData('text/html');
    
    if (html) {
      // Paste HTML but sanitize it
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const sanitized = tempDiv.innerHTML;
      document.execCommand('insertHTML', false, sanitized);
    } else {
      document.execCommand('insertText', false, text);
    }
    
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 flex gap-1 flex-wrap bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          title="Bold"
          className="h-8 w-8 p-0"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          title="Italic"
          className="h-8 w-8 p-0"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(1)}
          title="Heading 1"
          className="h-8 w-8 p-0"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(2)}
          title="Heading 2"
          className="h-8 w-8 p-0"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(3)}
          title="Heading 3"
          className="h-8 w-8 p-0"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertList(false)}
          title="Bullet List"
          className="h-8 w-8 p-0"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertList(true)}
          title="Numbered List"
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertQuote}
          title="Quote"
          className="h-8 w-8 p-0"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertImage}
          title="Insert Image"
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo"
          className="h-8 w-8 p-0"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo"
          className="h-8 w-8 p-0"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onPaste={handlePaste}
        className="rich-text-editor min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Media Picker Dialog */}
      <MediaPicker
        open={showImageDialog}
        onOpenChange={setShowImageDialog}
        onSelect={handleMediaSelect}
        title="Insert Image"
        description="Choose an image from your media library or upload a new one. The image will be inserted at the cursor position."
      />

      {/* Image Metadata Edit Dialog */}
      <Dialog open={!!editingImage} onOpenChange={(open: boolean) => !open && setEditingImage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Image Metadata</DialogTitle>
            <DialogDescription>
              Add metadata to improve SEO and accessibility for this image.
            </DialogDescription>
          </DialogHeader>
          {editingImage && (
            <ImageMetadataForm
              initialData={{
                alt: editingImage.alt,
                title: editingImage.title,
                caption: editingImage.caption,
              }}
              onSave={handleSaveImageMetadata}
              onCancel={() => setEditingImage(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Image Metadata Form Component
function ImageMetadataForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData: { alt: string; title: string; caption: string };
  onSave: (data: { alt: string; title: string; caption: string }) => void;
  onCancel: () => void;
}) {
  const [alt, setAlt] = useState(initialData.alt);
  const [title, setTitle] = useState(initialData.title);
  const [caption, setCaption] = useState(initialData.caption);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ alt, title, caption });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div>
        <Label htmlFor="image-alt">Alt Text <span className="text-red-500">*</span></Label>
        <Input
          id="image-alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Describe the image for accessibility"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Required for accessibility and SEO</p>
      </div>

      <div>
        <Label htmlFor="image-title">Title</Label>
        <Input
          id="image-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Image title"
        />
        <p className="text-xs text-gray-500 mt-1">Optional title for the image</p>
      </div>

      <div>
        <Label htmlFor="image-caption">Caption</Label>
        <Textarea
          id="image-caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption text displayed below the image"
          rows={2}
        />
        <p className="text-xs text-gray-500 mt-1">Optional caption displayed below the image</p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Metadata
        </Button>
      </div>
    </form>
  );
}

