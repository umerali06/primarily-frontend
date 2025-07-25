import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const TryPrimarilySection = () => {
  return (
    <section className="w-full flex justify-center py-12">
      <div className="bg-gray-100 rounded-2xl px-6 py-10 w-full max-w-3xl flex flex-col items-center shadow-sm">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-3">
          Try Primarily free for 14 days.
        </h2>
        <p className="text-base text-gray-700 text-center mb-6 max-w-md">
          Transform your business with our simple, powerful inventory solution.
        </p>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="btn-primary font-semibold py-2 px-6 rounded-full transition-colors text-base shadow-md text-center"
          >
            Start a Free Trial
          </Link>
          <Link
            to="/plans"
            className="flex items-center text-primary font-semibold text-base hover:text-primary transition-colors"
          >
            See All Plans <FiArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TryPrimarilySection;
