import React from "react";

const PartnersShowcase = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-4xl font-extrabold text-center mb-10 leading-tight">
          Over <span className="text-[#0a7662]">15,000</span> businesses trust
          Primarily
          <br className="hidden md:inline" /> to track their inventory.
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <img
            src="/showcase/it_schneider.png"
            alt="Schneider Electric"
            className="h-10 md:h-14 grayscale object-contain"
          />
          <img
            src="/showcase/retail_sephora.png"
            alt="Sephora"
            className="h-10 md:h-14 grayscale object-contain"
          />
          <img
            src="/showcase/chewy.png"
            alt="Chewy"
            className="h-10 md:h-14 grayscale object-contain"
          />
          <img
            src="/showcase/construction_kiewet.png"
            alt="Kiewit"
            className="h-10 md:h-14 grayscale object-contain"
          />
          <img
            src="/showcase/retail_terminix.png"
            alt="Terminix"
            className="h-10 md:h-14 grayscale object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default PartnersShowcase;
