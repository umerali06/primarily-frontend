import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { FiRotateCw } from "react-icons/fi";
import { BiFullscreen } from "react-icons/bi";

const VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4"; // Replace with your video URL if needed

const FeaturedHero = () => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  return (
    <section className="bg-white pt-16 pb-12 overflow-x-hidden">
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-2 leading-tight">
          Explore Our Inventory
          <br />
          Management <span className="text-[#0a7662]">Features</span>
        </h1>
        {/* Paragraph */}
        <p className="text-lg text-gray-700 max-w-2xl mx-auto text-center mb-8">
          Discover how Primarily simplifies inventory with features designed for
          ease and organization.
        </p>
        {/* Buttons Row */}
        <div className="flex flex-row gap-6 mb-10 justify-center items-center">
          <Link
            to="/signup"
            className="bg-[#0a7662] hover:bg-[#075c4c] text-white font-semibold py-3 px-8 rounded-full transition-colors text-base shadow-md text-center"
          >
            Start a Free Trial
          </Link>
          <Link
            to="/plans"
            className="flex items-center text-[#0a7662] font-semibold text-base hover:text-[#0a7662] transition-colors"
          >
            See All Plans <FiArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        {/* Video Section */}
        <div className="w-full flex justify-center">
          <div
            className="overflow-hidden relative shrink-0 opacity-100 transition-opacity transform-gpu duration-300 rounded-lg"
            style={{ width: "100%", maxWidth: 1068 }}
          >
            {/* Top Bar */}
            <div
              className="relative w-full flex overflow-hidden bg-gray-800"
              style={{ height: 41, zIndex: 400 }}
            >
              {/* Left dots */}
              <div
                className="flex-[1_1_33%] h-full px-2 sm:px-3 flex items-center gap-3 relative"
                style={{ zIndex: 0 }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex rounded-full h-2.5 w-2.5 bg-white/30" />
                  <div className="flex rounded-full h-2.5 w-2.5 bg-white/20" />
                  <div className="flex rounded-full h-2.5 w-2.5 bg-white/10" />
                </div>
              </div>
              {/* Center label */}
              <div className="flex-[1_1_33%] max-w-[40%] md:max-w-60 self-center flex items-center justify-center">
                <div className="flex items-center w-full max-w-full justify-center relative h-7 rounded-lg py-1 px-10 -mt-px bg-white/10 text-gray-300">
                  <div className="flex items-center w-full justify-center px-0">
                    <span
                      className="truncate relative focus:outline-none font-sans text-xs font-medium"
                      role="heading"
                      aria-level="1"
                      aria-label="Primarily Features"
                    >
                      Primarily Features
                    </span>
                  </div>
                  {/* Replay icon */}
                  <button
                    className="flex transition-all group cursor-pointer text-gray-400 absolute right-[3px] hover:bg-white hover:shadow-menu shadow-none w-[22px] h-[22px] items-center justify-center p-0 rounded-md"
                    aria-label="Replay"
                    onClick={handleReplay}
                    type="button"
                  >
                    <FiRotateCw className="w-3.5 h-3.5 group-hover:text-gray-900" />
                  </button>
                </div>
              </div>
              {/* Fullscreen icon */}
              <div
                className="h-full flex-[1_1_33%] flex items-center justify-end px-2 gap-0.5"
                style={{ zIndex: 0 }}
              >
                <button
                  className="flex p-1.5 items-center rounded-lg transition-all group cursor-pointer text-gray-400 hover:bg-white/20"
                  aria-label="Open in fullscreen mode"
                  onClick={handleFullscreen}
                  type="button"
                >
                  <BiFullscreen className="w-3.5 h-3.5 group-hover:text-gray-200" />
                </button>
              </div>
            </div>
            {/* Video Stage */}
            <div
              className="stage-container relative w-full group/stage bg-black"
              style={{ width: "100%", maxWidth: 1068, height: 522 }}
            >
              <div className="flex w-full h-full">
                <div className="w-full h-full rounded-b-lg overflow-hidden">
                  {/* Loading state */}
                  {!videoLoaded && !videoError && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  )}
                  {/* Error state */}
                  {videoError && (
                    <div className="flex flex-col items-center justify-center bg-black h-full p-6 text-center">
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
                        We couldn't load the video. Please try again later or
                        check the URL.
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
                  {/* Video element */}
                  {!videoError && (
                    <video
                      ref={videoRef}
                      className={`w-full h-full object-cover bg-black transition-opacity duration-300 ${
                        videoLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      src={VIDEO_URL}
                      poster="https://image.mux.com/mvtXqlof267Q6dmyWZajFLF500Sefhf5VDvg7Qd6W1rQ/thumbnail.png?time=6.835059777197069"
                      controls
                      playsInline
                      preload="metadata"
                      style={{ minWidth: "100%", maxHeight: "100%" }}
                      onLoadedData={() => setVideoLoaded(true)}
                      onError={() => setVideoError(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHero;
