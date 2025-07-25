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

const InventoryMistakesBlogPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light to-green-100 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              8 Common Inventory Mistakes
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Learn about common inventory mistakes and how to avoid them
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
                  src="https://media.primarily.com/wp-content/uploads/2024/05/03190646/iStock-1284867257-290x155.jpg"
                  alt="Warehouse worker managing inventory"
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    1. Poor Inventory Organization
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    One of the most common mistakes is failing to organize
                    inventory properly. Without a clear system, items get lost,
                    duplicated, or forgotten entirely.
                  </p>
                  <div className="bg-primary-light p-4 sm:p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Solution:
                    </h4>
                    <p className="text-gray-600">
                      Implement a consistent categorization system and use
                      folders to group related items logically.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    2. Inaccurate Stock Counts
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Manual counting errors lead to stockouts, overordering, and
                    poor customer satisfaction.
                  </p>
                  <div className="bg-primary-light p-4 sm:p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Solution:
                    </h4>
                    <p className="text-gray-600">
                      Use barcode scanning and automated tracking to eliminate
                      human error in inventory counts.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    3. Lack of Real-Time Visibility
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Without real-time updates, teams make decisions based on
                    outdated information.
                  </p>
                  <div className="bg-primary-light p-4 sm:p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Solution:
                    </h4>
                    <p className="text-gray-600">
                      Choose an inventory system that provides instant updates
                      across all devices and locations.
                    </p>
                  </div>
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

export default InventoryMistakesBlogPage;
