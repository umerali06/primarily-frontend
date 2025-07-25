import { Link } from "react-router-dom";

const SolutionCTA = () => (
  <section className="py-20 px-4 bg-white">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
        Experience the simplest inventory
        <br className="hidden md:inline" /> management software.
      </h2>
      <p className="text-lg text-gray-700 mb-10">
        Ready to optimize how your business tracks inventory, assets, and
        consumables?
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
    </div>
  </section>
);

export default SolutionCTA;
