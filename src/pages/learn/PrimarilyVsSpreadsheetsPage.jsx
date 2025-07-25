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
  TbSettings
} from 'react-icons/tb';

const PrimarilyVsSpreadsheetsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Primarily vs. Spreadsheets
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Why Primarily is the superior choice for modern inventory management compared to traditional spreadsheets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary inline-flex items-center justify-center"
              >
                Get Started Free
                <TbArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/free-trial"
                className="border-primary text-primary hover:bg-primary-light px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Primarily vs. Spreadsheets: Side-by-Side Comparison
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See why thousands of businesses are switching from spreadsheets to Primarily
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold">Spreadsheets</th>
                      <th className="px-6 py-4 text-center font-semibold">Primarily</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">Real-time Updates</td>
                      <td className="px-6 py-4 text-center text-red-600">❌ Manual updates only</td>
                      <td className="px-6 py-4 text-center text-primary">✅ Automatic real-time sync</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">Mobile Access</td>
                      <td className="px-6 py-4 text-center text-red-600">❌ Limited mobile functionality</td>
                      <td className="px-6 py-4 text-center text-primary">✅ Full mobile app</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">Barcode Scanning</td>
                      <td className="px-6 py-4 text-center text-red-600">❌ Not available</td>
                      <td className="px-6 py-4 text-center text-primary">✅ Built-in scanner</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">Team Collaboration</td>
                      <td className="px-6 py-4 text-center text-yellow-600">⚠️ Version conflicts</td>
                      <td className="px-6 py-4 text-center text-primary">✅ Seamless collaboration</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">Data Security</td>
                      <td className="px-6 py-4 text-center text-red-600">❌ Basic file protection</td>
                      <td className="px-6 py-4 text-center text-primary">✅ Enterprise-grade security</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">Automated Alerts</td>
                      <td className="px-6 py-4 text-center text-red-600">❌ Manual monitoring</td>
                      <td className="px-6 py-4 text-center text-primary">✅ Smart notifications</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">Scalability</td>
                      <td className="px-6 py-4 text-center text-red-600">❌ Performance degrades</td>
                      <td className="px-6 py-4 text-center text-primary">✅ Scales infinitely</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Why Businesses Choose Primarily Over Spreadsheets
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <TbCheck className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Save 10+ Hours Per Week</h3>
                      <p className="text-gray-600">Eliminate manual data entry and spreadsheet maintenance.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TbCheck className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">99.9% Accuracy</h3>
                      <p className="text-gray-600">Eliminate human errors with automated tracking and validation.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TbCheck className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Real-time Visibility</h3>
                      <p className="text-gray-600">Get instant insights across all locations and team members.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TbCheck className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Reduce Costs by 30%</h3>
                      <p className="text-gray-600">Optimize inventory levels and prevent stockouts/overstock.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                    <TbChartBar className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Upgrade?</h3>
                  <p className="text-gray-600 mb-6">
                    Join 10,000+ businesses that switched from spreadsheets to Primarily.
                  </p>
                  <Link
                    to="/signup"
                    className="btn-primary inline-flex items-center"
                  >
                    Start Free Trial
                    <TbArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Leave Spreadsheets Behind?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Start your free trial today and experience the Primarily difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Get Started Free
                <TbArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-hover transition-colors inline-flex items-center justify-center"
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

export default PrimarilyVsSpreadsheetsPage;