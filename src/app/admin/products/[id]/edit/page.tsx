"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon, Tag, FileText, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/upload/image-uploader';

interface Variant {
  id: string;
  title: string;
  price: string;
  sku?: string;
  image?: string;
}

interface ImageMetadata {
  url: string;
  title?: string;
  alt?: string;
  caption?: string;
  description?: string;
}

type Tab = 'basic' | 'images' | 'variations' | 'tags' | 'sections' | 'coa' | 'faqs';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', title: 'Default Title', price: '' }
  ]);
  const [uploadedImages, setUploadedImages] = useState<ImageMetadata[]>([]);
  const [tags, setTags] = useState<string[]>(['']);
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([{ question: '', answer: '' }]);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');
  const [bulkImportMethod, setBulkImportMethod] = useState<'json' | 'text'>('text');
  
  // Sections data
  const [characteristics, setCharacteristics] = useState<Array<{ label: string; value: string }>>([
    { label: '', value: '' }
  ]);
  const [researchUsage, setResearchUsage] = useState('');
  const [areasOfStudy, setAreasOfStudy] = useState<Array<{ title: string; text: string }>>([
    { title: '', text: '' }
  ]);
  const [summary, setSummary] = useState('');
  const [references, setReferences] = useState<Array<{ text: string; link: string }>>([
    { text: '', link: '' }
  ]);
  
  // Section visibility state
  const [sections, setSections] = useState({
    productHero: true,
    productDetails: true,
    coaResource: true,
    companyTrustBadges: true,
  });
  
  // Custom section state
  const [customSection, setCustomSection] = useState({
    enabled: false,
    title: '',
    content: '',
  });

  const [formData, setFormData] = useState({
    handle: '',
    title: '',
    price: '',
    compareAtPrice: '',
    currency: 'USD',
    stock: '0',
    image: '',
    description: '',
    bodyHtml: '',
    seoTitle: '',
    seoDescription: '',
    category: '',
    coaImageUrl: '',
    isPopular: false,
  });

  // Parse bodyHtml to extract sections
  const parseBodyHtmlToSections = (html: string) => {
    if (!html) return;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract characteristics
    const charTable = doc.querySelector('h2')?.textContent?.includes('Characteristics') 
      ? doc.querySelector('table')
      : null;
    if (charTable) {
      const rows = charTable.querySelectorAll('tr');
      const chars: Array<{ label: string; value: string }> = [];
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const label = cells[0].textContent?.trim() || '';
          const value = cells[1].textContent?.trim() || '';
          if (label && value) {
            chars.push({ label, value });
          }
        }
      });
      if (chars.length > 0) {
        setCharacteristics(chars);
      }
    }

    // Extract research usage
    const researchHeading = Array.from(doc.querySelectorAll('h2')).find(h2 => 
      h2.textContent?.toLowerCase().includes('used in research')
    );
    if (researchHeading) {
      const nextP = researchHeading.nextElementSibling;
      if (nextP && nextP.tagName === 'P') {
        setResearchUsage(nextP.textContent?.trim() || '');
      }
    }

    // Extract areas of study
    const areasHeading = Array.from(doc.querySelectorAll('h2')).find(h2 => 
      h2.textContent?.toLowerCase().includes('areas of study')
    );
    if (areasHeading) {
      const nextUl = areasHeading.nextElementSibling;
      if (nextUl && nextUl.tagName === 'UL') {
        const items = nextUl.querySelectorAll('li');
        const areas: Array<{ title: string; text: string }> = [];
        items.forEach(item => {
          const text = item.textContent?.trim() || '';
          const strong = item.querySelector('strong');
          const title = strong?.textContent?.trim() || '';
          const itemText = text.replace(title, '').trim();
          if (itemText) {
            areas.push({ title, text: itemText });
          }
        });
        if (areas.length > 0) {
          setAreasOfStudy(areas);
        }
      }
    }

    // Extract summary
    const summaryHeading = Array.from(doc.querySelectorAll('h2')).find(h2 => 
      h2.textContent?.toLowerCase().includes('summary')
    );
    if (summaryHeading) {
      const nextP = summaryHeading.nextElementSibling;
      if (nextP && nextP.tagName === 'P') {
        setSummary(nextP.textContent?.trim() || '');
      }
    }

    // Extract references
    const refHeading = Array.from(doc.querySelectorAll('h2')).find(h2 => 
      h2.textContent?.toLowerCase().includes('references')
    );
    if (refHeading) {
      const nextOl = refHeading.nextElementSibling;
      if (nextOl && nextOl.tagName === 'OL') {
        const items = nextOl.querySelectorAll('li');
        const refs: Array<{ text: string; link: string }> = [];
        items.forEach(item => {
          const link = item.querySelector('a');
          const text = link?.textContent?.trim() || item.textContent?.trim() || '';
          const href = link?.getAttribute('href') || '#';
          if (text) {
            refs.push({ text, link: href });
          }
        });
        if (refs.length > 0) {
          setReferences(refs);
        }
      }
    }
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const product = await response.json();
        
        // Populate form data
        setFormData({
          handle: product.handle || '',
          title: product.title || '',
          price: product.price || '',
          compareAtPrice: '',
          currency: 'USD',
          stock: '0',
          image: product.image || '',
          description: product.description || '',
          bodyHtml: product.bodyHtml || '',
          seoTitle: product.seoTitle || '',
          seoDescription: product.seoDescription || '',
          category: product.category || '',
          coaImageUrl: product.coaImageUrl || '',
          isPopular: product.isPopular || false,
        });

        // Set variants
        if (product.variants && product.variants.length > 0) {
          setVariants(product.variants.map((v: any) => ({
            id: v.id,
            title: v.title,
            price: v.price,
            sku: v.sku || '',
            image: v.image || '',
          })));
        }

        // Set FAQs
        if (product.faqs && Array.isArray(product.faqs) && product.faqs.length > 0) {
          setFaqs(product.faqs);
        } else {
          setFaqs([{ question: '', answer: '' }]);
        }

        // Parse bodyHtml to extract sections
        if (product.bodyHtml) {
          parseBodyHtmlToSections(product.bodyHtml);
        }

        // Set images - load from imageMetadata if available, otherwise from images array
        let productImageMetadata: ImageMetadata[] = [];
        
        if ((product as any).imageMetadata && Array.isArray((product as any).imageMetadata) && (product as any).imageMetadata.length > 0) {
          // Use saved image metadata
          productImageMetadata = (product as any).imageMetadata.map((img: any) => ({
            url: img.url || '',
            title: img.title || '',
            alt: img.alt || '',
            caption: img.caption || '',
            description: img.description || '',
          }));
        } else {
          // Fallback to images array or main image
          const productImages = (product as any).images && Array.isArray((product as any).images) && (product as any).images.length > 0
            ? (product as any).images
            : product.image ? [product.image] : [];
          
          productImageMetadata = productImages.map((imgUrl: string) => ({
            url: imgUrl,
            title: '',
            alt: '',
            caption: '',
            description: '',
          }));
        }
        
        setUploadedImages(productImageMetadata);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load product');
        router.push('/admin/products');
      } finally {
        setLoadingProduct(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), title: '', price: '' }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (url: string) => {
    const newImage: ImageMetadata = {
      url,
      title: '',
      alt: '',
      caption: '',
      description: '',
    };
    setUploadedImages([...uploadedImages, newImage]);
    if (uploadedImages.length === 0) {
      setFormData(prev => ({ ...prev, image: url }));
    }
  };

  const removeImage = (index: number) => {
    const updated = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updated);
    if (index === 0 && updated.length > 0) {
      setFormData(prev => ({ ...prev, image: updated[0].url }));
    } else if (updated.length === 0) {
      setFormData(prev => ({ ...prev, image: '' }));
    }
  };

  const updateImageMetadata = (index: number, field: keyof ImageMetadata, value: string) => {
    const updated = [...uploadedImages];
    updated[index] = { ...updated[index], [field]: value };
    setUploadedImages(updated);
  };

  const addCharacteristic = () => {
    setCharacteristics([...characteristics, { label: '', value: '' }]);
  };

  const removeCharacteristic = (index: number) => {
    if (characteristics.length > 1) {
      setCharacteristics(characteristics.filter((_, i) => i !== index));
    }
  };

  const handleCharacteristicChange = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...characteristics];
    updated[index] = { ...updated[index], [field]: value };
    setCharacteristics(updated);
  };

  const addAreaOfStudy = () => {
    setAreasOfStudy([...areasOfStudy, { title: '', text: '' }]);
  };

  const removeAreaOfStudy = (index: number) => {
    if (areasOfStudy.length > 1) {
      setAreasOfStudy(areasOfStudy.filter((_, i) => i !== index));
    }
  };

  const handleAreaOfStudyChange = (index: number, field: 'title' | 'text', value: string) => {
    const updated = [...areasOfStudy];
    updated[index] = { ...updated[index], [field]: value };
    setAreasOfStudy(updated);
  };

  const addReference = () => {
    setReferences([...references, { text: '', link: '' }]);
  };

  const removeReference = (index: number) => {
    if (references.length > 1) {
      setReferences(references.filter((_, i) => i !== index));
    }
  };

  const handleReferenceChange = (index: number, field: 'text' | 'link', value: string) => {
    const updated = [...references];
    updated[index] = { ...updated[index], [field]: value };
    setReferences(updated);
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    if (faqs.length > 1) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleBulkImport = () => {
    if (!bulkImportText.trim()) {
      toast.error('Please enter FAQs to import');
      return;
    }

    try {
      let importedFaqs: Array<{ question: string; answer: string }> = [];

      if (bulkImportMethod === 'json') {
        // Method 1: JSON format
        const parsed = JSON.parse(bulkImportText);
        if (Array.isArray(parsed)) {
          importedFaqs = parsed.map((item: any) => ({
            question: item.question || item.q || '',
            answer: item.answer || item.a || '',
          })).filter((faq: any) => faq.question && faq.answer);
        } else {
          throw new Error('JSON must be an array');
        }
      } else {
        // Method 2: Simple text format (Q: question, A: answer)
        const lines = bulkImportText.split('\n').filter(line => line.trim());
        let currentQuestion = '';
        let currentAnswer = '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.match(/^Q[:\-]?\s*/i)) {
            // Save previous FAQ if exists
            if (currentQuestion && currentAnswer) {
              importedFaqs.push({ question: currentQuestion, answer: currentAnswer });
            }
            currentQuestion = trimmed.replace(/^Q[:\-]?\s*/i, '').trim();
            currentAnswer = '';
          } else if (trimmed.match(/^A[:\-]?\s*/i)) {
            currentAnswer = trimmed.replace(/^A[:\-]?\s*/i, '').trim();
          } else if (currentQuestion && !currentAnswer) {
            // If we have a question but no answer yet, this line is part of the question
            currentQuestion += (currentQuestion ? ' ' : '') + trimmed;
          } else if (currentAnswer !== undefined) {
            // If we have an answer, this line is part of the answer
            currentAnswer += (currentAnswer ? ' ' : '') + trimmed;
          }
        }

        // Add the last FAQ
        if (currentQuestion && currentAnswer) {
          importedFaqs.push({ question: currentQuestion, answer: currentAnswer });
        }
      }

      if (importedFaqs.length === 0) {
        toast.error('No valid FAQs found. Please check your format.');
        return;
      }

      // Replace existing FAQs or append based on user preference
      setFaqs(importedFaqs);
      setBulkImportText('');
      setShowBulkImport(false);
      toast.success(`Successfully imported ${importedFaqs.length} FAQ(s)`);
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
      console.error('Bulk import error:', error);
    }
  };

  const generateHandle = () => {
    const handle = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, handle }));
  };

  const buildBodyHtml = () => {
    let html = formData.bodyHtml || '';
    
    // Add characteristics table if exists
    if (characteristics.some(c => c.label && c.value)) {
      html += '<h2>Characteristics</h2><table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;"><tbody>';
      characteristics.forEach(char => {
        if (char.label && char.value) {
          html += `<tr><td><strong>${char.label}</strong></td><td>${char.value}</td></tr>`;
        }
      });
      html += '</tbody></table>';
    }
    
    // Add research usage
    if (researchUsage) {
      html += `<h2>How is ${formData.title || 'this product'} Used in Research?</h2><p>${researchUsage}</p>`;
    }
    
    // Add areas of study
    if (areasOfStudy.some(a => a.text)) {
      html += '<h2>Areas of Study</h2><ul>';
      areasOfStudy.forEach(area => {
        if (area.text) {
          html += `<li>${area.title ? `<strong>${area.title}</strong> ` : ''}${area.text}</li>`;
        }
      });
      html += '</ul>';
    }
    
    // Add summary
    if (summary) {
      html += `<h2>Summary</h2><p>${summary}</p>`;
    }
    
    // Add references
    if (references.some(r => r.text)) {
      html += '<h2>References</h2><ol>';
      references.forEach(ref => {
        if (ref.text) {
          html += `<li>${ref.link ? `<a href="${ref.link}">${ref.text}</a>` : ref.text}</li>`;
        }
      });
      html += '</ol>';
    }
    
    return html;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bodyHtml = buildBodyHtml();
      
      // Ensure main image is set from uploaded images if not already set
      const mainImage = formData.image || (uploadedImages.length > 0 ? uploadedImages[0].url : '');
      const imageArray = uploadedImages.length > 0 
        ? uploadedImages.map(img => img.url)
        : (formData.image ? [formData.image] : []);
      
      // Prepare the request body
      const requestBody = {
        ...formData,
        image: mainImage, // Ensure main image is set
        bodyHtml: bodyHtml || formData.bodyHtml || null,
        images: imageArray, // Send array of image URLs
        imageMetadata: uploadedImages, // Send full image metadata objects
        isPopular: formData.isPopular || false,
        seoTitle: formData.seoTitle || null,
        seoDescription: formData.seoDescription || null,
        coaImageUrl: formData.coaImageUrl || null,
        faqs: faqs.filter(faq => faq.question.trim() && faq.answer.trim()), // Only send FAQs with both question and answer
        variants: variants.map(v => ({
          title: v.title,
          price: v.price,
          sku: v.sku || undefined,
          image: v.image || undefined,
        })),
        sections: {
          productHero: sections.productHero,
          productDetails: sections.productDetails,
          coaResource: sections.coaResource,
          companyTrustBadges: sections.companyTrustBadges,
          customSection: customSection.enabled ? {
            enabled: true,
            title: customSection.title || undefined,
            content: customSection.content || undefined,
          } : undefined,
        },
      };
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error || 'Failed to update product';
        const errorDetails = error.details ? `\nMissing: ${Object.entries(error.details).filter(([_, missing]) => missing).map(([field]) => field).join(', ')}` : '';
        throw new Error(errorMessage + errorDetails);
      }

      const product = await response.json();
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic' as Tab, label: 'Basic', icon: FileText },
    { id: 'images' as Tab, label: 'Images', icon: ImageIcon },
    { id: 'variations' as Tab, label: 'Variations', icon: Tag },
    { id: 'tags' as Tab, label: 'Tags', icon: Tag },
    { id: 'sections' as Tab, label: 'Sections', icon: FileText },
    { id: 'coa' as Tab, label: 'COA', icon: FileText },
    { id: 'faqs' as Tab, label: 'FAQs', icon: HelpCircle },
  ];

  if (loadingProduct) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading product...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Section Header */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Edit Product</h2>
            <p className="text-sm text-gray-600">Update product details and descriptions.</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Basic Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      onBlur={generateHandle}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Product name"
                    />
                  </div>

                  <div>
                    <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      id="handle"
                      name="handle"
                      required
                      value={formData.handle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="product-slug"
                    />
                    <p className="mt-1 text-xs text-gray-500">URL-friendly. Lowercase, hyphens only.</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description (cards/listings) *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Brief summary for product cards and listings"
                  />
                  <p className="mt-1 text-xs text-gray-500">HTML supported: headings, lists, bold, italic, tables, etc.</p>
                </div>

                <div>
                  <label htmlFor="bodyHtml" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <Textarea
                    id="bodyHtml"
                    name="bodyHtml"
                    rows={8}
                    value={formData.bodyHtml}
                    onChange={handleInputChange}
                    className="w-full font-mono text-sm"
                    placeholder="Main product description with full details"
                  />
                  <p className="mt-1 text-xs text-gray-500">Full HTML support: h1, h2, h3, paragraphs, lists, tables, bold, italic, quotes, etc.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="e.g., $53.99 USD"
                    />
                  </div>

                  <div>
                    <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Compare at Price
                    </label>
                    <input
                      type="text"
                      id="compareAtPrice"
                      name="compareAtPrice"
                      value={formData.compareAtPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    id="isPopular"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="isPopular" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Show in Popular Products Section
                  </label>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">When enabled, this product will appear in the Popular Peptides section on the homepage</span>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  {!showCustomCategory ? (
                    <div className="space-y-2">
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        disabled={loadingCategories}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
                      >
                        {loadingCategories ? (
                          <option>Loading categories...</option>
                        ) : categories.length > 0 ? (
                          <>
                            <option value="">None</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </>
                        ) : (
                          <option value="">No categories found</option>
                        )}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomCategory(true);
                          setFormData(prev => ({ ...prev, category: '' }));
                        }}
                        className="text-sm text-teal-600 hover:text-teal-700 underline"
                      >
                        Or enter a custom category
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Business & Industrial > Science & Laboratory > Biochemicals"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomCategory(false);
                          if (categories.length > 0) {
                            setFormData(prev => ({ ...prev, category: categories[0] }));
                          }
                        }}
                        className="text-sm text-gray-600 hover:text-gray-700 underline"
                      >
                        Select from existing categories
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <label htmlFor="active" className="block text-sm font-medium text-gray-700 mb-1">
                      Active
                    </label>
                    <p className="text-xs text-gray-500">Visible to customers</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isActive ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Main Product Image {uploadedImages.length === 0 && '*'}
                  </h3>
                  {uploadedImages.length === 0 ? (
                    <ImageUploader
                      onUploadComplete={(url) => {
                        handleImageUpload(url);
                      }}
                      folder="products"
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={uploadedImages[0].url}
                          alt={uploadedImages[0].alt || "Main product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-gray-500 break-all">{uploadedImages[0].url}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">All Images</h3>
                  <div className="space-y-6">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="relative w-32 h-32 border border-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={image.url}
                              alt={image.alt || `Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-3">
                            {index === 0 && (
                              <span className="inline-block px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded mb-2">
                                Main Image
                              </span>
                            )}
                            <p className="text-xs text-gray-500 break-all">{image.url}</p>
                            
                            {/* Image Metadata Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={image.title || ''}
                                  onChange={(e) => updateImageMetadata(index, 'title', e.target.value)}
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                                  placeholder="Image title"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Alt Text *
                                </label>
                                <input
                                  type="text"
                                  value={image.alt || ''}
                                  onChange={(e) => updateImageMetadata(index, 'alt', e.target.value)}
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                                  placeholder="Alternative text for accessibility"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Caption
                              </label>
                              <Textarea
                                value={image.caption || ''}
                                onChange={(e) => updateImageMetadata(index, 'caption', e.target.value)}
                                rows={2}
                                className="w-full text-sm"
                                placeholder="Image caption (HTML supported)"
                              />
                              <p className="mt-1 text-xs text-gray-500">HTML supported.</p>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <Textarea
                                value={image.description || ''}
                                onChange={(e) => updateImageMetadata(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full text-sm"
                                placeholder="Image description (HTML supported)"
                              />
                              <p className="mt-1 text-xs text-gray-500">HTML supported.</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-800 flex-shrink-0"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <ImageUploader
                      onUploadComplete={(url) => {
                        handleImageUpload(url);
                      }}
                      folder="products"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Variations Tab */}
            {activeTab === 'variations' && (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Variant {index + 1}</h3>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={variant.title}
                          onChange={(e) => handleVariantChange(index, 'title', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g., 5mg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Price *</label>
                        <input
                          type="text"
                          required
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g., $53.99 USD"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">SKU</label>
                        <input
                          type="text"
                          value={variant.sku || ''}
                          onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                          placeholder="Optional SKU"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Image</label>
                        <select
                          value={variant.image || ''}
                          onChange={(e) => handleVariantChange(index, 'image', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">Select from uploaded images</option>
                          {uploadedImages.map((img, imgIndex) => (
                            <option key={imgIndex} value={img.url}>
                              Image {imgIndex + 1} {imgIndex === 0 && '(Main)'} {img.title && `- ${img.title}`}
                            </option>
                          ))}
                        </select>
                        {variant.image && (
                          <div className="mt-2 relative w-16 h-16 border border-gray-200 rounded overflow-hidden">
                            <img
                              src={variant.image}
                              alt="Variant"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </button>
              </div>
            )}

            {/* Tags Tab */}
            {activeTab === 'tags' && (
              <div className="space-y-4">
                {tags.map((tag, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Enter tag"
                      />
                    </div>
                    {tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Tag
                </button>
              </div>
            )}

            {/* Sections Tab */}
            {activeTab === 'sections' && (
              <div className="space-y-8">
                {/* Characteristics */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Characteristics</h3>
                    <button
                      type="button"
                      onClick={addCharacteristic}
                      className="flex items-center gap-1 px-3 py-1 text-xs text-teal-600 border border-teal-600 rounded hover:bg-teal-50"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {characteristics.map((char, index) => (
                      <div key={index} className="flex gap-2">
                        <Textarea
                          value={char.label}
                          onChange={(e) => handleCharacteristicChange(index, 'label', e.target.value)}
                          rows={1}
                          className="flex-1 text-sm"
                          placeholder="Label (e.g., Molecular Formula)"
                        />
                        <Textarea
                          value={char.value}
                          onChange={(e) => handleCharacteristicChange(index, 'value', e.target.value)}
                          rows={1}
                          className="flex-1 text-sm"
                          placeholder="Value (e.g., C62H98N16O22)"
                        />
                        {characteristics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCharacteristic(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">HTML supported in both label and value fields.</p>
                </div>

                {/* How is it Used in Research */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">How is it Used in Research?</h3>
                  <Textarea
                    value={researchUsage}
                    onChange={(e) => setResearchUsage(e.target.value)}
                    rows={4}
                    className="w-full"
                    placeholder="Describe how this product is used in research..."
                  />
                  <p className="mt-1 text-xs text-gray-500">HTML supported: paragraphs, lists, bold, italic, links, etc.</p>
                </div>

                {/* Areas of Study */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Areas of Study</h3>
                    <button
                      type="button"
                      onClick={addAreaOfStudy}
                      className="flex items-center gap-1 px-3 py-1 text-xs text-teal-600 border border-teal-600 rounded hover:bg-teal-50"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {areasOfStudy.map((area, index) => (
                      <div key={index} className="border border-gray-200 rounded p-3 space-y-2">
                        <Textarea
                          value={area.title}
                          onChange={(e) => handleAreaOfStudyChange(index, 'title', e.target.value)}
                          rows={1}
                          className="w-full text-sm"
                          placeholder="Title (optional)"
                        />
                        <Textarea
                          value={area.text}
                          onChange={(e) => handleAreaOfStudyChange(index, 'text', e.target.value)}
                          rows={3}
                          className="w-full text-sm"
                          placeholder="Description..."
                        />
                        {areasOfStudy.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAreaOfStudy(index)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">HTML supported in both title and description fields.</p>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Summary</h3>
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={4}
                    className="w-full"
                    placeholder="Product summary..."
                  />
                  <p className="mt-1 text-xs text-gray-500">HTML supported: paragraphs, lists, bold, italic, links, etc.</p>
                </div>

                {/* References */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">References</h3>
                    <button
                      type="button"
                      onClick={addReference}
                      className="flex items-center gap-1 px-3 py-1 text-xs text-teal-600 border border-teal-600 rounded hover:bg-teal-50"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {references.map((ref, index) => (
                      <div key={index} className="flex gap-2">
                        <Textarea
                          value={ref.text}
                          onChange={(e) => handleReferenceChange(index, 'text', e.target.value)}
                          rows={1}
                          className="flex-1 text-sm"
                          placeholder="Reference text"
                        />
                        <input
                          type="url"
                          value={ref.link}
                          onChange={(e) => handleReferenceChange(index, 'link', e.target.value)}
                          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                          placeholder="Link (optional)"
                        />
                        {references.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReference(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">HTML supported in reference text field.</p>
                </div>

                {/* Section Visibility Controls */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Section Visibility</h3>
                  <p className="text-xs text-gray-500 mb-4">Enable or disable sections on the product page</p>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Product Hero</span>
                        <p className="text-xs text-gray-500">Main product image, title, price, and add to cart</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={sections.productHero}
                        onChange={(e) => setSections(prev => ({ ...prev, productHero: e.target.checked }))}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Product Details</span>
                        <p className="text-xs text-gray-500">Characteristics, research usage, areas of study, references</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={sections.productDetails}
                        onChange={(e) => setSections(prev => ({ ...prev, productDetails: e.target.checked }))}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
                      <div>
                        <span className="text-sm font-medium text-gray-900">COA & Resource</span>
                        <p className="text-xs text-gray-500">Certificate of Analysis and resource disclaimer</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={sections.coaResource}
                        onChange={(e) => setSections(prev => ({ ...prev, coaResource: e.target.checked }))}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Company Trust Badges</span>
                        <p className="text-xs text-gray-500">Purity, verification, and shipping badges</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={sections.companyTrustBadges}
                        onChange={(e) => setSections(prev => ({ ...prev, companyTrustBadges: e.target.checked }))}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Custom Section */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Custom Section (After Resource)</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customSection.enabled}
                        onChange={(e) => setCustomSection(prev => ({ ...prev, enabled: e.target.checked }))}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">Enable Custom Section</span>
                    </label>
                  </div>
                  {customSection.enabled && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={customSection.title}
                          onChange={(e) => setCustomSection(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          placeholder="e.g., Additional Information"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section Content (HTML supported)
                        </label>
                        <Textarea
                          value={customSection.content}
                          onChange={(e) => setCustomSection(prev => ({ ...prev, content: e.target.value }))}
                          rows={6}
                          className="w-full"
                          placeholder="Enter custom content. HTML is supported."
                        />
                        <p className="mt-1 text-xs text-gray-500">This section will appear after the Resource section on the product page.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* SEO */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">SEO Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        SEO Title
                      </label>
                      <Textarea
                        id="seoTitle"
                        name="seoTitle"
                        rows={2}
                        value={formData.seoTitle}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="SEO optimized title"
                      />
                      <p className="mt-1 text-xs text-gray-500">HTML supported.</p>
                    </div>

                    <div>
                      <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        SEO Description
                      </label>
                      <Textarea
                        id="seoDescription"
                        name="seoDescription"
                        rows={4}
                        value={formData.seoDescription}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="SEO meta description..."
                      />
                      <p className="mt-1 text-xs text-gray-500">HTML supported.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COA Tab */}
            {activeTab === 'coa' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Certificate of Analysis (COA)
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Upload an image for the Certificate of Analysis. This will be displayed on the product page.
                  </p>
                  <ImageUploader
                    onUploadComplete={(url) => {
                      setFormData(prev => ({ ...prev, coaImageUrl: url }));
                    }}
                    currentImage={formData.coaImageUrl}
                    folder="coa"
                  />
                </div>
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                {/* Bulk Import Section */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Bulk Import FAQs</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBulkImport(!showBulkImport);
                        if (!showBulkImport) {
                          setBulkImportText('');
                        }
                      }}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      {showBulkImport ? 'Hide' : 'Show'} Bulk Import
                    </button>
                  </div>

                  {showBulkImport && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setBulkImportMethod('text')}
                          className={`px-3 py-1.5 text-xs rounded ${
                            bulkImportMethod === 'text'
                              ? 'bg-teal-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300'
                          }`}
                        >
                          Method 1: Text Format
                        </button>
                        <button
                          type="button"
                          onClick={() => setBulkImportMethod('json')}
                          className={`px-3 py-1.5 text-xs rounded ${
                            bulkImportMethod === 'json'
                              ? 'bg-teal-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300'
                          }`}
                        >
                          Method 2: JSON Format
                        </button>
                      </div>

                      {bulkImportMethod === 'text' ? (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Text Format (Q: Question, A: Answer)
                          </label>
                          <Textarea
                            value={bulkImportText}
                            onChange={(e) => setBulkImportText(e.target.value)}
                            rows={8}
                            className="w-full text-sm font-mono"
                            placeholder={`Q: What is this product?
A: This is a research peptide.

Q: How should I store it?
A: Store in a cool, dry place.

Q: What is the purity?
A: 99%+ purity verified.`}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Format: Start each question with "Q:" or "Q-" and each answer with "A:" or "A-"
                          </p>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            JSON Format
                          </label>
                          <Textarea
                            value={bulkImportText}
                            onChange={(e) => setBulkImportText(e.target.value)}
                            rows={8}
                            className="w-full text-sm font-mono"
                            placeholder={`[
  {
    "question": "What is this product?",
    "answer": "This is a research peptide."
  },
  {
    "question": "How should I store it?",
    "answer": "Store in a cool, dry place."
  }
]`}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Format: JSON array with objects containing "question" and "answer" fields
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleBulkImport}
                          className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                        >
                          Import FAQs
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBulkImportText('');
                            setShowBulkImport(false);
                          }}
                          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Individual FAQs</h3>
                </div>

                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">FAQ {index + 1}</h3>
                      {faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                      <Textarea
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                        rows={2}
                        className="w-full text-sm"
                        placeholder="Enter question"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                        rows={4}
                        className="w-full text-sm"
                        placeholder="Enter answer"
                      />
                    </div>
                    <p className="text-xs text-gray-500">HTML supported in both question and answer fields.</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFaq}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50"
                >
                  <Plus className="w-4 h-4" />
                  Add FAQ
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-6 flex items-center justify-end gap-4">
            <Link
              href="/admin/products"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
