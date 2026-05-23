"use client";
import React from 'react';

interface PressItem {
  outlet: string;
  url: string;
  image: string;
}

export default function PressSection() {
  const articles: PressItem[] = [
    {
      outlet: 'Astro Awani',
      url: 'https://www.astroawani.com/berita-malaysia/miros-bakal-uji-keberkesanan-sistem-mcas-363173',
      image: '/press/awani.png'
    },
    {
      outlet: 'Bernama',
      url: 'https://www.bernama.com/en/general/news.php?id=1927789',
      image: '/press/bernama.png'
    },
    {
      outlet: 'Paul Tan',
      url: 'https://paultan.org/2022/05/25/miros-conducts-live-study-on-motorcycle-collision-avoidance-system-in-malaysia-45-units-to-be-tested/',
      image: '/press/paultan.png'
    },
    {
      outlet: 'Sinar Harian',
      url: 'https://www.sinarharian.com.my/article/203985/BERITA/Nasional/MIROS-bakal-uji-keberkesanan-sistem-MCAS',
      image: '/press/sinarharian.png'
    },
    {
      outlet: 'Careta',
      url: 'https://careta.my/article/miros-bekerjasama-dengan-plus-untuk-menguji-sistem-mcas',
      image: '/press/careta.png'
    }
  ];

  return (
    <section className="bg-black py-24 border-t border-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Clean, left-aligned title directly matching your reference */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-slate-100 tracking-wide">
            MCAS In The Press
          </h2>
        </div>

        {/* Horizontal Logo Flex Row */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-between gap-12 md:gap-6 mb-24">
          {articles.map((item, idx) => (
            <a 
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex justify-center items-center w-full sm:w-auto max-w-[160px] transition-all duration-300"
            >
              <img 
                src={item.image} 
                alt={item.outlet}
                className="max-h-14 w-auto object-contain filter grayscale contrast-125 opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </a>
          ))}
        </div>

        {/* Center-aligned Tagline with original gold highlights */}
        <div className="text-center max-w-4xl mx-auto pt-4">
          <p className="text-lg md:text-xl font-light tracking-wide text-slate-300 leading-relaxed">
            "With MCAS, we're not just <span className="text-amber-200/70 font-normal">selling a device</span> — we're <span className="text-amber-200/70 font-normal">saving seconds that could save lives.</span>"
          </p>
        </div>

      </div>
    </section>
  );
}