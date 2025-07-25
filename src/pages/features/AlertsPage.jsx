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

const AlertsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Alerts
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Simplify reordering with low stock and date-based alerts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary text-white px-8 py-4 rounded-lg font-semibold hover:btn-primary-hover transition-colors inline-flex items-center justify-center"
              >
                Get Started Free
                <TbArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/free-trial"
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary-light transition-colors inline-flex items-center justify-center"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Alerts?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the powerful features that make alerts the perfect solution for your business.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <TbCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
                <p className="text-gray-600">
                  Intuitive interface that anyone can master in minutes, not hours.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <TbTrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Scalable</h3>
                <p className="text-gray-600">
                  Grows with your business from startup to enterprise level.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <TbShield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure</h3>
                <p className="text-gray-600">
                  Enterprise-grade security to keep your data safe and protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Transform Your Alerts Process
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <TbCheck className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Save Time</h3>
                      <p className="text-gray-600">Reduce manual work and automate repetitive tasks.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TbCheck className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Increase Accuracy</h3>
                      <p className="text-gray-600">Eliminate human errors with automated tracking.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TbCheck className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Improve Visibility</h3>
                      <p className="text-gray-600">Get real-time insights into your operations.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TbCheck className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Reduce Costs</h3>
                      <p className="text-gray-600">Optimize inventory levels and reduce waste.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                    <TbChartBar className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-600 mb-6">
                    Join thousands of businesses already using Primarily to streamline their operations.
                  </p>
                  <Link
                    to="/signup"
                    className="btn-primary text-white px-6 py-3 rounded-lg font-semibold hover:btn-primary-hover transition-colors inline-flex items-center"
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
      <section className="py-20 btn-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Alerts?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Start your free trial today and see the difference Primarily can make.
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
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:btn-primary-hover transition-colors inline-flex items-center justify-center"
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

export default AlertsPage;