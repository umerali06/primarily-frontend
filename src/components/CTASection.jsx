import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section id="try-primarily-inventory-software-free-for-14-days" className="py-16 bg-[#0a7662] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Try Primarily inventory software free for 14 days.
        </h2>
        <p className="text-lg mb-10 max-w-2xl mx-auto">
          Track your inventory, supplies, materials, and tools with Primarily and run a more efficient business.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/signup" 
            className="bg-white text-[#0a7662] hover:bg-gray-100 transition-colors py-3 px-8 rounded-full font-medium text-center"
          >
            Try Free for 14 Days
          </Link>
          <Link 
            to="/demo" 
            className="border border-white text-white hover:bg-[#075c4c] transition-colors py-3 px-8 rounded-full font-medium text-center"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;