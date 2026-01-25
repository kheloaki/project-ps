import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      title: 'Basic Checkup',
      price: '299',
      featuresLeft: ['100 Tests & Treatments', 'Analysis Of Body Fluids', 'Blood Analysis'],
      featuresRight: ['Regular Health Checkups', 'Chorionic Sampling'],
      highlighted: false,
    },
    {
      title: 'Advance Examine',
      price: '499',
      featuresLeft: ['100 Tests & Treatments', 'Analysis Of Body Fluids', 'Blood Analysis'],
      featuresRight: ['Regular Health Checkups', 'Chorionic Sampling'],
      highlighted: true,
    },
    {
      title: 'Enterprise Care',
      price: '349',
      featuresLeft: ['100 Tests & Treatments', 'Analysis Of Body Fluids', 'Blood Analysis'],
      featuresRight: ['Regular Health Checkups', 'Chorionic Sampling'],
      highlighted: false,
    },
  ];

  return (
    <section className="bg-white py-[110px] overflow-hidden">
      <div className="container px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          {/* Left Column: Title and Illustration */}
          <div className="lg:w-1/3 flex flex-col justify-start">
            <div className="mb-10">
              <span className="inline-block bg-[#F4F8FB] text-[#4079CF] text-[12px] font-bold tracking-[0.05em] uppercase px-4 py-1.5 rounded-full mb-6">
                Pricing Table
              </span>
              <h2 className="text-[48px] font-bold text-[#061A4B] leading-[1.2] mb-8">
                The best <span className="text-[#061A4B]/20">pricing to help you!</span>
              </h2>
              <p className="text-[#556078] text-[17px] leading-[1.7] mb-12 max-w-[400px]">
                We carefully screen all of our cleaners, so you can rest assured that your home would receive the absolute highest quality of service providing.
              </p>
            </div>
            
            {/* Stethoscope Illustration Placeholder - Using SVG to match pixel perfection requirements */}
            <div className="hidden lg:block mt-auto relative">
              <div className="absolute top-0 left-0 w-full h-full transform -translate-x-10 translate-y-10 opacity-5">
                 {/* Decorative background element if needed */}
              </div>
              <img 
                src="https://xcare-demo.pbminfotech.com/demo14/wp-content/uploads/sites/21/2024/10/pricing-img-01.png" 
                alt="Stethoscope illustration" 
                className="w-full max-w-[320px] h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Column: Pricing Plans */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-[30px] p-10 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-[#4079CF] text-white'
                    : 'bg-white border border-[#E5EAF4] hover:shadow-[0_15px_45px_rgba(6,26,75,0.08)]'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-8">
                  {/* Plan Identifier */}
                  <div className="flex flex-col min-w-[180px]">
                    <h3 className={`text-[20px] font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-[#061A4B]'}`}>
                      {plan.title}
                    </h3>
                    <div className="flex items-start">
                      <span className="text-[24px] font-bold mt-2">$</span>
                      <span className="text-[60px] font-extrabold leading-none">{plan.price}</span>
                      <span className={`text-[14px] font-medium self-end mb-2 ml-2 ${plan.highlighted ? 'text-white/80' : 'text-[#556078]'}`}>
                        / Mo
                      </span>
                    </div>
                  </div>

                  {/* Checklist Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:flex-grow">
                    <ul className="space-y-4">
                      {plan.featuresLeft.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-[15px] font-medium">
                          <Check className={`w-[18px] h-[18px] ${plan.highlighted ? 'text-white' : 'text-[#4079CF]'}`} />
                          <span className={plan.highlighted ? 'text-white' : 'text-[#556078]'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-4">
                      {plan.featuresRight.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-[15px] font-medium">
                          <Check className={`w-[18px] h-[18px] ${plan.highlighted ? 'text-white' : 'text-[#4079CF]'}`} />
                          <span className={plan.highlighted ? 'text-white' : 'text-[#556078]'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button */}
                  <div className="md:self-end">
                    <a
                      href="#"
                      className={`inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 ${
                        plan.highlighted
                          ? 'bg-white text-[#061A4B] hover:bg-[#061A4B] hover:text-white'
                          : 'bg-[#F4F8FB] text-[#061A4B] hover:bg-[#4079CF] hover:text-white'
                      }`}
                    >
                      Purchase Now
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;