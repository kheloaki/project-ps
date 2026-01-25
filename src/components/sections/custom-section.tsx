import React from 'react';

interface CustomSectionProps {
  title?: string;
  content?: string;
  enabled?: boolean;
}

const CustomSection: React.FC<CustomSectionProps> = ({ 
  title, 
  content, 
  enabled = false 
}) => {
  if (!enabled || !content) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-8 md:py-12 border-t border-gray-200 mt-8">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-32">
        <div className="md:w-1/4">
          {title && (
            <h2 className="text-xl font-semibold text-[#09121F] leading-tight">
              {title}
            </h2>
          )}
        </div>
        <div className="md:w-3/4">
          <div 
            className="text-sm md:text-base text-[#4B5563] leading-relaxed max-w-2xl prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </section>
  );
};

export default CustomSection;

