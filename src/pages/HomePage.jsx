import Hero from "../components/Hero";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import MobileAppSection from "../components/MobileAppSection";
import CTASection from "../components/CTASection";
import PartnersShowcase from "../components/PartnersShowcase";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <PartnersShowcase />
      <FeaturesSection />
      {/* <TestimonialsSection /> */}
      <MobileAppSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
