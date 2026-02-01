"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Plus,
  GripVertical,
  MoreVertical,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Bold,
  Italic,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
  Type,
  Minus,
  Search,
  Grid3x3,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MediaPicker, type MediaPickerResult } from '@/components/admin/media-picker';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'list' | 'quote' | 'code' | 'separator' | 'gallery';
  content: string;
  attributes?: {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    align?: 'left' | 'center' | 'right' | 'full';
    url?: string;
    alt?: string;
    title?: string;
    caption?: string;
    width?: number | string; // Custom width in pixels or percentage
    size?: 'small' | 'medium' | 'large' | 'full' | 'custom'; // Preset sizes
    rounded?: boolean; // Rounded corners
    linkUrl?: string; // Link URL if image should be clickable
    linkTarget?: '_self' | '_blank'; // Link target
    showCaption?: boolean; // Show/hide caption
    ordered?: boolean;
    items?: string[];
    images?: string[];
  };
}

interface BlockEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function BlockEditor({
  value,
  onChange,
  placeholder = "Type / to add a block",
  required = false,
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showInserterAt, setShowInserterAt] = useState<number | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [slashCommand, setSlashCommand] = useState<{ blockId: string; query: string } | null>(null);
  const [inserterSearch, setInserterSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inserterRef = useRef<HTMLDivElement>(null);

  // Close inserter when clicking outside
  useEffect(() => {
    if (showInserterAt === null && !slashCommand) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking on inserter itself
      if (inserterRef.current?.contains(target)) {
        return;
      }
      
      // Don't close if clicking on block controls or toolbar
      if (target.closest('.block-controls, .block-toolbar, .block-inserter-btn')) {
        return;
      }
      
      // Close inserter
      setShowInserterAt(null);
      setSlashCommand(null);
      setInserterSearch('');
    };

    // Use mousedown to catch clicks before they bubble
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [showInserterAt, slashCommand]);

  // Deselect blocks when clicking outside the editor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't deselect if clicking inside the editor or its controls
      if (containerRef.current?.contains(target)) {
        return;
      }
      
      // Don't deselect if clicking on block controls, toolbar, or inserter
      if (target.closest('.block-controls, .block-toolbar, .block-inserter, .block-inserter-btn, .wp-block-editor-wrapper')) {
        return;
      }
      
      // Don't deselect if clicking on media picker or other dialogs
      if (target.closest('[role="dialog"], .media-picker, [data-state="open"]')) {
        return;
      }
      
      // Deselect block
      setSelectedBlockId(null);
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  const isInitialMount = useRef(true);
  const lastSerializedRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Parse HTML to blocks on mount
  useEffect(() => {
    if (value) {
      const parsed = parseHTMLToBlocks(value);
      if (parsed.length > 0) {
        setBlocks(parsed);
        lastSerializedRef.current = serializeBlocksToHTML(parsed);
      } else {
        const defaultBlock = createBlock('paragraph', '');
        setBlocks([defaultBlock]);
        lastSerializedRef.current = '';
      }
    } else {
      const defaultBlock = createBlock('paragraph', '');
      setBlocks([defaultBlock]);
      lastSerializedRef.current = '';
    }
    isInitialMount.current = false;
  }, []);

  // Only update blocks if value changed externally (not from our onChange)
  useEffect(() => {
    if (isInitialMount.current) return;
    
    const currentSerialized = serializeBlocksToHTML(blocks);
    // Only update if value changed from outside (e.g., switching tabs) and it's different from what we have
    if (value !== lastSerializedRef.current && value !== currentSerialized) {
      const parsed = parseHTMLToBlocks(value);
      if (parsed.length > 0) {
        setBlocks(parsed);
        lastSerializedRef.current = serializeBlocksToHTML(parsed);
      }
    }
  }, [value]);

  // Serialize blocks to HTML when blocks change (with debounce to prevent auto-save)
  useEffect(() => {
    if (isInitialMount.current) return;
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the onChange call to prevent auto-save
    debounceTimerRef.current = setTimeout(() => {
      const html = serializeBlocksToHTML(blocks);
      const currentHtml = lastSerializedRef.current;
      
      // Only call onChange if content actually changed
      if (html !== currentHtml && html !== value) {
        lastSerializedRef.current = html;
        onChange(html);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [blocks]);

  const createBlock = (type: Block['type'], content: string, attributes?: Block['attributes']): Block => {
    return {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      attributes,
    };
  };

  const insertBlock = (type: Block['type'], index?: number, replaceBlockId?: string) => {
    const newBlock = createBlock(type, '');
    
    if (replaceBlockId) {
      // Replace existing block (e.g., when using slash command)
      setBlocks(prev => prev.map(block => 
        block.id === replaceBlockId ? newBlock : block
      ));
      setSelectedBlockId(newBlock.id);
    } else {
      // Insert new block
      setBlocks(prev => {
        if (index !== undefined && index >= 0) {
          return [...prev.slice(0, index + 1), newBlock, ...prev.slice(index + 1)];
        }
        return [...prev, newBlock];
      });
      setSelectedBlockId(newBlock.id);
    }
    
    setShowInserterAt(null);
    setSlashCommand(null);
    setInserterSearch('');
    
    // Focus the new block
    setTimeout(() => {
      const blockEl = document.querySelector(`[data-block-id="${newBlock.id}"] [contenteditable]`);
      if (blockEl) {
        (blockEl as HTMLElement).focus();
        // Move cursor to start
        const range = document.createRange();
        range.selectNodeContents(blockEl);
        range.collapse(true);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 50);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(block =>
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => {
      const filtered = prev.filter(b => b.id !== id);
      if (filtered.length === 0) {
        return [createBlock('paragraph', '')];
      }
      const deletedIndex = prev.findIndex(b => b.id === id);
      const newSelectedId = deletedIndex > 0 ? prev[deletedIndex - 1].id : filtered[0].id;
      setSelectedBlockId(newSelectedId);
      return filtered;
    });
  };

  const duplicateBlock = (id: string) => {
    const block = blocks.find(b => b.id === id);
    if (block) {
      const newBlock = createBlock(block.type, block.content, block.attributes);
      const index = blocks.findIndex(b => b.id === id);
      setBlocks(prev => [...prev.slice(0, index + 1), newBlock, ...prev.slice(index + 1)]);
      setSelectedBlockId(newBlock.id);
    }
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    setBlocks(prev => {
      const newBlocks = [...prev];
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      return newBlocks;
    });
  };

  const handleMediaSelect = (media: MediaPickerResult) => {
    if (editingBlockId) {
      updateBlock(editingBlockId, {
        type: 'image',
        content: '',
        attributes: {
          url: media.url,
          alt: media.alt,
          title: media.title,
          caption: media.caption,
        },
      });
      setEditingBlockId(null);
      setShowMediaPicker(false);
    }
  };

  return (
    <div className="wp-block-editor-wrapper relative" style={{ paddingLeft: '48px', paddingRight: '48px' }}>
      <div className="wp-block-editor border border-gray-200 rounded-lg bg-white min-h-[400px] relative">
        <div ref={containerRef} className="editor-content p-4 relative">
        {blocks.length === 0 && (
          <div className="empty-editor text-center py-12 text-gray-400">
            <p>Start writing or type / to add a block</p>
          </div>
        )}
        
        {blocks.map((block, index) => (
          <React.Fragment key={block.id}>
            {/* Block Inserter Before (or inline for slash command) */}
            {slashCommand && slashCommand.blockId === block.id ? (
              <div ref={inserterRef} className="inline-block-inserter my-2">
                <BlockInserter
                  onSelect={(type) => {
                    // Replace current block with new block type
                    insertBlock(type, undefined, block.id);
                  }}
                  onClose={() => {
                    setSlashCommand(null);
                    setInserterSearch('');
                  }}
                  searchQuery={slashCommand.query}
                  onSearchChange={(query) => {
                    setSlashCommand({ ...slashCommand, query });
                  }}
                  showBrowseAll={false}
                />
              </div>
            ) : showInserterAt === index ? (
              <div ref={inserterRef}>
                <BlockInserter
                  onSelect={(type) => {
                    insertBlock(type, index - 1);
                  }}
                  onClose={() => {
                    setShowInserterAt(null);
                    setInserterSearch('');
                  }}
                  searchQuery={inserterSearch}
                  onSearchChange={setInserterSearch}
                  showBrowseAll
                />
              </div>
            ) : null}

            {/* Block Component */}
            <BlockComponent
              block={block}
              index={index}
              isSelected={selectedBlockId === block.id}
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
              onSelect={() => setSelectedBlockId(block.id)}
              onUpdate={(updates) => updateBlock(block.id, updates)}
              onDelete={() => deleteBlock(block.id)}
              onDuplicate={() => duplicateBlock(block.id)}
              onMoveUp={() => moveBlock(block.id, 'up')}
              onMoveDown={() => moveBlock(block.id, 'down')}
              onInsertBefore={() => setShowInserterAt(index)}
              onInsertAfter={() => setShowInserterAt(index + 1)}
              onInsertImage={() => {
                setEditingBlockId(block.id);
                setShowMediaPicker(true);
              }}
              onSlashCommand={(blockId: string, query: string | null) => {
                if (query !== null) {
                  setSlashCommand({ blockId, query: query || '' });
                } else {
                  setSlashCommand(null);
                }
              }}
            />
          </React.Fragment>
        ))}

        {/* Block Inserter After Last Block */}
        {showInserterAt === blocks.length && (
          <div ref={inserterRef}>
            <BlockInserter
              onSelect={(type) => {
                insertBlock(type, blocks.length - 1);
              }}
              onClose={() => {
                setShowInserterAt(null);
                setInserterSearch('');
              }}
              searchQuery={inserterSearch}
              onSearchChange={setInserterSearch}
              showBrowseAll
            />
          </div>
        )}

        {/* Add Block Button at End */}
        {!showInserterAt && !slashCommand && blocks.length > 0 && (
          <div className="block-inserter-trigger mt-2 flex items-center gap-2">
            <button
              onClick={() => {
                setShowInserterAt(blocks.length);
                setInserterSearch('');
              }}
              className="bg-black text-white hover:bg-gray-800 rounded h-8 w-8 flex items-center justify-center transition-colors"
              title="Add block"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Media Picker */}
      <MediaPicker
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={handleMediaSelect}
        title="Insert Image"
        description="Choose an image from your media library or upload a new one."
      />
      </div>
    </div>
  );
}

// Block Component
interface BlockComponentProps {
  block: Block;
  index: number;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onInsertBefore: () => void;
  onInsertAfter: () => void;
  onInsertImage: () => void;
  onSlashCommand: (blockId: string, query: string | null) => void;
}

function BlockComponent({
  block,
  index,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onInsertBefore,
  onInsertAfter,
  onInsertImage,
  onSlashCommand,
}: BlockComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected) {
      setShowToolbar(true);
    }
  }, [isSelected]);

  const handleContentChange = (newContent: string) => {
    onUpdate({ content: newContent });
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'paragraph':
        return (
          <ParagraphBlock
            content={block.content}
            onChange={handleContentChange}
            isSelected={isSelected}
            onSelect={onSelect}
            onSlashCommand={onSlashCommand}
            blockId={block.id}
            onDelete={onDelete}
          />
        );
      case 'heading':
        return (
          <HeadingBlock
            content={block.content}
            level={block.attributes?.level || 2}
            onChange={handleContentChange}
            onLevelChange={(level: 1 | 2 | 3 | 4 | 5 | 6) => onUpdate({ attributes: { ...block.attributes, level } })}
            isSelected={isSelected}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        );
      case 'image':
        return (
          <ImageBlock
            url={block.attributes?.url || ''}
            alt={block.attributes?.alt}
            title={block.attributes?.title}
            caption={block.attributes?.caption}
            align={block.attributes?.align || 'center'}
            width={block.attributes?.width}
            size={block.attributes?.size || 'medium'}
            rounded={block.attributes?.rounded !== false}
            linkUrl={block.attributes?.linkUrl}
            linkTarget={block.attributes?.linkTarget || '_self'}
            showCaption={block.attributes?.showCaption !== false}
            onUpdate={(attrs: any) => onUpdate({ attributes: { ...block.attributes, ...attrs } })}
            isSelected={isSelected}
            onSelect={onSelect}
            onInsertImage={onInsertImage}
          />
        );
      case 'list':
        return (
          <ListBlock
            items={block.attributes?.items || []}
            ordered={block.attributes?.ordered || false}
            onChange={(items: string[]) => onUpdate({ attributes: { ...block.attributes, items } })}
            onToggleOrdered={() => onUpdate({ attributes: { ...block.attributes, ordered: !block.attributes?.ordered } })}
            isSelected={isSelected}
            onSelect={onSelect}
          />
        );
      case 'quote':
        return (
          <QuoteBlock
            content={block.content}
            onChange={handleContentChange}
            isSelected={isSelected}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        );
      case 'code':
        return (
          <CodeBlock
            content={block.content}
            onChange={handleContentChange}
            isSelected={isSelected}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        );
      case 'separator':
        return <SeparatorBlock isSelected={isSelected} onSelect={onSelect} />;
      case 'gallery':
        return (
          <GalleryBlock
            images={block.attributes?.images || []}
            onChange={(images: any[]) => onUpdate({ attributes: { ...block.attributes, images } })}
            isSelected={isSelected}
            onSelect={onSelect}
            onInsertImage={onInsertImage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={blockRef}
      data-block-id={block.id}
      className={cn(
        "wp-block relative group",
        isSelected && "is-selected"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // Don't select if clicking on toolbar, controls, or inserter buttons
        if ((e.target as HTMLElement).closest('.block-toolbar, .block-controls, .block-inserter-btn')) return;
        // Don't select if clicking on contentEditable elements (they handle their own focus)
        if ((e.target as HTMLElement).isContentEditable && (e.target as HTMLElement).tagName !== 'DIV') return;
        onSelect();
      }}
    >
      {/* Block Controls (Left Side) */}
      <div 
        className={cn(
          "block-controls absolute -left-12 top-0 flex flex-col gap-1 transition-opacity z-50",
          (isSelected || isHovered) ? "opacity-100" : "opacity-0"
        )}
        style={{ pointerEvents: (isSelected || isHovered) ? 'auto' : 'none' }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <button
          type="button"
          className="block-mover w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-move bg-white border border-gray-200 rounded hover:border-gray-300 shadow-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Drag functionality would go here
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          title="Drag to move"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="block-inserter-btn w-8 h-8 flex items-center justify-center bg-black text-white hover:bg-gray-800 rounded transition-colors shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInsertAfter();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          title="Add block"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Block Toolbar (Top) */}
      {showToolbar && isSelected && (
        <div className="block-toolbar absolute -top-12 left-0 bg-gray-900 text-white rounded-lg shadow-lg p-1 flex items-center gap-1 z-50">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-white hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={isFirst}
          >
            <ArrowUp className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-white hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={isLast}
          >
            <ArrowDown className="w-3 h-3" />
          </Button>
          <div className="w-px h-4 bg-gray-600 mx-1" />
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-white hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-white hover:bg-red-600 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this block?')) {
                onDelete();
              }
            }}
            title="Delete block (or press Backspace when empty)"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Delete Button on Block (when hovered, right side) */}
      {isHovered && !isSelected && (
        <button
          className="absolute right-0 top-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors z-20 bg-white border border-gray-200 shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this block?')) {
              onDelete();
            }
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          title="Delete block"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {/* Block Content */}
      <div 
        className={cn(
          "block-content min-h-[32px] px-2 py-1 rounded transition-all",
          isSelected && "ring-2 ring-teal-500 bg-teal-50/50 shadow-sm"
        )}
        onClick={(e) => {
          // Allow selection when clicking on the block content area (not on contentEditable elements)
          if (!(e.target as HTMLElement).isContentEditable) {
            onSelect();
          }
        }}
      >
        {renderBlockContent()}
      </div>
    </div>
  );
}

// Block Types
function ParagraphBlock({ content, onChange, isSelected, onSelect, onSlashCommand, blockId, onDelete }: any) {
  const ref = useRef<HTMLParagraphElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    const text = e.currentTarget.textContent || '';
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const cursorPos = range?.startOffset || 0;
    const textBeforeCursor = text.slice(0, cursorPos);
    
    // Delete block on Backspace/Delete when empty
    if ((e.key === 'Backspace' || e.key === 'Delete') && !text.trim() && onDelete) {
      e.preventDefault();
      onDelete();
      return;
    }
    
    // Check for slash command
    if (e.key === '/' && (text === '' || textBeforeCursor.trim() === '')) {
      e.preventDefault();
      onSlashCommand?.(blockId, '');
    } else if (textBeforeCursor.startsWith('/') && onSlashCommand) {
      const query = textBeforeCursor.slice(1).trim();
      onSlashCommand?.(blockId, query);
    } else if (e.key === 'Escape' && onSlashCommand) {
      // Cancel slash command
      onSlashCommand?.(blockId, null);
    }
    
    if (e.key === 'Enter' && !e.shiftKey && !textBeforeCursor.startsWith('/')) {
      e.preventDefault();
      // Insert new paragraph block would go here
    }
  };

  return (
    <p
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        const text = e.currentTarget.textContent || '';
        onChange(text);
        // Check for slash command
        if (text.startsWith('/')) {
          const cursorPos = window.getSelection()?.getRangeAt(0).startOffset || text.length;
          const query = text.slice(1, cursorPos).trim();
          onSlashCommand?.(blockId, query);
        } else {
          onSlashCommand?.(blockId, null);
        }
      }}
      onBlur={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "min-h-[1.5em] outline-none",
        !content && "text-gray-400"
      )}
      data-placeholder="Type / to choose a block"
    >
      {content}
    </p>
  );
}

function HeadingBlock({ content, level, onChange, onLevelChange, isSelected, onSelect, onDelete }: any) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const ref = useRef<HTMLHeadingElement>(null);

  return (
    <div>
      <Tag
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e: React.FormEvent<HTMLHeadingElement>) => onChange(e.currentTarget.textContent || '')}
        onBlur={onSelect}
        onKeyDown={(e: React.KeyboardEvent<HTMLHeadingElement>) => {
          // Delete block on Backspace/Delete when empty
          if ((e.key === 'Backspace' || e.key === 'Delete') && !content.trim() && onDelete) {
            e.preventDefault();
            onDelete();
          }
        }}
        className={cn(
          "min-h-[1.5em] outline-none font-bold",
          level === 1 && "text-4xl",
          level === 2 && "text-3xl",
          level === 3 && "text-2xl",
          level === 4 && "text-xl",
          level === 5 && "text-lg",
          level === 6 && "text-base",
          !content && "text-gray-400"
        )}
      >
        {content}
      </Tag>
      {isSelected && (
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5, 6].map(l => (
            <Button
              key={l}
              size="sm"
              variant={level === l ? "default" : "outline"}
              onClick={() => onLevelChange(l)}
              className="h-7"
            >
              H{l}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageBlock({ 
  url, 
  alt, 
  title, 
  caption, 
  align = 'center',
  width,
  size = 'medium',
  rounded = true,
  linkUrl,
  linkTarget = '_self',
  showCaption = true,
  onUpdate, 
  isSelected, 
  onSelect, 
  onInsertImage 
}: any) {
  if (!url) {
    return (
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-teal-500 transition-colors"
        onClick={onInsertImage}
      >
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Click to insert image</p>
      </div>
    );
  }

  // Calculate image width based on size preset
  const getImageWidth = () => {
    if (size === 'custom' && width) {
      return typeof width === 'number' ? `${width}px` : width;
    }
    switch (size) {
      case 'small': return '200px';
      case 'medium': return '400px';
      case 'large': return '600px';
      case 'full': return '100%';
      default: return '400px';
    }
  };

  const imageWidth = getImageWidth();
  const alignMap: Record<string, string> = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
    full: 'w-full'
  };
  const imageAlignClass = alignMap[align] || 'mx-auto';

  const imageClasses = cn(
    "h-auto transition-all",
    rounded && "rounded",
    align === 'full' ? 'w-full' : '',
    !align || align !== 'full' ? imageAlignClass : ''
  );

  const imageStyle: React.CSSProperties = {
    width: align === 'full' ? '100%' : imageWidth,
    maxWidth: align === 'full' ? '100%' : '100%',
  };

  const ImageContent = (
    <img 
      src={url} 
      alt={alt || ''} 
      title={title || ''} 
      className={imageClasses}
      style={imageStyle}
    />
  );

  return (
    <figure className={cn("block-image my-4", align && `align-${align}`)}>
      {linkUrl ? (
        <a 
          href={linkUrl} 
          target={linkTarget}
          rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
          className="block"
        >
          {ImageContent}
        </a>
      ) : (
        ImageContent
      )}
      {showCaption && caption && (
        <figcaption className={cn(
          "text-sm text-gray-600 mt-2 italic",
          align === 'center' || align === 'full' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
        )}>
          {caption}
        </figcaption>
      )}
      {isSelected && (
        <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Alignment Controls */}
          <div>
            <Label className="text-xs font-medium mb-2 block">Alignment</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={align === 'left' ? 'default' : 'outline'}
                onClick={() => onUpdate({ align: 'left' })}
                className="h-8"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={align === 'center' ? 'default' : 'outline'}
                onClick={() => onUpdate({ align: 'center' })}
                className="h-8"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={align === 'right' ? 'default' : 'outline'}
                onClick={() => onUpdate({ align: 'right' })}
                className="h-8"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={align === 'full' ? 'default' : 'outline'}
                onClick={() => onUpdate({ align: 'full' })}
                className="h-8"
                title="Full Width"
              >
                <span className="text-xs">Full</span>
              </Button>
            </div>
          </div>

          {/* Size Controls */}
          <div>
            <Label className="text-xs font-medium mb-2 block">Size</Label>
            <div className="flex gap-2 flex-wrap">
              {(['small', 'medium', 'large', 'full', 'custom'] as const).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={size === s ? 'default' : 'outline'}
                  onClick={() => {
                    if (s === 'custom') {
                      onUpdate({ size: 'custom', width: width || 400 });
                    } else {
                      onUpdate({ size: s, width: undefined });
                    }
                  }}
                  className="h-8 text-xs capitalize"
                >
                  {s}
                </Button>
              ))}
            </div>
            {size === 'custom' && (
              <div className="mt-2">
                <Input
                  type="number"
                  placeholder="Width (px)"
                  value={typeof width === 'number' ? width : parseInt(width?.toString() || '400')}
                  onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 400 })}
                  className="text-sm"
                  min={50}
                  max={2000}
                />
              </div>
            )}
          </div>

          {/* Style Options */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rounded-toggle"
                checked={rounded}
                onChange={(e) => onUpdate({ rounded: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="rounded-toggle" className="text-xs cursor-pointer">
                Rounded Corners
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-caption-toggle"
                checked={showCaption}
                onChange={(e) => onUpdate({ showCaption: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="show-caption-toggle" className="text-xs cursor-pointer">
                Show Caption
              </Label>
            </div>
          </div>

          {/* Link Settings */}
          <div>
            <Label className="text-xs font-medium mb-2 block">Link (Optional)</Label>
            <Input
              placeholder="https://example.com"
              value={linkUrl || ''}
              onChange={(e) => onUpdate({ linkUrl: e.target.value || undefined })}
              className="text-sm mb-2"
            />
            {linkUrl && (
              <div className="flex items-center gap-2">
                <Label className="text-xs">Open in:</Label>
                <Button
                  size="sm"
                  variant={linkTarget === '_self' ? 'default' : 'outline'}
                  onClick={() => onUpdate({ linkTarget: '_self' })}
                  className="h-7 text-xs"
                >
                  Same Tab
                </Button>
                <Button
                  size="sm"
                  variant={linkTarget === '_blank' ? 'default' : 'outline'}
                  onClick={() => onUpdate({ linkTarget: '_blank' })}
                  className="h-7 text-xs"
                >
                  New Tab
                </Button>
              </div>
            )}
          </div>

          {/* Metadata Fields */}
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div>
              <Label className="text-xs">Alt Text</Label>
              <Input
                placeholder="Alt text"
                value={alt || ''}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                placeholder="Title"
                value={title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="text-sm"
              />
            </div>
            {showCaption && (
              <div>
                <Label className="text-xs">Caption</Label>
                <Textarea
                  placeholder="Caption"
                  value={caption || ''}
                  onChange={(e) => onUpdate({ caption: e.target.value })}
                  rows={2}
                  className="text-sm"
                />
              </div>
            )}
          </div>

          <Button size="sm" variant="outline" onClick={onInsertImage} className="w-full">
            Change Image
          </Button>
        </div>
      )}
    </figure>
  );
}

function ListBlock({ items, ordered, onChange, onToggleOrdered, isSelected, onSelect }: any) {
  const addItem = () => {
    onChange([...items, '']);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_: any, i: number) => i !== index));
  };

  if (items.length === 0) {
    onChange(['']);
  }

  const Tag = ordered ? 'ol' : 'ul';

  return (
    <div>
      {isSelected && (
        <div className="mb-2">
          <Button size="sm" variant={ordered ? "default" : "outline"} onClick={onToggleOrdered} className="h-7">
            {ordered ? 'Ordered List' : 'Unordered List'}
          </Button>
        </div>
      )}
      <Tag className={cn("list-inside", ordered ? "list-decimal" : "list-disc")}>
        {items.map((item: string, index: number) => (
          <li key={index} className="flex items-center gap-2 py-1">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1 outline-none border-none bg-transparent"
              placeholder="List item"
              onFocus={onSelect}
            />
            {isSelected && items.length > 1 && (
              <Button size="sm" variant="ghost" onClick={() => removeItem(index)} className="h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            )}
          </li>
        ))}
      </Tag>
      {isSelected && (
        <Button size="sm" variant="outline" onClick={addItem} className="mt-2 h-7">
          <Plus className="w-3 h-3 mr-2" />
          Add Item
        </Button>
      )}
    </div>
  );
}

function QuoteBlock({ content, onChange, isSelected, onSelect, onDelete }: any) {
  return (
    <blockquote
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onChange(e.currentTarget.textContent || '')}
      onBlur={onSelect}
      onKeyDown={(e) => {
        // Delete block on Backspace/Delete when empty
        if ((e.key === 'Backspace' || e.key === 'Delete') && !content.trim() && onDelete) {
          e.preventDefault();
          onDelete();
        }
      }}
      className={cn(
        "border-l-4 border-gray-300 pl-4 italic min-h-[1.5em] outline-none",
        !content && "text-gray-400"
      )}
    >
      {content}
    </blockquote>
  );
}

function CodeBlock({ content, onChange, isSelected, onSelect, onDelete }: any) {
  return (
    <pre className="bg-gray-100 p-4 rounded border">
      <code
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.textContent || '')}
        onBlur={onSelect}
        onKeyDown={(e) => {
          // Delete block on Backspace/Delete when empty
          if ((e.key === 'Backspace' || e.key === 'Delete') && !content.trim() && onDelete) {
            e.preventDefault();
            onDelete();
          }
        }}
        className="outline-none block min-h-[1.5em] font-mono text-sm"
      >
        {content}
      </code>
    </pre>
  );
}

function SeparatorBlock({ isSelected, onSelect }: any) {
  return (
    <div className="py-4" onClick={onSelect}>
      <hr className="border-gray-300" />
    </div>
  );
}

function GalleryBlock({ images, onChange, isSelected, onSelect, onInsertImage }: any) {
  const addImage = () => {
    onChange([...images, '']);
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_: any, i: number) => i !== index));
  };

  if (images.length === 0) {
    return (
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-teal-500 transition-colors"
        onClick={onInsertImage}
      >
        <Grid3x3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Click to add images to gallery</p>
      </div>
    );
  }

  return (
    <div className="gallery-block">
      <div className="grid grid-cols-3 gap-2">
        {images.map((url: string, index: number) => (
          <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden group">
            {url ? (
              <>
                <img src={url} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                {isSelected && (
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={onInsertImage}
                className="w-full h-full flex items-center justify-center text-gray-400 hover:text-teal-600"
              >
                <Plus className="w-8 h-8" />
              </button>
            )}
          </div>
        ))}
      </div>
      {isSelected && (
        <Button size="sm" variant="outline" onClick={addImage} className="mt-2">
          <Plus className="w-3 h-3 mr-2" />
          Add Image
        </Button>
      )}
    </div>
  );
}

// Block Inserter
function BlockInserter({ 
  onSelect, 
  onClose, 
  searchQuery = '',
  onSearchChange,
  showBrowseAll = false,
}: { 
  onSelect: (type: Block['type']) => void; 
  onClose: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showBrowseAll?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inserterRef = useRef<HTMLDivElement>(null);

  const allBlockTypes: { type: Block['type']; label: string; icon: React.ReactNode; keywords: string[] }[] = [
    { type: 'paragraph', label: 'Paragraph', icon: <Type className="w-5 h-5" />, keywords: ['text', 'p', 'paragraph'] },
    { type: 'heading', label: 'Heading', icon: <Heading1 className="w-5 h-5" />, keywords: ['h1', 'h2', 'h3', 'heading', 'title'] },
    { type: 'image', label: 'Image', icon: <ImageIcon className="w-5 h-5" />, keywords: ['img', 'photo', 'picture'] },
    { type: 'gallery', label: 'Gallery', icon: <Grid3x3 className="w-5 h-5" />, keywords: ['gallery', 'images', 'photos'] },
    { type: 'list', label: 'List', icon: <List className="w-5 h-5" />, keywords: ['ul', 'ol', 'bullet'] },
    { type: 'quote', label: 'Quote', icon: <Quote className="w-5 h-5" />, keywords: ['blockquote', 'citation'] },
    { type: 'code', label: 'Code', icon: <Code className="w-5 h-5" />, keywords: ['pre', 'snippet'] },
    { type: 'separator', label: 'Separator', icon: <Minus className="w-5 h-5" />, keywords: ['hr', 'divider', 'line'] },
  ];

  const filteredBlocks = searchQuery
    ? allBlockTypes.filter(block => 
        block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allBlockTypes.slice(0, 6); // Show first 6 by default

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, filteredBlocks.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredBlocks.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredBlocks[selectedIndex]) {
          onSelect(filteredBlocks[selectedIndex].type);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredBlocks, onSelect, onClose]);

  return (
    <div ref={inserterRef} className="block-inserter my-2">
      <div className="border border-blue-300 rounded-lg bg-white shadow-lg overflow-hidden">
        {/* Search Bar */}
        <div className="border-b border-blue-300 p-2 bg-white">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-8 h-8 text-sm border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>

        {/* Block Grid */}
        <div className="p-2 bg-white">
          <div className="grid grid-cols-3 gap-1">
            {filteredBlocks.map(({ type, label, icon }, index) => (
              <button
                key={type}
                onClick={() => onSelect(type)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded transition-colors text-center group",
                  selectedIndex === index ? "bg-teal-50 border-2 border-teal-500" : "hover:bg-gray-50"
                )}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className={cn(
                  "mb-1 transition-colors",
                  selectedIndex === index ? "text-teal-600" : "text-gray-700 group-hover:text-teal-600"
                )}>{icon}</span>
                <span className="text-xs text-gray-600">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Browse All Button */}
        {showBrowseAll && filteredBlocks.length >= 6 && (
          <div className="border-t border-blue-300 p-2 bg-white">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                // Show all blocks by clearing search
                onSearchChange?.('');
              }}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-md h-8 text-sm font-medium"
            >
              Browse all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Utility functions
function parseHTMLToBlocks(html: string): Block[] {
  if (!html || html.trim() === '') return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: Block[] = [];

  const walk = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      
      if (el.tagName === 'P' && el.textContent?.trim()) {
        blocks.push({
          id: `block-${Date.now()}-${Math.random()}`,
          type: 'paragraph',
          content: el.textContent.trim(),
        });
      } else if (el.tagName.match(/^H[1-6]$/)) {
        const level = parseInt(el.tagName[1]) as 1 | 2 | 3 | 4 | 5 | 6;
        blocks.push({
          id: `block-${Date.now()}-${Math.random()}`,
          type: 'heading',
          content: el.textContent?.trim() || '',
          attributes: { level },
        });
      } else if (el.tagName === 'IMG') {
        blocks.push({
          id: `block-${Date.now()}-${Math.random()}`,
          type: 'image',
          content: '',
          attributes: {
            url: el.getAttribute('src') || '',
            alt: el.getAttribute('alt') || '',
            title: el.getAttribute('title') || '',
          },
        });
      } else if (el.tagName === 'FIGURE') {
        const img = el.querySelector('img');
        const caption = el.querySelector('figcaption');
        if (img) {
          blocks.push({
            id: `block-${Date.now()}-${Math.random()}`,
            type: 'image',
            content: '',
            attributes: {
              url: img.getAttribute('src') || '',
              alt: img.getAttribute('alt') || '',
              title: img.getAttribute('title') || '',
              caption: caption?.textContent || '',
            },
          });
        }
      } else if (el.tagName === 'UL' || el.tagName === 'OL') {
        const items = Array.from(el.querySelectorAll('li')).map(li => li.textContent || '');
        if (items.length > 0) {
          blocks.push({
            id: `block-${Date.now()}-${Math.random()}`,
            type: 'list',
            content: '',
            attributes: {
              ordered: el.tagName === 'OL',
              items,
            },
          });
        }
      } else if (el.tagName === 'BLOCKQUOTE') {
        blocks.push({
          id: `block-${Date.now()}-${Math.random()}`,
          type: 'quote',
          content: el.textContent?.trim() || '',
        });
      } else if (el.tagName === 'PRE') {
        const code = el.querySelector('code');
        blocks.push({
          id: `block-${Date.now()}-${Math.random()}`,
          type: 'code',
          content: code?.textContent?.trim() || el.textContent?.trim() || '',
        });
      } else if (el.tagName === 'HR') {
        blocks.push({
          id: `block-${Date.now()}-${Math.random()}`,
          type: 'separator',
          content: '',
        });
      } else {
        Array.from(el.childNodes).forEach(walk);
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      blocks.push({
        id: `block-${Date.now()}-${Math.random()}`,
        type: 'paragraph',
        content: node.textContent.trim(),
      });
    }
  };

  Array.from(doc.body.childNodes).forEach(walk);
  return blocks.length > 0 ? blocks : [];
}

function serializeBlocksToHTML(blocks: Block[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return `<p>${escapeHTML(block.content)}</p>`;
      case 'heading':
        const level = block.attributes?.level || 2;
        return `<h${level}>${escapeHTML(block.content)}</h${level}>`;
      case 'image':
        const img = block.attributes;
        if (!img?.url) return '';
        return `<figure><img src="${escapeHTML(img.url)}" alt="${escapeHTML(img?.alt || '')}" title="${escapeHTML(img?.title || '')}" />${img?.caption ? `<figcaption>${escapeHTML(img.caption)}</figcaption>` : ''}</figure>`;
      case 'list':
        const items = block.attributes?.items || [];
        const tag = block.attributes?.ordered ? 'ol' : 'ul';
        return `<${tag}>${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</${tag}>`;
      case 'quote':
        return `<blockquote>${escapeHTML(block.content)}</blockquote>`;
      case 'code':
        return `<pre><code>${escapeHTML(block.content)}</code></pre>`;
      case 'separator':
        return '<hr />';
      default:
        return '';
    }
  }).join('');
}

function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
