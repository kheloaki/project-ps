import React from 'react';
import { ArrowUpRight, Phone } from 'lucide-react';

const CtaBanner = () => {
  return (
    <section className="relative w-full py-[110px] bg-white overflow-hidden">
      <div className="container px-4 mx-auto">
        <div 
          className="relative w-full h-[400px] flex items-center rounded-[30px] overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(6, 26, 75, 0.4), rgba(6, 26, 75, 0.4)), url('https://xcare-demo.pbminfotech.com/demo14/wp-content/uploads/sites/21/2024/10/blog-04.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Main Content Area */}
          <div className="relative z-10 w-full md:w-2/3 lg:w-3/5 pl-[60px] pr-[40px]">
            <div className="mb-6">
              <span className="inline-block bg-[#F4F8FB] text-[#061A4B] text-[12px] font-bold uppercase tracking-[0.05em] px-4 py-2 rounded-[4px]">
                Don't hesitate to contact us.
              </span>
            </div>
            
            <h2 className="text-white text-[clamp(28px,4vw,48px)] font-bold mb-8 leading-[1.2]">
              Looking for professionals & trusted medical healthcare?
            </h2>

            <a 
              href="#" 
              className="group inline-flex items-center gap-3 bg-[#4079CF] hover:bg-[#002D8B] text-white font-bold text-[14px] px-8 py-4 rounded-full transition-all duration-300"
            >
              BOOK APPOINTMENT
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          {/* Right Side Vertical Phone Strip */}
          <div className="absolute top-0 right-0 h-full w-[80px] bg-white hidden lg:flex flex-col items-center justify-center border-l border-[#E5EAF4]">
            <div className="flex flex-col items-center gap-6">
              <div className="w-[45px] h-[45px] bg-[#F4F8FB] rounded-full flex items-center justify-center text-[#4079CF]">
                <Phone className="w-5 h-5" />
              </div>
              <div 
                className="whitespace-nowrap transform -rotate-90 origin-center text-[#061A4B] font-bold text-[18px] tracking-wide"
                style={{ width: 'max-content' }}
              >
                +125-8845-5421
              </div>
            </div>
          </div>

          {/* Doctor Image Overlay (Masked Female Doctor) */}
          <div className="absolute right-[80px] bottom-0 h-full w-2/5 pointer-events-none hidden lg:block">
            <img 
              src="https://xcare-demo.pbminfotech.com/demo14/wp-content/uploads/sites/21/2024/10/blog-04.jpg" 
              alt="Doctor In Mask" 
              className="h-full w-full object-cover object-top"
              style={{
                maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;