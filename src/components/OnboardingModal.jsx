import React from "react";

const OnboardingModal = ({
  GREEN,
  userName,
  handleSkipTour,
  handleStartTour,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center relative animate-fadeIn">
      <img src="/tour/organize.svg" alt="Tour" className="h-32 mb-4" />
      <h2
        className="text-2xl font-bold text-center mb-2"
        style={{ color: GREEN.main }}
      >
        Hello {userName}, Organize Like Never Before with Primarily!
      </h2>
      <p className="text-gray-700 text-center mb-6">
        Create flexible folders that match how you think—nest subfolders, track
        items, and set alerts effortlessly. Your inventory, your way. Ready to
        start?
      </p>
      <div className="flex gap-4 w-full justify-center">
        <button
          className="px-6 py-2 rounded font-semibold text-base border border-primary text-primary bg-white hover:bg-primary-light"
          onClick={handleSkipTour}
        >
          Explore myself
        </button>
        <button
          className="px-6 py-2 rounded font-semibold text-base border btn-primary text-white hover:btn-primary-hover shadow"
          onClick={handleStartTour}
        >
          Start tour
        </button>
      </div>
    </div>
  </div>
);

export default OnboardingModal;
