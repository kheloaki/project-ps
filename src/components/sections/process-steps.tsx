import React from 'react';
import { CalendarDays, Stethoscope, ClipboardList, HeartPulse } from 'lucide-react';

const ProcessSteps = () => {
  const steps = [
    {
      number: '01',
      title: 'Inquiry & Quote',
      description: 'Submit your peptide sequence or select from our catalog for a same-day B2B quote.',
      icon: <CalendarDays className="w-10 h-10 text-white" strokeWidth={1.5} />,
    },
    {
      number: '02',
      title: 'Synthesis & Scaling',
      description: 'Our automated Chemputer systems begin precision assembly with batch scalability.',
      icon: <Stethoscope className="w-10 h-10 text-white" strokeWidth={1.5} />,
    },
    {
      number: '03',
      title: 'Quality Verification',
      description: 'Every compound undergoes rigorous HPLC and MS analysis to ensure 99%+ purity.',
      icon: <ClipboardList className="w-10 h-10 text-white" strokeWidth={1.5} />,
    },
    {
      number: '04',
      title: 'Secure Delivery',
      description: 'Lyophilized peptides are vacuum-sealed and shipped globally with cold-chain options.',
      icon: <HeartPulse className="w-10 h-10 text-white" strokeWidth={1.5} />,
    },
  ];

  return (
    <section className="relative px-4 py-[110px] bg-[#061a4b] overflow-hidden">
      {/* Background Decorative Waves - SVG approximation of medical wave paths */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 200 C 300 100, 600 300, 1200 150 L 1200 0 L 0 0 Z"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M0 220 C 350 120, 650 320, 1200 170"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="text-center mb-[60px]">
          <div className="inline-block bg-[#002d8b] rounded-full px-5 py-1 mb-4">
            <h4 className="text-white text-[13px] font-bold uppercase tracking-[0.1em] m-0">
              Our Workflow
            </h4>
          </div>
          <h2 className="text-white text-4xl md:text-[48px] font-bold leading-[1.2] max-w-[700px] mx-auto">
            From Sequence to <br /> Synthesis
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group bg-transparent border border-white/10 rounded-[30px] p-[40px] pt-[50px] transition-all duration-300 hover:bg-white/5"
            >
              {/* Icon */}
              <div className="mb-[30px] flex items-center justify-start h-[60px]">
                {step.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-white text-[24px] font-bold mb-4 tracking-tight">
                {step.title}
              </h3>
              <p className="text-white/70 text-[16px] leading-[1.7] font-normal mb-8">
                {step.description}
              </p>

              {/* Number Badge */}
              <div className="absolute bottom-[-22px] right-[30px] w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                <span className="text-[#061a4b] text-[14px] font-bold">
                  {step.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;