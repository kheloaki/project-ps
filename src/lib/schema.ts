/**
 * Generates Google Product schema (JSON-LD) for structured data.
 * Includes product details, pricing, availability, and optional FAQs.
 * 
 * @param product - Product object with title, handle, price, image, description, etc.
 * @returns JSON-LD schema object for Product
 * 
 * @example
 * ```tsx
 * const schema = generateProductSchema(product);
 * <SchemaScript schema={schema} />
 * ```
 */
export function generateProductSchema(product: any) {
  const schema: any = {
    "@context": "https://schema.org/",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://peptidesskin.com/products/${product.handle}#product`,
        "name": product.title,
        "image": Array.isArray(product.image) ? product.image : [product.image],
        "description": product.seoDescription || product.description,
        "sku": product.id || product.handle,
        "mpn": product.id || product.handle,
        "brand": {
          "@type": "Brand",
          "name": "Peptides Skin",
          "@id": "https://peptidesskin.com/#organization"
        },
        "manufacturer": {
          "@type": "Organization",
          "@id": "https://peptidesskin.com/#organization"
        },
        "category": product.category || product.collection,
        "offers": {
          "@type": "Offer",
          "url": `https://peptidesskin.com/products/${product.handle}`,
          "priceCurrency": "USD",
          "price": product.price ? product.price.replace(/[^0-9.]/g, '') : "0",
          "availability": product.available !== false 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "@id": "https://peptidesskin.com/#organization"
          },
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      }
    ]
  };

  if (product.faqs && product.faqs.length > 0) {
    schema["@graph"].push({
      "@type": "FAQPage",
      "@id": `https://peptidesskin.com/products/${product.handle}#faq`,
      "mainEntity": product.faqs.map((faq: any) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  }

  return schema;
}

/**
 * Generates Google Article/BlogPosting schema (JSON-LD) for blog posts.
 * Supports TechArticle and BlogPosting types, with optional FAQs and video embeds.
 * 
 * @param post - Blog post object with title, slug, date, image, etc.
 * @returns JSON-LD schema object for Article
 */
export function generateArticleSchema(post: any) {
  const isTechArticle = post.slug === 'tesamorelin-peptide-research-profile';
  const type = isTechArticle ? "TechArticle" : "BlogPosting";

  const article: any = {
    "@type": type,
    "@id": `https://peptidesskin.com/blogs/news/${post.slug}#article`,
    "headline": post.title,
    "description": post.metaDescription || post.excerpt,
    "image": {
      "@type": "ImageObject",
      "url": post.image,
      "caption": post.alt,
      "width": 1200,
      "height": 630
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": "Peptides Skin Research Team"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://peptidesskin.com/#organization"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://peptidesskin.com/blogs/news/${post.slug}`
    },
    "inLanguage": "en"
  };

  if (post.tags && post.tags.length > 0) {
    article.keywords = post.tags.join(", ");
  }

  if (post.category) {
    article.articleSection = post.category;
  }

  const schema: any = {
    "@context": "https://schema.org",
    "@graph": [article]
  };

  if (post.faqs) {
    schema["@graph"].push({
      "@type": "FAQPage",
      "@id": `https://peptidesskin.com/blogs/news/${post.slug}#faq`,
      "mainEntity": post.faqs.map((faq: any) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  }

  if (post.youtubeId) {
    schema["@graph"].push({
      "@type": "VideoObject",
      "name": post.title,
      "description": post.metaDescription || post.excerpt,
      "uploadDate": post.date,
      "thumbnailUrl": [`https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`],
      "embedUrl": `https://www.youtube.com/embed/${post.youtubeId}`
    });
  }

  return schema;
}

/**
 * Generates Google BreadcrumbList schema (JSON-LD) for navigation breadcrumbs.
 * Helps Google understand page hierarchy and enables breadcrumb rich results.
 * 
 * @param items - Array of breadcrumb items with name and URL
 * @returns JSON-LD schema object for BreadcrumbList
 */
export function generateBreadcrumbSchema(items: { name: string, item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
}

/**
 * Generates Google FAQPage schema (JSON-LD) for frequently asked questions.
 * Enables FAQ rich results in Google Search.
 * 
 * @param faqs - Array of FAQ objects with question and answer
 * @returns JSON-LD schema object for FAQPage
 */
export function generateFAQSchema(faqs: { question: string, answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generates root-level Google structured data (JSON-LD) for the website.
 * Includes Organization, WebSite, and Service schemas.
 * This is automatically added to all pages via the root layout.
 * 
 * @returns JSON-LD schema object with Organization, WebSite, and Service
 */
export function generateRootSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://peptidesskin.com/#organization",
        "name": "Peptides Skin",
        "url": "https://peptidesskin.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://peptidesskin.com/logo.png",
          "width": 512,
          "height": 512
        },
        "description": "Premier B2B supplier of high-purity research-grade peptides serving academic institutions, private laboratories, and independent researchers.",
        "foundingDate": "2024",
        "contactPoint": [{
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "peptidesskin@gmail.com",
          "availableLanguage": ["en"]
        }],
        "sameAs": [
          "https://instagram.com/peptidesskin",
          "https://twitter.com/peptidesskin"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://peptidesskin.com/#website",
        "url": "https://peptidesskin.com/",
        "name": "Peptides Skin",
        "inLanguage": "en",
        "publisher": { "@id": "https://peptidesskin.com/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://peptidesskin.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Service",
        "@id": "https://peptidesskin.com/#service",
        "name": "Research Peptide Synthesis Services",
        "description": "B2B bulk peptide synthesis and high-purity research peptide supply for biotechnology laboratories and research institutions.",
        "provider": { "@id": "https://peptidesskin.com/#organization" },
        "serviceType": "Peptide Synthesis",
        "areaServed": "Worldwide",
        "availableChannel": {
          "@type": "ServiceChannel",
          "serviceUrl": "https://peptidesskin.com/",
          "serviceType": "Online"
        }
      }
    ]
  };
}

export function generateBlogSchema(posts: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://peptidesskin.com/blogs/news#blog",
    "url": "https://peptidesskin.com/blogs/news",
    "name": "News",
    "description": "Latest research and updates on peptides and biotechnology.",
    "publisher": { "@id": "https://peptidesskin.com/#organization" },
    "itemListElement": posts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://peptidesskin.com/blogs/news/${post.slug}`,
      "name": post.title,
      "image": post.image,
      "datePublished": post.date
    }))
  };
}

export function generateCollectionSchema(collection: any) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://peptidesskin.com/collections/${collection.handle}#collection`,
    "url": `https://peptidesskin.com/collections/${collection.handle}`,
    "name": collection.title,
    "hasPart": {
      "@type": "ItemList",
      "itemListElement": collection.products.map((p: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "@id": `https://peptidesskin.com/products/${p.handle}`,
          "name": p.title
        }
      }))
    }
  };
}

/**
 * Generates Google ItemList schema (JSON-LD) for lists of items.
 * Useful for product listings, article lists, or any ordered collection.
 * 
 * @param items - Array of items to include in the list
 * @param name - Name of the list
 * @param description - Optional description of the list
 * @returns JSON-LD schema object for ItemList
 */
export function generateItemListSchema(items: any[], name: string, description?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "description": description,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": item
    }))
  };
}

/**
 * Generates Google Review schema (JSON-LD) for product or service reviews.
 * 
 * @param review - Review object with author, rating, reviewBody, and optional datePublished
 * @returns JSON-LD schema object for Review
 */
export function generateReviewSchema(review: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished || new Date().toISOString()
  };
}

/**
 * Generates Product schema with integrated reviews and aggregate ratings.
 * Combines product information with review data for enhanced rich results.
 * 
 * @param product - Product object
 * @param reviews - Optional array of review objects
 * @returns JSON-LD schema object for Product with reviews
 */
export function generateProductWithReviewsSchema(product: any, reviews?: any[]) {
  const schema = generateProductSchema(product);
  
  if (reviews && reviews.length > 0) {
    const aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      "reviewCount": reviews.length,
      "bestRating": 5,
      "worstRating": 1
    };
    
    schema["@graph"][0].aggregateRating = aggregateRating;
    schema["@graph"][0].review = reviews.map(review => generateReviewSchema(review));
  }
  
  return schema;
}

/**
 * Generates Google HowTo schema (JSON-LD) for step-by-step guides.
 * Enables HowTo rich results in Google Search with expandable steps.
 * 
 * @param howTo - HowTo object with name, description, steps, and optional image/totalTime
 * @returns JSON-LD schema object for HowTo
 */
export function generateHowToSchema(howTo: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howTo.name,
    "description": howTo.description,
    "image": howTo.image,
    "totalTime": howTo.totalTime,
    "step": howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "image": step.image
    }))
  };
}

/**
 * Generates Google VideoObject schema (JSON-LD) for video content.
 * Enables video rich results in Google Search.
 * 
 * @param video - Video object with name, description, thumbnailUrl, uploadDate, etc.
 * @returns JSON-LD schema object for VideoObject
 */
export function generateVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": video.thumbnailUrl,
    "uploadDate": video.uploadDate,
    "contentUrl": video.contentUrl,
    "embedUrl": video.embedUrl,
    "duration": video.duration,
    "publisher": {
      "@type": "Organization",
      "@id": "https://peptidesskin.com/#organization"
    }
  };
}

/**
 * Generates Google LocalBusiness schema (JSON-LD) for local business information.
 * Useful for businesses with physical locations.
 * 
 * @param business - Business object with name, address, telephone, etc.
 * @returns JSON-LD schema object for LocalBusiness
 */
export function generateLocalBusinessSchema(business: {
  name: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  telephone?: string;
  priceRange?: string;
  openingHours?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address.streetAddress,
      "addressLocality": business.address.addressLocality,
      "addressRegion": business.address.addressRegion,
      "postalCode": business.address.postalCode,
      "addressCountry": business.address.addressCountry
    },
    "telephone": business.telephone,
    "priceRange": business.priceRange,
    "openingHoursSpecification": business.openingHours?.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours
    }))
  };
}
