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

const PrimarilyUniversityPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light to-green-100 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Primarily University
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Expert tutorials and best practices for inventory management
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

      
      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Master Inventory Management
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Learn from experts with our comprehensive tutorials and best practices
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <TbBulb className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center">Getting Started</h3>
                <p className="text-gray-600 text-center mb-4 sm:mb-6 leading-relaxed">
                  Learn the basics of inventory management with Primarily
                </p>
                <Link
                  to="/learn/getting-started"
                  className="btn-primary w-full inline-flex items-center justify-center py-2 sm:py-3 text-sm sm:text-base"
                >
                  Start Learning
                </Link>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <TbBarcode className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center">Barcode Scanning</h3>
                <p className="text-gray-600 text-center mb-4 sm:mb-6 leading-relaxed">
                  Master barcode and QR code scanning techniques
                </p>
                <Link
                  to="/learn/barcode-scanning"
                  className="btn-primary w-full inline-flex items-center justify-center py-2 sm:py-3 text-sm sm:text-base"
                >
                  Learn More
                </Link>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <TbChartBar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center">Advanced Reports</h3>
                <p className="text-gray-600 text-center mb-4 sm:mb-6 leading-relaxed">
                  Create powerful reports and analytics
                </p>
                <Link
                  to="/learn/advanced-reports"
                  className="btn-primary w-full inline-flex items-center justify-center py-2 sm:py-3 text-sm sm:text-base"
                >
                  Explore
                </Link>
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

export default PrimarilyUniversityPage;