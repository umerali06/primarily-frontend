import React from "react";

const MobileAppSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left: iPhone image */}
        <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0">
          <img
            src="/mobileApp/iphone-cta-noshadow.png"
            alt="Primarily Mobile App"
            className="max-w-xs w-full h-auto drop-shadow-xl"
          />
        </div>
        {/* Right: Text and badges */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
            Inventory from anywhere.
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-md">
            Our top-rated mobile app makes it easy to inventory anywhere—even
            when you’re offline.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <a
              href="https://apps.apple.com/us/app/primarily/id529353551"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/mobileApp/app-store.svg"
                alt="Download on the App Store"
                className="w-full h-12 object-contain"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.primarily.primarily"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/mobileApp/google-play.svg"
                alt="Get it on Google Play"
                className="w-full h-12 object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
