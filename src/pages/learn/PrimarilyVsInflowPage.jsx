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

const PrimarilyVsInflowPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Primarily vs. InFlow
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Compare features, pricing, and capabilities between Primarily and InFlow inventory management solutions
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

      {/* Feature Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Feature Comparison: Primarily vs. InFlow
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how Primarily stacks up against InFlow across key features
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold">InFlow</th>
                      <th className="px-6 py-4 text-center font-semibold">Primarily</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">Mobile App</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-gray-300 mr-1" />
                          <TbStar className="w-4 h-4 text-gray-300" />
                        </div>
                        <span className="text-sm text-gray-600">Basic mobile access</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-sm text-primary">Full-featured mobile app</span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">Barcode Scanning</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-gray-300 mr-1" />
                          <TbStar className="w-4 h-4 text-gray-300" />
                        </div>
                        <span className="text-sm text-gray-600">External scanner required</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-sm text-primary">Built-in camera scanning</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">User Interface</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-gray-300 mr-1" />
                          <TbStar className="w-4 h-4 text-gray-300" />
                        </div>
                        <span className="text-sm text-gray-600">Traditional desktop UI</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-sm text-primary">Modern, intuitive design</span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">Real-time Sync</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-gray-300 mr-1" />
                          <TbStar className="w-4 h-4 text-gray-300 mr-1" />
                          <TbStar className="w-4 h-4 text-gray-300" />
                        </div>
                        <span className="text-sm text-gray-600">Periodic sync</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <TbStar className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-sm text-primary">Instant real-time updates</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">Pricing</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-semibold text-gray-900">$89/month</span>
                        <br />
                        <span className="text-sm text-gray-600">Per user</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-semibold text-primary">$29/month</span>
                        <br />
                        <span className="text-sm text-primary">Unlimited users</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Primarily */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Businesses Switch from InFlow to Primarily
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <TbDeviceMobile className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Better Mobile Experience</h3>
                <p className="text-gray-600">
                  Full-featured mobile app that works offline and syncs automatically.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <TbUsers className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Unlimited Users</h3>
                <p className="text-gray-600">
                  No per-user fees. Add your entire team without worrying about costs.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <TbTrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Technology</h3>
                <p className="text-gray-600">
                  Built with modern web technologies for speed and reliability.
                </p>
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
              Ready to Switch from InFlow to Primarily?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join hundreds of businesses that made the switch and never looked back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Start Free Migration
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

export default PrimarilyVsInflowPage;