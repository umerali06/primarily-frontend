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

const KnowledgeCenterPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light to-green-100 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Knowledge Center
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Help documentation and frequently asked questions
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

      
      {/* Knowledge Base Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How Can We Help?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Find answers to common questions and get the help you need
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <TbBulb className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center">Getting Started</h3>
                <p className="text-gray-600 text-center mb-4 sm:mb-6 leading-relaxed">
                  Learn how to set up your account and start tracking inventory
                </p>
                <Link
                  to="/help/getting-started"
                  className="text-primary hover:text-primary-hover font-medium inline-flex items-center justify-center w-full"
                >
                  View Articles <TbArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <TbDeviceMobile className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center">Mobile App</h3>
                <p className="text-gray-600 text-center mb-4 sm:mb-6 leading-relaxed">
                  Tips and tricks for using Primarily on mobile devices
                </p>
                <Link
                  to="/help/mobile-app"
                  className="text-primary hover:text-primary-hover font-medium inline-flex items-center justify-center w-full"
                >
                  View Articles <TbArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <TbSettings className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center">Account Settings</h3>
                <p className="text-gray-600 text-center mb-4 sm:mb-6 leading-relaxed">
                  Manage your account, billing, and team settings
                </p>
                <Link
                  to="/help/account-settings"
                  className="text-primary hover:text-primary-hover font-medium inline-flex items-center justify-center w-full"
                >
                  View Articles <TbArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="bg-primary-light rounded-2xl p-6 sm:p-8 lg:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    How do I add items to my inventory?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    You can add items manually through the dashboard or use our mobile app to scan barcodes and QR codes for quick entry.
                  </p>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-xl">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Can I track inventory across multiple locations?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, Primarily supports multi-location inventory tracking with real-time synchronization across all your sites.
                  </p>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-xl">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    How do I set up low stock alerts?
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Navigate to the item details and set your minimum stock level. You'll receive notifications when inventory falls below this threshold.
                  </p>
                </div>
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

export default KnowledgeCenterPage;