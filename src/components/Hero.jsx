import { Link } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleLoad = () => {
    setVideoLoaded(true);
  };

  const handleError = () => {
    setVideoError(true);
  };

  return (
    <section className="bg-gray-50 pt-16 pb-12 overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Badges Row */}
        <div className="flex flex-nowrap justify-center items-center gap-8 mb-10 max-w-screen-md mx-auto overflow-x-auto">
          <img
            src="/Americas_HighPerformer.svg"
            alt="High Performer Americas"
            className="h-30 w-auto"
          />
          <img
            src="/high-perfeormance-winter.svg"
            alt="High Performer Winter"
            className="h-30 w-auto"
          />
          <img
            src="/high-grammer-americas.svg"
            alt="High Grammer Americas"
            className="h-30 w-auto"
          />
          <img
            src="/high-grammer.svg"
            alt="High Grammer"
            className="h-30 w-auto"
          />
        </div>
        {/* Heading and Paragraph */}
        <div className="text-center mb-8">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-2">
            <span className="text-[#0a7662] block">Simple</span>
            <span className="text-gray-900 block">
              Inventory Management Software.
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            The best inventory software for small businesses to manage their
            physical inventory, including supplies, materials, tools, and
            equipment.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-12">
          <Link
            to="/signup"
            className="bg-[#0a7662] hover:bg-[#075c4c] text-white font-semibold py-3 px-8 rounded-full text-base shadow text-center transition-colors"
          >
            Try Primarily Free
          </Link>
          <Link
            to="/pricing"
            className="border border-[#0a7662] text-[#0a7662] hover:text-[#0a7662] hover:border-[#0a7662] font-semibold py-3 px-8 rounded-full text-base bg-white text-center transition-colors"
          >
            See All Plans
          </Link>
        </div>
        {/* Video */}
        <div className="flex justify-center mb-8 px-4">
          <div className="w-full max-w-4xl rounded-xl shadow-xl overflow-hidden bg-gray-100 relative">
            {/* Loading state */}
            {!videoLoaded && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            {/* Error state */}
            {videoError && (
              <div className="aspect-video flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Video Unavailable
                </h3>
                <p className="text-gray-600 max-w-md">
                  We couldn't load the video. Please try again later or check
                  the URL.
                </p>
                <button
                  onClick={() => {
                    setVideoError(false);
                    setVideoLoaded(false);
                  }}
                  className="mt-4 px-4 py-2 bg-[#0a7662] text-white rounded-lg hover:bg-[#075c4c] transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
            {/* Video iframe - only show when not in error state */}
            {!videoError && (
              <div className="relative pb-[56.25%] h-0 overflow-hidden">
                {/* 16:9 aspect ratio */}
                <iframe
                  src="https://www.youtube.com/embed/5ioh6O-gCGM?autoplay=0&rel=0"
                  title="Primarily Walkthrough"
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
                    videoLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={handleLoad}
                  onError={handleError}
                  loading="lazy"
                />
              </div>
            )}
            {/* Video caption */}
            <div className="p-4 bg-white">
              <h3 className="text-lg font-medium text-gray-900">
                Primarily Product Walkthrough
              </h3>
              <p className="text-gray-600 mt-1">
                Learn how to use Primarily in just 5 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
