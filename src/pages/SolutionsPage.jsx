import { Link } from "react-router-dom";
import SolutionHero from "../components/SolutionHero";
import SolutionToolkit from "../components/SolutionToolkit";
import SolutionTestimonials from "../components/SolutionTestimonials";
import SolutionCTA from "../components/SolutionCTA";

const SolutionsPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SolutionHero />
      <SolutionToolkit />
      <SolutionTestimonials />
      <SolutionCTA />
      {/* Other solution page sections/components will go here */}
    </div>
  );
};

export default SolutionsPage;
