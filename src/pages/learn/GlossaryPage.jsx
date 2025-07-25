import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TbArrowRight, 
  TbCheck, 
  TbStar, 
  TbUsers, 
  TbTrendingUp,
  TbShield,
  TbClock,
  TbDeviceMobile,
  TbBarcode,
  TbQrcode,
  TbBell,
  TbChartBar,
  TbSettings,
  TbBook2,
  TbHelpCircle,
  TbBulb,
  TbFileText
} from 'react-icons/tb';

const GlossaryPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light to-green-100 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Glossary
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Key terms and inventory management concepts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              >
                Get Started Free
                <TbArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/free-trial"
                className="border-primary text-primary hover:bg-primary-light px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center text-base sm:text-lg"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      {/* Glossary Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Inventory Management Terms
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Essential terminology for inventory management professionals
              </p>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-3">ABC Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  A method of categorizing inventory items based on their importance and value to prioritize management efforts.
                </p>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-3">Barcode</h3>
                <p className="text-gray-600 leading-relaxed">
                  A machine-readable code consisting of parallel lines that represents data about the item it's attached to.
                </p>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-3">Cycle Counting</h3>
                <p className="text-gray-600 leading-relaxed">
                  A method of auditing inventory by counting a small subset of inventory on a rotating schedule.
                </p>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-3">Dead Stock</h3>
                <p className="text-gray-600 leading-relaxed">
                  Inventory that has not sold and is unlikely to sell in the future, tying up capital and storage space.
                </p>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-3">Economic Order Quantity (EOQ)</h3>
                <p className="text-gray-600 leading-relaxed">
                  The optimal order quantity that minimizes total inventory costs including ordering and holding costs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="text-lg sm:text-xl text-green-100 mb-6 sm:mb-8 leading-relaxed">
              Join thousands of businesses using Primarily to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center text-base sm:text-lg"
              >
                Get Started Free
                <TbArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary-hover transition-colors inline-flex items-center justify-center text-base sm:text-lg"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlossaryPage;