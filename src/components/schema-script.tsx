/**
 * SchemaScript Component
 * 
 * A reusable component for adding Google structured data (JSON-LD) to pages.
 * This helps with SEO and enables rich results in Google Search.
 * 
 * Usage:
 * ```tsx
 * <SchemaScript schema={generateProductSchema(product)} />
 * ```
 */

interface SchemaScriptProps {
  schema: object | object[];
  id?: string;
}

export function SchemaScript({ schema, id }: SchemaScriptProps) {
  // Handle both single schema objects and arrays of schemas
  const schemas = Array.isArray(schema) ? schema : [schema];
  
  return (
    <>
      {schemas.map((s, index) => (
        <script
          key={id || `schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}

