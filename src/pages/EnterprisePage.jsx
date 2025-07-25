import EnterpriseLeadForm from "../components/EnterpriseLeadForm";
import EnterpriseFeatures from "../components/EnterpriseFeatures";
import EnterpriseTabs from "../components/EnterpriseTabs";
import EnterpriseUnisonSection from "../components/EnterpriseUnisonSection";

const EnterprisePage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <EnterpriseLeadForm />
      <EnterpriseFeatures />
      <EnterpriseTabs />
      <EnterpriseUnisonSection />
      {/* Other enterprise page sections/components will go here */}
    </div>
  );
};

export default EnterprisePage;
