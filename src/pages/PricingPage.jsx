import PricingPlans from "../components/PricingPlans";
import PricingComparisonTable from "../components/PricingComparisonTable";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PricingPlans />
      <PricingComparisonTable />
      {/* Other pricing page sections/components will go here */}
    </div>
  );
};

export default PricingPage;
