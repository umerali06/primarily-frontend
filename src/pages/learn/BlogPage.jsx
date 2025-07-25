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

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light to-green-100 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Blog
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Latest articles and expert insights from Primarily
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

      
      {/* Featured Articles */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Latest Articles
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Expert insights and tips for better inventory management
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <Link
                to="/blog/inventory-mistakes"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src="https://media.primarily.com/wp-content/uploads/2024/05/03190646/iStock-1284867257-290x155.jpg"
                    alt="Warehouse worker"
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    8 Common Inventory Mistakes
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Learn about the most common inventory management mistakes and how to avoid them in your business.
                  </p>
                </div>
              </Link>
              
              <Link
                to="/blog/barcodes-vs-qrcodes"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src="https://media.primarily.com/wp-content/uploads/2024/02/28193332/iStock-1311355201-290x155.jpg"
                    alt="Phone scanning barcode"
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    Barcodes vs. QR Codes
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Compare the benefits and drawbacks of barcodes versus QR codes for inventory management.
                  </p>
                </div>
              </Link>
              
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden sm:col-span-2 lg:col-span-1">
                <div className="relative">
                  <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                    <TbTrendingUp className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    More Articles Coming Soon
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We're constantly adding new content to help you master inventory management.
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

export default BlogPage;