import React from "react";
import { Link } from "react-router-dom";
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
  TbFileText,
} from "react-icons/tb";

const BarcodesVsQRCodesBlogPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light to-green-100 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Barcodes vs QR Codes
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Comparing barcodes and QR codes for inventory management
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

      {/* Article Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg sm:prose-xl max-w-none">
              <div className="mb-8 sm:mb-12">
                <img
                  src="https://media.primarily.com/wp-content/uploads/2024/02/28193332/iStock-1311355201-290x155.jpg"
                  alt="Phone scanning barcode"
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Understanding Barcodes
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Traditional barcodes have been the standard for inventory
                    tracking for decades. They're reliable, cost-effective, and
                    widely supported across different systems.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-green-50 p-4 sm:p-6 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <TbCheck className="w-5 h-5 text-green-600 mr-2" />
                        Pros
                      </h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Low cost to implement</li>
                        <li>• Universal compatibility</li>
                        <li>• Proven reliability</li>
                        <li>• Fast scanning</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 sm:p-6 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Cons</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Limited data capacity</li>
                        <li>• Requires line of sight</li>
                        <li>• Can be damaged easily</li>
                        <li>• One-dimensional only</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    The Power of QR Codes
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    QR codes offer more flexibility and data storage capacity,
                    making them ideal for modern inventory management needs.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-green-50 p-4 sm:p-6 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <TbCheck className="w-5 h-5 text-green-600 mr-2" />
                        Pros
                      </h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• High data capacity</li>
                        <li>• Error correction</li>
                        <li>• 360° scanning</li>
                        <li>• Smartphone compatible</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 sm:p-6 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Cons</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Slightly higher cost</li>
                        <li>• Requires more space</li>
                        <li>• Less universal adoption</li>
                        <li>• May need better cameras</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-light p-6 sm:p-8 rounded-2xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Which Should You Choose?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    The choice depends on your specific needs. For simple item
                    identification, barcodes are sufficient. For complex
                    inventory with multiple data points, QR codes offer more
                    flexibility. Primarily supports both, so you can use the
                    best option for each situation.
                  </p>
                </div>
              </div>
            </article>
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
              Join thousands of businesses using Primarily to streamline their
              operations.
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

export default BarcodesVsQRCodesBlogPage;
