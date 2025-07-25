import {
  FiFacebook,
  FiX,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
} from "react-icons/fi";

const industries = [
  "Construction",
  "Medical",
  "Warehouse",
  "Electrical",
  "Interior Design",
  "Automotive",
  "Dental",
  "Events",
  "Non-Profit",
  "Education",
  "Retail",
  "Antiques",
  "Government",
  "Aviation",
  "View All",
];
const uses = [
  "Inventory Management",
  "Supplies & Consumables Tracking",
  "Asset Tracking",
  "Parts Tracking",
  "Raw Materials Tracking",
  "Tool Tracking",
  "Equipment Tracking",
  "PPE Tracking",
  "IT Asset Tracking",
  "Selling & Ecommerce Inventory Tracking",
  "Barcode Inventory",
  "Inventory App",
  "Home Inventory Management",
  "View All",
];
const info = [
  "Pricing",
  "Talk to an Expert",
  "Blog",
  "Glossary",
  "About Us",
  "Reviews",
  "Contact Us",
  "Careers",
  "Help Center",
  "Status",
  "Terms of Service",
  "Privacy Policy",
];

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Centered logo and content container */}
        <div className="flex flex-col items-center lg:items-start">
          {/* Logo - centered on mobile, left-aligned on desktop */}
          <div className="mb-8 lg:mb-0 flex-shrink-0">
            <img
              src="/footer/primarily-logo-white.svg"
              alt="Primarily"
              className="h-10 mb-6 mx-auto lg:mx-0"
            />
          </div>

          {/* Grid container - centered on mobile, left-aligned on desktop */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 justify-items-center lg:justify-items-start">
            {/* Industries */}
            <div className="w-full max-w-[200px]">
              <h4 className="font-bold mb-4 text-center lg:text-left">
                Industries
              </h4>
              <ul className="space-y-2 text-center lg:text-left">
                {industries.map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-[#075c4c] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Uses */}
            <div className="w-full max-w-[200px]">
              <h4 className="font-bold mb-4 text-center lg:text-left">Uses</h4>
              <ul className="space-y-2 text-center lg:text-left">
                {uses.map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-[#075c4c] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div className="w-full max-w-[200px]">
              <h4 className="font-bold mb-4 text-center lg:text-left">
                Information
              </h4>
              <ul className="space-y-2 text-center lg:text-left">
                {info.map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-[#075c4c] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Download + Newsletter Section */}
            <div className="flex flex-col gap-6 w-full col-span-2">
              {/* Download Section */}
              <div className="w-full flex flex-col gap-4 text-center lg:text-left">
                <h4 className="font-bold mb-4">Download</h4>
                <div className="flex gap-4 justify-center lg:justify-start">
                  <a
                    href="https://apps.apple.com/us/app/primarily/id529353551"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/footer/app-store (1).svg"
                      alt="App Store"
                      className="h-10"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.primarily.primarily"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/footer/google-play.svg"
                      alt="Google Play"
                      className="h-10"
                    />
                  </a>
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="w-full text-center lg:text-left">
                <h4 className="font-bold mb-2">Become an Inventory Insider:</h4>
                <p className="mb-4 text-sm text-white/80">
                  All the inventory news & insights you need, delivered straight
                  to your inbox every week.
                </p>
                <form className="flex flex-col gap-3 items-center lg:items-start">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="rounded-lg px-4 py-3 text-black bg-white w-full max-w-[300px]"
                  />
                  <button
                    type="submit"
                    className="bg-white text-black rounded-full px-6 py-2 font-semibold hover:bg-[#0a7662] hover:text-white transition-colors"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-white/10 pt-6">
          <div className="text-xs text-white/70 text-center md:text-left">
            ©2025 Primarily Inc. All rights reserved. All other logos and
            trademarks are the property of their respective owners.
            <br />
            All prices shown on the website and in product are in USD.
          </div>
          <div className="flex gap-6 text-2xl justify-center md:justify-start">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-[#075c4c] transition-colors"
            >
              <FiFacebook />
            </a>
            <a
              href="#"
              aria-label="X"
              className="hover:text-[#075c4c] transition-colors"
            >
              <FiX />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-[#075c4c] transition-colors"
            >
              <FiInstagram />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-[#075c4c] transition-colors"
            >
              <FiLinkedin />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="hover:text-[#075c4c] transition-colors"
            >
              <FiYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
