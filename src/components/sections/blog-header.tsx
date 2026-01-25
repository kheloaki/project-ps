import React from 'react';

const BlogHeader: React.FC = () => {
  return (
    <header className="w-full bg-white pt-[40px] md:pt-[48px] pb-0">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col items-center text-center">
          {/* Article H1 Title */}
          <div className="mb-4">
            <h1 className="m-0 p-0 text-[32px] md:text-[48px] font-bold uppercase tracking-[-0.01em] leading-[1.1] text-black">
              where to buy retatrutide
            </h1>
          </div>

          {/* Publication Date */}
          <div className="mb-[2rem]">
            <span className="text-[14px] text-[#666666] font-normal font-sans">
              <time dateTime="2025-12-18">December 18, 2025</time>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;