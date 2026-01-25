import React from 'react';
import Image from 'next/image';

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  link: string;
  isFullWidth?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    title: "BPC-157: Potential Interactions with Angiogenesis, Inflammation Signaling, and Tissue Repair Pathways.",
    excerpt: "BPC-157 is widely discussed in preclinical research for its potential links to vascular signaling, inflammation readouts, and tissue remodeling models. This page summarizes key pathways, assays, and limitations for research...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/peptides-for-healing-regeneration-banner-15.webp",
    link: "/blogs/news/bpc-157-potential-interactions-with-angiogenesis-inflammation-signaling-and-tissue-repair-pathways",
    isFullWidth: true,
  },
  {
    title: "where to buy retatrutide",
    excerpt: "As researchers seek to buy Retatrutide (LY3437943), ensuring quality is critical. This comprehensive guide covers the essential factors: verifying purity with HPLC and COA, understanding its triple-agonist mechanism, and following...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/reta-peptide-peptideskin-3.webp",
    link: "/blogs/news/where-to-buy-retatrutide"
  },
  {
    title: "Buy Peptides Safely in the USA",
    excerpt: "Investigational research peptide targeting GLP-1, GIP, and glucagon pathways. For laboratory research use only.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/photorealistic-image-of-a-modern--clean-laboratory-4.webp",
    link: "/blogs/news/buy-peptides-safely-in-the-usa"
  },
  {
    title: "collagen peptides powder",
    excerpt: "Collagen peptides powder is one of the most popular supplements for supporting skin, hair, nails, joints, and overall wellness. This guide explains how collagen peptides work, their benefits, how to...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/collagen-peptides-powder-research-laboratory-pepti-5.webp",
    link: "#"
  },
  {
    title: "peptide protocols",
    excerpt: "Peptides are short chains of amino acids that support muscle recovery, skin health and overall wellness. Learn what peptides are, their types, benefits and risks.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/Mechanism_of_Action_of_Peptides_56439414-77cb-48bc-6.webp",
    link: "#"
  },
  {
    title: "polaris tirzepatide",
    excerpt: "Polaris Tirzepatide review covering purity, independent testing results, vial sizes, and safety considerations. Learn whether Polaris Peptides is a legit and reliable source of research-grade tirzepatide (tirz) for research-use-only applications...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/polaris-tirzepatide-research-vial-900-7.webp",
    link: "#"
  },
  {
    title: "best peptide serum",
    excerpt: "Looking for the best peptide serum in 2025? This guide explains how peptide serums work, the different peptide types, their skin benefits, and how to choose the right serum for...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/Ingredients_for_the_Best_Peptide_Serum-8.webp",
    link: "#"
  },
  {
    title: "peptide therapy near me",
    excerpt: "If you're searching for \"peptide therapy near me,\" this guide by Dr. Anya Sharma offers a safe, realistic approach. Learn about true capabilities, limitations, risks, and legality. Discover how to...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/Peptide-Therapy-Near-Me-Peptide-Therapy-Guide-9.webp",
    link: "#"
  },
  {
    title: "cyclic citrullinated peptide",
    excerpt: "Anti-CCP antibodies and cyclic citrullinated peptides are key biomarkers for rheumatoid arthritis. This guide explains citrullination, test interpretation, and how early detection can improve outcomes and treatment decisions.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/Ingredients_for_Cyclic_Citrullinated_Peptide-10.webp",
    link: "#"
  },
  {
    title: "core peptides",
    excerpt: "Peptides are powerful biological messengers that influence hormones, cellular repair, immune balance, and overall health. This guide explains how peptides work, the different types, key applications in medicine and wellness,...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/peptides-biological-functions-therapy-health-appli-11.png",
    link: "#"
  },
  {
    title: "kpv peptide",
    excerpt: "KPV peptide (Lys-Pro-Val) is a compact α-MSH fragment widely used as a research tool in epithelial, dermal and microbial models. This technical review covers its structure, PepT1-mediated transport, signaling frameworks,...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/kpv-peptide-pept1-transport-structure-peptidesskin-12.png",
    link: "#"
  },
  {
    title: "rhode peptide lip tint",
    excerpt: "Discover the Magic of Rhode Peptide Lip Tint Have you ever wondered how to achieve beautifully hydrated and plump lips? The Rhode Peptide Lip Tint is here to transform your...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/Making_Rhode_Peptide_Lip_Tint-13.webp",
    link: "#"
  },
  {
    title: "peptides for muscle growth",
    excerpt: "This article explores how research peptides such as CJC-1295, Ipamorelin, IGF-1 LR3, MGF and Follistatin 344 are used in myogenesis studies to investigate muscle growth, protein synthesis, satellite cell activation,...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/myogenesis-muscle-cell-research-peptides-article-h-14.webp",
    link: "#"
  },
  {
    title: "peptides for healing",
    excerpt: "Discover how therapeutic peptides help the body repair itself by boosting cellular regeneration calming inflammation supporting collagen production and improving recovery from injury or surgery while stressing that any peptide...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/peptides-for-healing-regeneration-banner-15.webp",
    link: "#"
  },
  {
    title: "make wellness peptides",
    excerpt: "This article explores how research peptides such as BPC-157, GHK-Cu, Epitalon and MOTS-c are used in vitro to study cellular homeostasis, angiogenesis, dermal remodeling, metabolic flexibility and telomere biology in...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/research-peptides-cellular-homeostasis-lab-hero-16.webp",
    link: "#"
  },
  {
    title: "skye peptides",
    excerpt: "Dive into our comprehensive guide on research-grade peptides. Understand their critical role in scientific studies, learn how to source high-quality compounds with proper third-party testing, and adhere to essential ethical...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/therapeutic-peptide-gpcr-binding-3d-illustration-17.webp",
    link: "#"
  },
  {
    title: "tesamorelin peptide",
    excerpt: "A detailed scientific review of Tesamorelin, covering its molecular structure, stability, GHRH receptor mechanism, and comparative data with CJC-1295 and Ipamorelin for laboratory research applications.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/tesamorelin-peptide-structure-hexenoic-acid_-24.webp",
    link: "#"
  },
  {
    title: "hydrolyzed collagen peptides",
    excerpt: "Hydrolyzed collagen peptides are short-chain fragments of native collagen used as research-grade reagents in in-vitro models. This article explains their biochemical structure, 3-6 kDa molecular weight range, analytical characterization and...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/hydrolyzed-collagen-peptides-research-hero-25.webp",
    link: "#"
  },
  {
    title: "sermorelin peptide",
    excerpt: "What is Sermorelin? Sermorelin is a synthetic peptide that stimulates the production of growth hormone (GH) from the pituitary gland. It is a fragment of growth hormone-releasing hormone (GHRH) and...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/Sermorelin_vs__Other_Growth_Hormones-26.webp",
    link: "#"
  },
  {
    title: "retatrutide peptide",
    excerpt: "In the rapidly evolving landscape of metabolic research, retatrutide peptide (LY3437943) has emerged as a significant subject of scientific inquiry. Representing the next generation of incretin mimetics, this novel compound...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/Retatrutide_Peptide_Molecular_Structure_98de51ba-a-27.webp",
    link: "#"
  },
  {
    title: "what is a peptide bond",
    excerpt: "Discover what a peptide bond is, how it forms through dehydration synthesis, and its unique structural characteristics. Learn why this crucial covalent link between amino acids is fundamental to protein...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/What_is_a_Peptide_Bond-28.webp",
    link: "#"
  },
  {
    title: "what is Glucagon like Peptide?",
    excerpt: "Glucagon-like Peptide-1 (GLP-1) is a natural incretin hormone that helps regulate blood sugar, digestion and appetite. This PeptidesSkin research guide explains how it works, how it differs from GLP-1 agonist...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/what-is-Glucagon-like-Peptide-29.webp",
    link: "#"
  },
  {
    title: "peptide sciences",
    excerpt: "What Are Peptides? Peptides are short chains of amino acids linked by peptide bonds. They play crucial roles in various biological functions, including hormone regulation, immune response, and protein synthesis....",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/Understanding_Peptides-30.webp",
    link: "#"
  },
  {
    title: "collagen peptides benefits",
    excerpt: "The Ultimate Guide to Collagen Peptides: Benefits, Uses, and Recommendations What Are Collagen Peptides? Collagen peptides are short chains of amino acids derived from collagen, a vital protein in our...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/collagen-stimulating-peptides-ghk-cu-matrikines-si-20.webp",
    link: "#"
  },
  {
    title: "GHK-Cu peptide overview",
    excerpt: "GHK-Cu is one of the most studied peptides for skin regeneration, collagen production, and hair growth. This science-backed guide by PeptidesSkin explains how it works and why it's considered a...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/research-grade_peptides-23.webp",
    link: "#"
  },
  {
    title: "Are peptides safe?",
    excerpt: "Are peptides really safe, or are some of them more dangerous than people think? This PeptidesSkin 2025 guide explains the safety spectrum of peptides, from FDA-approved medications to high-risk research...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/research-peptides-skin-models-hero_-22.webp",
    link: "#"
  },
  {
    title: "Are collagen peptides good for you?",
    excerpt: "Collagen peptides play a critical role in research, from triple-helix stability (Gly-Pro-Hyp) to Caco-2 permeability and tissue engineering. This analysis from Peptides Skin examines CMP bioactivity, synthesis methods, and structural...",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/230936c2-4e5c-43af-beb9-b9e321d2e7bf-peptidesskin-com/assets/images/metabolic-peptides-glp1-aod9604-motsc-pathways_-21.webp",
    link: "#"
  },
];

const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <div className={`flex flex-col mb-10 group cursor-pointer ${post.isFullWidth ? 'md:col-span-3 lg:col-span-3 mb-16' : ''}`}>
      <a href={post.link} className="block overflow-hidden rounded-[4px] border border-[#e2e2e2] mb-5">
        <div className={`relative overflow-hidden ${post.isFullWidth ? 'aspect-[16/6]' : 'aspect-[16/9]'}`}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
            sizes={post.isFullWidth ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        </div>
      </a>
      <div className={`${post.isFullWidth ? 'md:grid md:grid-cols-12 md:gap-8' : ''}`}>
        <div className={post.isFullWidth ? 'md:col-span-12' : ''}>
          <a href={post.link}>
            <h3 className={`font-semibold text-[20px] leading-[1.3] mt-0 mb-2 hover:opacity-80 transition-opacity ${post.isFullWidth ? 'text-[32px] font-medium mb-4' : ''}`}>
              {post.title}
            </h3>
          </a>
          <p className="text-[16px] leading-[1.6] text-[#121212] mb-2 line-clamp-3">
            {post.excerpt}
          </p>
          <a
            href={post.link}
            className="text-[14px] text-[#d0312d] hover:underline"
          >
            Read more...
          </a>
        </div>
      </div>
    </div>
  );
};

export default function BlogGrid() {
  const topWeightPost = blogPosts[0];
  const gridPosts = blogPosts.slice(1);

  return (
    <section className="bg-white py-20 px-5">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <h1 className="text-[48px] font-medium leading-[1.1] tracking-[-0.01em] mb-8">
            News
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[30px] gap-y-0">
          {/* Top Post - Full Width Style */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <BlogCard post={topWeightPost} />
          </div>

          {/* Regular Posts Grid */}
          {gridPosts.map((post, index) => (
            <BlogCard key={index} post={post} />
          ))}
        </div>

        {/* Placeholder for remainder of 36 posts if data was available */}
        {blogPosts.length < 36 && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[30px]">
             {/* Repeat existing cards to simulate the grid volume if needed for pixel-perfect layout verification */}
           </div>
        )}
      </div>
    </section>
  );
}