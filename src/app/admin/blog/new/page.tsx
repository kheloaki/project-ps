"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlogCoverUploader, type BlogImageMetadata } from '@/components/upload/blog-cover-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockEditor } from '@/components/admin/block-editor';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FAQ {
  question: string;
  answer: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [contentMode, setContentMode] = useState<'rich' | 'html'>('rich');
  const [publishedDate, setPublishedDate] = useState<Date | undefined>(undefined);
  const [faqs, setFaqs] = useState<FAQ[]>([{ question: '', answer: '' }]);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    slug: '',
    category: '',
    content: '',
    htmlContent: '',
    image: '',
    alt: '',
    imageCaption: '',
    seoFilename: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    canonicalUrl: '',
    keywords: '',
  });

  const [imageMetadata, setImageMetadata] = useState<BlogImageMetadata | null>(null);

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories (you'll need to create this endpoint)
        const catResponse = await fetch('/api/admin/blog/categories');
        if (catResponse.ok) {
          const catData = await catResponse.json();
          setCategories(catData.categories || []);
        }
        
        // Fetch tags (you'll need to create this endpoint)
        const tagsResponse = await fetch('/api/admin/blog/tags');
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setTags(tagsData.tags || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Support comma-separated tags
    const tagsToAdd = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && !selectedTags.includes(tag));
    
    if (tagsToAdd.length > 0) {
      setSelectedTags([...selectedTags, ...tagsToAdd]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleAddFAQ = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use image metadata if available, otherwise fall back to formData
      const imageUrl = imageMetadata?.url || formData.image;
      const altText = imageMetadata?.alt || formData.alt;
      const imageCaption = imageMetadata?.caption || formData.imageCaption;
      const seoFilename = imageMetadata?.seoFilename || formData.seoFilename;

      const payload = {
        ...formData,
        image: imageUrl,
        alt: altText,
        imageCaption: imageCaption,
        seoFilename: seoFilename,
        content: contentMode === 'rich' ? formData.content : formData.htmlContent,
        tags: selectedTags,
        publishedDate: publishedDate?.toISOString() || null,
        date: publishedDate || new Date(),
        faqs: faqs.filter(faq => faq.question.trim() && faq.answer.trim()),
      };

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create blog post');
      }

      toast.success('Blog post created successfully!');
      router.push('/admin/blog');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create blog post');
      console.error('Error creating blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog Posts
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Blog Post</h1>
        <p className="text-gray-600">Write and publish a new blog post</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Section Header */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">New Blog Post</h2>
            <p className="text-sm text-gray-600">Fill in the details and use the rich editor or paste HTML for content.</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Post title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">
                    Excerpt <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Short summary"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="slug">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    placeholder="url-slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Enter tags (comma-separated) e.g. peptides, research, BPC-157"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">You can add multiple tags at once by separating them with commas</p>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">
                Content <span className="text-red-500">*</span>
              </h3>
              <Tabs 
                value={contentMode} 
                onValueChange={(v) => {
                  const newMode = v as 'rich' | 'html';
                  // Sync content when switching modes
                  if (newMode === 'rich' && formData.htmlContent && !formData.content) {
                    handleInputChange('content', formData.htmlContent);
                  } else if (newMode === 'html' && formData.content && !formData.htmlContent) {
                    handleInputChange('htmlContent', formData.content);
                  }
                  setContentMode(newMode);
                }}
              >
                <TabsList>
                  <TabsTrigger value="rich">Block Editor</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>
                <TabsContent value="rich" className="mt-4">
                  <BlockEditor
                    value={formData.content || formData.htmlContent}
                    onChange={(html) => {
                      handleInputChange('content', html);
                      // Also update htmlContent for sync
                      if (contentMode === 'rich') {
                        handleInputChange('htmlContent', html);
                      }
                    }}
                    placeholder="Type / to add a block"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Use the image button to add images inside the article.</p>
                </TabsContent>
                <TabsContent value="html" className="mt-4">
                  <Textarea
                    placeholder="Paste your HTML content here"
                    value={formData.htmlContent || formData.content}
                    onChange={(e) => {
                      handleInputChange('htmlContent', e.target.value);
                      // Also update content for sync
                      if (contentMode === 'html') {
                        handleInputChange('content', e.target.value);
                      }
                    }}
                    rows={12}
                    className="font-mono text-sm"
                    required={contentMode === 'html'}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Cover Image Section */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">
                Cover image <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">Feature image displayed at the top of the blog post. Upload image and add metadata.</p>
              
              <BlogCoverUploader
                onMetadataChange={(metadata) => {
                  // Only update if metadata actually changed to prevent loops
                  if (!imageMetadata || 
                      imageMetadata.url !== metadata.url ||
                      imageMetadata.alt !== metadata.alt ||
                      imageMetadata.caption !== metadata.caption ||
                      imageMetadata.seoFilename !== metadata.seoFilename) {
                    setImageMetadata(metadata);
                    handleInputChange('image', metadata.url);
                    handleInputChange('alt', metadata.alt || '');
                    handleInputChange('imageCaption', metadata.caption || '');
                    handleInputChange('seoFilename', metadata.seoFilename || '');
                  }
                }}
                currentMetadata={imageMetadata || (formData.image ? {
                  url: formData.image,
                  alt: formData.alt,
                  caption: formData.imageCaption,
                  seoFilename: formData.seoFilename,
                } : undefined)}
              />
            </div>

            {/* Published Date */}
            <div>
              <Label htmlFor="publishedDate">Published date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !publishedDate && "text-muted-foreground"
                    )}
                  >
                    {publishedDate ? format(publishedDate, "PPP") : <span>mm/dd/yyyy</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={publishedDate}
                    onSelect={setPublishedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500 mt-1">Leave empty for drafts</p>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SEO Section */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-1">SEO</h3>
                <p className="text-sm text-gray-600">Meta tags and Open Graph. Important for search and sharing.</p>
              </div>

              <div>
                <Label htmlFor="metaTitle">Meta title</Label>
                <Input
                  id="metaTitle"
                  placeholder="e.g. My Post | Blog"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Recommended ≤ 70 chars</p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Short description for search results"
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Recommended ≤ 160 chars</p>
              </div>

              <div>
                <Label htmlFor="ogImage">Open Graph image URL</Label>
                <Input
                  id="ogImage"
                  placeholder="https://..."
                  value={formData.ogImage}
                  onChange={(e) => handleInputChange('ogImage', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Image for social sharing</p>
              </div>

              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  placeholder="https://yoursite.com/blog/post-slug"
                  value={formData.canonicalUrl}
                  onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Preferred URL for this post</p>
              </div>

              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="e.g. peptides, research, synthesis, biochemistry"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated keywords for SEO (optional)</p>
              </div>
            </div>

            {/* FAQs Section */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-1">FAQs</h3>
                <p className="text-sm text-gray-600">Frequently asked questions for this blog post. These will be displayed at the bottom of the article.</p>
              </div>

              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>FAQ {index + 1}</Label>
                    {faqs.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFAQ(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                  />
                  <Textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                    rows={3}
                  />
                </div>
              ))}

              <Button type="button" variant="outline" onClick={handleAddFAQ}>
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/blog">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
            {loading ? 'Creating...' : 'Create post'}
          </Button>
        </div>
      </form>
    </div>
  );
}

