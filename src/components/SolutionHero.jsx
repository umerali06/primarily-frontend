import { Link } from "react-router-dom";

const SolutionHero = () => {
  return (
    <section className="w-full bg-white flex flex-col lg:flex-row items-stretch min-h-[420px]">
      {/* Left: Text Content */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-24 py-12">
        <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-1">&gt;</span>
          <span className="text-[#0a7662] font-medium">Solutions</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          Primarily <span className="text-[#0a7662]">Solutions.</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-xl">
          No matter what you need to track, Primarily has you covered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="bg-[#0a7662] hover:bg-[#075c4c] text-white font-semibold py-3 px-8 rounded-full text-base shadow-md text-center transition-colors"
          >
            Start a Free Trial
          </Link>
          <Link
            to="/pricing"
            className="flex items-center justify-center text-[#0a7662] hover:text-[#0a7662] font-semibold py-3 px-8 rounded-full text-base border border-[#0a7662] bg-white transition-colors"
          >
            See All Plans
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
      {/* Right: Hero Image */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8 bg-transparent">
        <img
          src="/solution/hero_IT-950x606.png"
          alt="Primarily Solutions Hero"
          className="max-w-full w-[420px] md:w-[500px] lg:w-[420px] xl:w-[500px] rounded-2xl shadow-xl object-cover"
          loading="eager"
        />
      </div>
    </section>
  );
};

export default SolutionHero;
