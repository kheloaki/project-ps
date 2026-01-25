"use client";

import React from 'react';
import Image from 'next/image';
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react';

const doctors = [
  {
    name: "Jordan Peele",
    specialty: "Cardiologist",
    image: "https://xcare-demo.pbminfotech.com/demo14/wp-content/uploads/sites/21/2023/07/team-img-01.jpg",
  },
  {
    name: "David Lee",
    specialty: "Gynecologist",
    image: "https://xcare-demo.pbminfotech.com/demo14/wp-content/uploads/sites/21/2023/07/team-img-02.jpg",
  },
  {
    name: "Norton Berry",
    specialty: "Surgeon",
    image: "https://xcare-demo.pbminfotech.com/demo14/wp-content/uploads/sites/21/2023/07/team-img-03.jpg",
  },
  {
    name: "Paula Deen",
    specialty: "Osteopaths",
    image: "https://xcare-demo.pbminfotech.com/demo14/wp-content/uploads/sites/21/2023/07/team-img-04.jpg",
  },
];

const TeamSection = () => {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[50px]">
          <div className="max-w-[600px]">
            <div className="inline-block bg-[#f4f8fb] rounded-full px-4 py-1.5 mb-4">
              <h4 className="text-[14px] font-semibold text-[#4079cf] uppercase tracking-wider m-0">
                Team Members
              </h4>
            </div>
            <h2 className="text-[#061a4b] text-[48px] font-bold leading-[1.2] m-0">
              We have best specialist doctors to serve you
            </h2>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-2 mt-6 md:mt-0">
            <button className="w-[50px] h-[50px] rounded-[15px] border border-[#e5eaf4] flex items-center justify-center text-[#061a4b] hover:bg-[#4079cf] hover:text-white hover:border-[#4079cf] transition-all duration-300">
              <ChevronLeft size={20} />
            </button>
            <button className="w-[50px] h-[50px] rounded-[15px] border border-[#e5eaf4] flex items-center justify-center text-[#061a4b] hover:bg-[#4079cf] hover:text-white hover:border-[#4079cf] transition-all duration-300">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          {doctors.map((doctor, index) => (
            <div 
              key={index} 
              className="group relative bg-white border border-[#e5eaf4] rounded-[30px] overflow-hidden transition-all duration-300 hover:shadow-medical hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[30px]">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content Area */}
              <div className="p-[30px] relative">
                <h3 className="text-[22px] font-bold text-[#061a4b] mb-1 group-hover:text-[#4079cf] transition-colors duration-300">
                  {doctor.name}
                </h3>
                <p className="text-[14px] font-medium text-[#556078] uppercase tracking-wide">
                  {doctor.specialty}
                </p>

                {/* Share Icon */}
                <div className="absolute top-[30px] right-[30px]">
                  <div className="relative">
                    <button className="w-[35px] h-[35px] bg-[#f4f8fb] rounded-full flex items-center justify-center text-[#061a4b] hover:bg-[#4079cf] hover:text-white transition-all duration-300 shadow-sm">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Bottom Decorative Bar */}
              <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#4079cf] transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default TeamSection;
