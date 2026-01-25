import React from 'react';
import { SECTION_COMPONENTS } from './sections';

interface SectionData {
  type: string;
  settings: Record<string, any>;
  blocks?: Record<string, { type: string; settings: Record<string, any> }>;
  block_order?: string[];
}

interface TemplateData {
  sections: Record<string, SectionData>;
  order: string[];
}

interface SectionRendererProps {
  template: TemplateData;
}

export function SectionRenderer({ template }: SectionRendererProps) {
  if (!template || !template.order) return null;

  return (
    <>
      {template.order.map((sectionId) => {
        const section = template.sections[sectionId];
        if (!section) return null;

        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) {
          console.warn(`Section type "${section.type}" not found in SECTION_COMPONENTS`);
          return null;
        }

        // Convert blocks object to array if needed by the component
        const blocks = section.block_order?.map(id => ({
          id,
          ...section.blocks?.[id]
        })) || [];

        return (
          <Component 
            key={sectionId} 
            settings={section.settings} 
            blocks={blocks}
            sectionId={sectionId}
          />
        );
      })}
    </>
  );
}
