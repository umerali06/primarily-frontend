import { useState } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    logo: (
      <svg
        width="90"
        height="28"
        viewBox="0 0 90 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          GetApp
        </text>
      </svg>
    ),
    text: `"Overall, I'm extremely happy with the software. Its created efficiency within my business and has saved me a lot of money on part runs for items that we already had in inventory. I would highly recommend this software."`,
    author: "James K.",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="100"
        height="28"
        viewBox="0 0 100 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          Capterra
        </text>
      </svg>
    ),
    text: `"Primarily has revolutionized our inventory tracking... Adding Primarily was one of the greatest things that we've done in my department to create efficiency."`,
    author: "Scott M.",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="100"
        height="28"
        viewBox="0 0 100 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          Capterra
        </text>
      </svg>
    ),
    text: `"Pictures say it all. Every item has a picture so they are very easily identifiable. The ability to use Primarily on all mobile devices is perfect for what we do. It's the best app on the market for inventory."`,
    author: "Dusty S.",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="90"
        height="28"
        viewBox="0 0 90 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          GetApp
        </text>
      </svg>
    ),
    text: `"It has been wonderful and made my work life so much easier. I'd recommend to anyone or company. Keep up the great work Primarily team!"`,
    author: "Jason J.",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="100"
        height="28"
        viewBox="0 0 100 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          Capterra
        </text>
      </svg>
    ),
    text: `"This has changed my job as manager of Inventory for an office space! It is so much easier to get things sorted when they can be counted in a flash, instead of having to use an excel spreadsheet."`,
    author: "Lisa D.",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="80"
        height="28"
        viewBox="0 0 80 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          G2 CROWD
        </text>
      </svg>
    ),
    text: `"I honestly love the fact that I am able to monitor the in and out of each medication and clinical item used. The exporting to excel is nice to use in regards to trending metrics in regards to intake and out."`,
    author: "Ron G.",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="100"
        height="28"
        viewBox="0 0 100 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          Capterra
        </text>
      </svg>
    ),
    text: `"I've been a customer since [Primarily's] first year. They have kept up a clean responsive product that has also evolved as my company has. I can't imagine running my inventory on a clunkier or messier system. It's easy to use and integrates well in my business. QR codes are a game changer and helps keep me away from messy, tedious spreadsheets. Their portal for upvoting and requesting features with progress on if they are considering or implementing them is fantastic, as they actually do implement those changes."`,
    author: "Tim T.",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="90"
        height="28"
        viewBox="0 0 90 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          GetApp
        </text>
      </svg>
    ),
    text: `"I searched through several inventory software programs and none were designed with the user in mind like Primarily. The program and application are fast and intuitive!"`,
    author: "Ben W.",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="100"
        height="28"
        viewBox="0 0 100 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          Capterra
        </text>
      </svg>
    ),
    text: `"Very easy to use. Added items is very easy. I like the notification alert for low inventory."`,
    author: "Nancy R.",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="100"
        height="28"
        viewBox="0 0 100 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          Capterra
        </text>
      </svg>
    ),
    text: `"Primarily makes hard finds easy finds. Apart from a few things I had in my work shed, I had no idea of what stock I had. Primarily helped me get my electrical gear in order. After inputting my stock into Primarily, I now have $20K of stock I didn't know I had."`,
    author: "Matthew T.",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="100"
        height="28"
        viewBox="0 0 100 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          Capterra
        </text>
      </svg>
    ),
    text: `"Primarily makes hard finds easy finds. Apart from a few things I had in my work shed, I had no idea of what stock I had. Primarily helped me get my electrical gear in order. After inputting my stock into Primarily, I now have $20K of stock I didn't know I had."`,
    author: "Matthew T., Electrical Contractor",
    rating: 5,
  },
  {
    logo: (
      <svg
        width="110"
        height="28"
        viewBox="0 0 110 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 mb-2"
      >
        <text x="0" y="20" fontSize="20" fontWeight="bold" fill="#222">
          Google Play
        </text>
      </svg>
    ),
    text: `"This app is way better than five stars — deserves 10 stars."`,
    author: "Faith G.",
    rating: 5,
  },
];

const SolutionTestimonials = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleTestimonials = showAll ? testimonials : testimonials.slice(0, 9);

  return (
    <section className="bg-white py-16 px-4 mx-auto">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 text-center">
          Primarily customer reviews and testimonials.
        </h2>
        <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl mx-auto">
          We're proud to be an industry-leading solution trusted by thousands of
          businesses.
        </p>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 max-w-5xl mx-auto">
          {visibleTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#f6f2ef] rounded-2xl p-7 flex flex-col items-center text-center shadow-sm min-h-[320px] mb-8 break-inside-avoid"
            >
              {t.logo}
              <FaQuoteLeft className="text-gray-700 text-3xl mb-3" />
              <p className="text-gray-900 text-base mb-6 font-medium">
                {t.text}
              </p>
              <div className="font-semibold text-gray-800 mb-3 italic">
                {t.author}
              </div>
              <div className="flex gap-1 justify-center">
                {[...Array(t.rating)].map((_, i) => (
                  <FaStar key={i} className="text-gray-800 w-5 h-5" />
                ))}
              </div>
            </div>
          ))}
        </div>
        {testimonials.length > 9 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="px-8 py-3 rounded-full bg-[#0a7662] text-white font-semibold text-base shadow hover:bg-[#075c4c] transition-colors focus:outline-none focus:ring-2 focus:ring-primarily-400"
            >
              {showAll ? "Show less" : "Show more reviews"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SolutionTestimonials;
