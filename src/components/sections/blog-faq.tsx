import React from 'react';

const BlogFaq = () => {
  return (
    <section className="bg-white py-20">
      <div className="container max-w-[1200px] mx-auto px-6">
        {/* FAQ Wrapper */}
        <div className="flex flex-col gap-6 max-w-[800px] mx-auto">
          {/* FAQ Header */}
          <h2 className="text-[36px] font-bold uppercase leading-tight tracking-tight mb-8 mt-12">
            Frequently Asked Questions (FAQ)
          </h2>

          {/* FAQ Item 1 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-bold uppercase leading-tight mt-0 mb-4">
              Can I buy retatrutide over the counter?
            </h3>
            <p className="text-[16px] leading-[1.6] text-black mb-6">
              No. Retatrutide is an investigational drug currently in clinical trials. It is not available over the counter at pharmacies. It can only be purchased by qualified researchers from specialized chemical suppliers for laboratory use only.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-bold uppercase leading-tight mt-0 mb-4">
              Which is better for research, tirzepatide or retatrutide?
            </h3>
            <p className="text-[16px] leading-[1.6] text-black mb-6">
              &quot;Better&quot; depends on the research goal. Retatrutide is often selected for studies focusing on maximal metabolic impact due to its glucagon component, whereas tirzepatide is the standard for dual-agonist research. Retatrutide is considered a next-generation compound with potentially higher efficacy in weight loss models.
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-bold uppercase leading-tight mt-0 mb-4">
              Is it legal to buy retatrutide?
            </h3>
            <p className="text-[16px] leading-[1.6] text-black mb-12">
              Yes, it is legal to purchase retatrutide as a research chemical for in-vitro and laboratory experimentation. It is illegal to sell or buy it for human consumption or as an unapproved medication.
            </p>
          </div>

          {/* Conclusion Section */}
          <div className="border-t border-[#e0e0e0] pt-12">
            <h2 className="text-[36px] font-bold uppercase leading-tight tracking-tight mb-8 mt-0">
              Conclusion
            </h2>
            <p className="text-[16px] leading-[1.6] text-black mb-12">
              Identifying <a href="#" className="text-[#1c8ca3] hover:underline font-semibold">where to buy retatrutide</a> involves verifying the supplier&apos;s credibility, testing transparency, and compliance with research standards. By choosing a dedicated partner like Peptides Skin, you ensure that your research is built on a foundation of quality and reliability. Explore our catalog today to secure high-purity peptides for your next project.
            </p>

            {/* Disclaimer */}
            <p className="text-[14px] leading-[1.5] text-[#666666] italic mt-8">
              Disclaimer: This article is for informational and research-education purposes only. The peptides discussed are intended solely for in-vitro laboratory research and are not approved for human or veterinary use. Not for diagnostic or therapeutic use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogFaq;