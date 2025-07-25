import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiSmartphone,
  FiUsers,
  FiFileText,
  FiStar,
  FiHelpCircle,
  FiBook,
  FiBox,
  FiTruck,
  FiBriefcase,
  FiHome,
  FiActivity,
  FiLayers,
  FiClipboard,
  FiCheckCircle,
  FiTag,
  FiGlobe,
  FiAward,
  FiUsers as FiUsersAlt,
  FiTool,
  FiMonitor,
  FiShoppingCart,
  FiBookOpen as FiBookOpenAlt,
} from "react-icons/fi";
import { HiOutlineQrcode } from "react-icons/hi";
import {
  TbBellRinging,
  TbBuildingWarehouse,
  TbSchool,
  TbMedicalCross,
  TbPlug,
  TbBulb,
  TbHome,
  TbUsersGroup,
  TbReportAnalytics,
  TbTruckDelivery,
  TbBuildingFactory2,
  TbHeartHandshake,
  TbBuildingBank,
  TbShoppingBag,
  TbDeviceMobile,
  TbBarcode,
  TbAlertTriangle,
  TbChartBar,
  TbLayersIntersect,
  TbSettings,
  TbAward,
  TbBook2,
  TbHelpCircle,
  TbClipboardList,
  TbCalendarEvent,
  TbCamera,
  TbEdit,
  TbPhone,
  TbMail,
  TbWorld,
} from "react-icons/tb";
import { BiLinkExternal } from "react-icons/bi";
import { VscGraph } from "react-icons/vsc";
import { IoChevronDown, IoClose } from "react-icons/io5";
import { BsUpcScan, BsPlayFill } from "react-icons/bs";
import "./Navbar.css";
import PrimarilyLogo from "./PrimarilyLogo";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

  // Close all dropdowns when clicking outside (optional, for better UX)
  // ... existing code ...

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFeatures = () => {
    setFeaturesOpen(!featuresOpen);
    if (solutionsOpen) setSolutionsOpen(false);
    if (learnOpen) setLearnOpen(false);
  };

  const toggleSolutions = () => {
    setSolutionsOpen(!solutionsOpen);
    if (featuresOpen) setFeaturesOpen(false);
    if (learnOpen) setLearnOpen(false);
  };

  const toggleLearn = () => {
    setLearnOpen(!learnOpen);
    if (featuresOpen) setFeaturesOpen(false);
    if (solutionsOpen) setSolutionsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className={`flex-shrink-0 flex items-center h-10 ${
            isMenuOpen ? "lg:flex hidden" : ""
          }`}
        >
          <PrimarilyLogo className="h-8" />
        </Link>
        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex space-x-8 items-center">
            {/* Features Dropdown */}
            <li className="relative group">
              <button
                onClick={toggleFeatures}
                className={`flex items-center px-2 py-1 transition-colors duration-150 ${
                  featuresOpen
                    ? "text-primary"
                    : "text-gray-800 hover:text-primary-hover"
                }`}
                aria-expanded={featuresOpen}
              >
                Features
                <IoChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                    featuresOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              <div
                className={`full-width-dropdown ${
                  featuresOpen ? "block" : "hidden md:group-hover:block"
                }`}
              >
                <div className="dropdown-container">
                  <div className="dropdown-title-column">
                    <Link
                      to="/features"
                      className="flex items-center text-2xl font-bold mb-3 text-gray-900 hover:text-primary-hover"
                    >
                      Features <FiArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <p className="text-base text-gray-600 mb-4">
                      Discover how Primarily simplifies inventory with features
                      designed for ease and organization.
                    </p>
                    <Link
                      to="/features"
                      className="flex items-center text-primary hover:text-primary font-medium text-base mt-4"
                    >
                      All Features <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                  <div className="dropdown-content-column">
                    <div className="two-column-grid">
                      <Link
                        to="/features/mobile-app"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <TbDeviceMobile className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Mobile App
                          </h4>
                          <p className="text-base text-gray-600">
                            Track inventory from any device, any location with
                            our easy mobile app.
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/features/qr-coding"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <HiOutlineQrcode className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            QR Coding
                          </h4>
                          <p className="text-base text-gray-600">
                            Save time on inventory with built-in QR code
                            scanning & labeling.
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/features/barcoding"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <TbBarcode className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Barcoding
                          </h4>
                          <p className="text-base text-gray-600">
                            Save time on inventory with built-in barcode
                            scanning & labeling.
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/features/alerts"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <TbAlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Alerts
                          </h4>
                          <p className="text-base text-gray-600">
                            Simplify reordering with low stock and date-based
                            alerts.
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/features/integrations"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <TbPlug className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Integrations
                          </h4>
                          <p className="text-base text-gray-600">
                            Connect Primarily with your favorite business tools
                            and platforms.
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/features/reporting"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <TbReportAnalytics className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Reporting
                          </h4>
                          <p className="text-base text-gray-600">
                            Generate powerful insights with customizable
                            inventory reports.
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* Solutions Dropdown */}
            <li className="relative group">
              <button
                onClick={toggleSolutions}
                className={`flex items-center px-2 py-1 transition-colors duration-150 ${
                  solutionsOpen
                    ? "text-primary"
                    : "text-gray-800 hover:text-primary-hover"
                }`}
                aria-expanded={solutionsOpen}
              >
                Solutions
                <IoChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                    solutionsOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              <div
                className={`full-width-dropdown ${
                  solutionsOpen ? "block" : "hidden md:group-hover:block"
                }`}
              >
                <div className="dropdown-container">
                  <div className="dropdown-title-column">
                    <Link
                      to="/solutions"
                      className="flex items-center text-2xl font-bold mb-3 text-gray-900 hover:text-primary-hover"
                    >
                      Solutions <FiArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <p className="text-base text-gray-600 mb-4">
                      No matter what you need to track, Primarily has you
                      covered.
                    </p>
                    <Link
                      to="/solutions"
                      className="flex items-center text-primary hover:text-primary font-medium text-base mt-4"
                    >
                      All Solutions <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                  <div className="dropdown-content-column grid grid-cols-3 gap-8 w-full">
                    <div className="flex flex-col h-full">
                      <div className="dropdown-section-header text-xs font-semibold text-gray-500 mb-2">
                        USE CASES
                      </div>
                      <div className="space-y-4">
                        <Link
                          to="/solutions/inventory-management"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbBuildingWarehouse className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Inventory Management
                            </h4>
                            <p className="text-base text-gray-600">
                              Manage, organize, and track all your business's
                              inventory.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/supplies-tracking"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbTruckDelivery className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Supplies Tracking
                            </h4>
                            <p className="text-base text-gray-600">
                              Track the supplies, materials, and parts your
                              business uses.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/asset-tracking"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <FiTool className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Asset Tracking
                            </h4>
                            <p className="text-base text-gray-600">
                              Track tools, equipment, and other high-value
                              assets with ease.
                            </p>
                          </div>
                        </Link>
                      </div>
                      <Link
                        to="/solutions"
                        className="flex items-center text-primary hover:text-primary font-medium text-base p-3"
                      >
                        All Solutions <FiArrowRight className="ml-1" />
                      </Link>
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="dropdown-section-header text-xs font-semibold text-gray-500 mb-2">
                        INDUSTRIES
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Link
                          to="/solutions/construction"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbBuildingWarehouse className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Construction
                            </h4>
                            <p className="text-base text-gray-600">
                              Manage construction inventory and tools across all
                              job sites.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/medical"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbMedicalCross className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Medical
                            </h4>
                            <p className="text-base text-gray-600">
                              Seamlessly manage medical supplies & equipment
                              on-the-go.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/retail"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Retail
                            </h4>
                            <p className="text-base text-gray-600">
                              Streamline inventory management for retail
                              operations.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/warehouse"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbBuildingWarehouse className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Warehouse
                            </h4>
                            <p className="text-base text-gray-600">
                              Optimize inventory flow and reduce errors in large
                              warehouses.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/food-and-beverage"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Food & Beverage
                            </h4>
                            <p className="text-base text-gray-600">
                              Manage inventory for restaurants, cafes, and food
                              production.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/manufacturing"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbBuildingFactory2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Manufacturing
                            </h4>
                            <p className="text-base text-gray-600">
                              Track raw materials, finished goods, and inventory
                              across multiple production lines.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/education"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbSchool className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Education
                            </h4>
                            <p className="text-base text-gray-600">
                              Manage inventory for schools, libraries, and
                              educational institutions.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/government"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbBuildingBank className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Government
                            </h4>
                            <p className="text-base text-gray-600">
                              Track inventory for public agencies and military.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/non-profit"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbHeartHandshake className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Non-Profit
                            </h4>
                            <p className="text-base text-gray-600">
                              Manage inventory for charitable organizations and
                              community projects.
                            </p>
                          </div>
                        </Link>
                      </div>
                      <Link
                        to="/solutions/industries"
                        className="flex items-center text-primary hover:text-primary font-medium text-base p-3"
                      >
                        All Industries <FiArrowRight className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* Enterprise - Simple Link */}
            <li>
              <Link
                to="/enterprise"
                className="text-gray-800 hover:text-primary-hover font-medium px-2 py-1 transition-colors duration-150"
              >
                Enterprise
              </Link>
            </li>

            {/* Pricing - Simple Link */}
            <li>
              <Link
                to="/pricing"
                className="text-gray-800 hover:text-primary-hover font-medium px-2 py-1 transition-colors duration-150"
              >
                Pricing
              </Link>
            </li>

            {/* Learn Dropdown */}
            <li className="relative group">
              <button
                onClick={toggleLearn}
                className={`flex items-center px-2 py-1 transition-colors duration-150 ${
                  learnOpen
                    ? "text-primary"
                    : "text-gray-800 hover:text-primary-hover"
                }`}
                aria-expanded={learnOpen}
              >
                Learn
                <IoChevronDown
                  className={`ml-1 w-4 h-4 transition-transform ${
                    learnOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              <div
                className={`full-width-dropdown ${
                  learnOpen ? "block" : "hidden md:group-hover:block"
                }`}
              >
                <div className="dropdown-container">
                  <div className="dropdown-title-column">
                    <Link
                      to="/learn"
                      className="flex items-center text-2xl font-bold mb-3 text-gray-900 hover:text-primary-hover"
                    >
                      Learn <FiArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <p className="text-base text-gray-600 mb-4">
                      Stay ahead of the curve with resources and insights from
                      Primarily.
                    </p>
                    <Link
                      to="/learn"
                      className="flex items-center text-primary hover:text-primary font-medium text-base mt-4"
                    >
                      All Resources <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                  <div className="dropdown-content-column">
                    <div className="three-column-grid">
                      {/* INSIGHTS Column */}
                      <div>
                        <div className="dropdown-section-header text-xs font-semibold text-gray-500 mb-2">
                          INSIGHTS
                        </div>
                        <div className="space-y-4">
                          <Link
                            to="/learn/case-study-tcm"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <TbUsersGroup className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Case Study: TCM Enterprises
                              </h4>
                              <p className="text-base text-gray-600">
                                See how they saved time and money on
                                construction inventory
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/learn/case-study-lemoine"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <TbUsersGroup className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Case Study: Lemoine
                              </h4>
                              <p className="text-base text-gray-600">
                                Disaster recovery team achieved efficiency and
                                transparency
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/learn/primarily-vs-spreadsheets"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <FiArrowRight className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Primarily vs. Spreadsheets
                              </h4>
                              <p className="text-base text-gray-600">
                                Why Primarily is better for inventory
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/learn/primarily-vs-inflow"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <FiArrowRight className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Primarily vs. InFlow
                              </h4>
                              <p className="text-base text-gray-600">
                                Comparison of mobile solutions
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                      {/* RESOURCES Column */}
                      <div>
                        <div className="dropdown-section-header text-xs font-semibold text-gray-500 mb-2">
                          RESOURCES
                        </div>
                        <div className="space-y-4">
                          <Link
                            to="/reviews"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <FiStar className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">Reviews</h4>
                              <p className="text-base text-gray-600">
                                Customer feedback and testimonials
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/blog"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <FiFileText className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">Blog</h4>
                              <p className="text-base text-gray-600">
                                Latest articles and expert insights
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/primarily-university"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <BsPlayFill className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Primarily University
                              </h4>
                              <p className="text-base text-gray-600">
                                Expert tutorials and best practices
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/glossary"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <TbBook2 className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">Glossary</h4>
                              <p className="text-base text-gray-600">
                                Key terms and inventory concepts
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/knowledge-center"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <TbHelpCircle className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Knowledge Center
                              </h4>
                              <p className="text-base text-gray-600">
                                Help documentation and FAQs
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                      {/* BLOG Column */}
                      <div>
                        <div className="dropdown-section-header text-xs font-semibold text-gray-500 mb-2">
                          BLOG
                        </div>
                        <div className="space-y-4">
                          <Link
                            to="/blog/inventory-mistakes"
                            className="group block rounded-lg hover:bg-primary-light transition-colors p-3"
                          >
                            <div className="relative rounded-lg overflow-hidden mb-2">
                              <img
                                src="https://media.primarily.com/wp-content/uploads/2024/05/03190646/iStock-1284867257-290x155.jpg"
                                alt="Warehouse worker"
                                className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <h4 className="font-semibold group-hover:text-primary-hover">
                              8 Common Inventory Mistakes
                            </h4>
                            <p className="text-base text-gray-600">
                              And how to avoid them
                            </p>
                          </Link>
                          <Link
                            to="/blog/barcodes-vs-qrcodes"
                            className="group block rounded-lg hover:bg-primary-light transition-colors p-3"
                          >
                            <div className="relative rounded-lg overflow-hidden mb-2">
                              <img
                                src="https://media.primarily.com/wp-content/uploads/2024/02/28193332/iStock-1311355201-290x155.jpg"
                                alt="Phone scanning barcode"
                                className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <h4 className="font-semibold group-hover:text-primary-hover">
                              Barcodes vs. QR Codes
                            </h4>
                            <p className="text-base text-gray-600">
                              For inventory management
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            to="/login"
            className="border border-primary text-primary hover:bg-primary-light hover:text-primary font-medium rounded-full px-6 py-2 transition-colors text-base bg-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="btn-primary hover:btn-primary-hover text-white font-medium py-2 px-6 rounded-full transition-colors text-base shadow-md"
          >
            Start Free Trial
          </Link>
        </div>
        {/* Hamburger for mobile */}
        {!isMenuOpen && (
          <button
            className={`lg:hidden flex flex-col justify-center items-center w-12 h-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-2 focus:ring-[#0a7662] focus:ring-opacity-50 focus:ring-offset-2 transition-all duration-200 ${
              isMenuOpen
                ? "text-primary bg-[#e6f3f1]"
                : "text-gray-600 hover:text-primary-hover hover:bg-gray-50"
            } ml-auto`}
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out my-1 ${
                isMenuOpen ? "opacity-0 scale-0" : ""
              }`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>
        )}
      </div>
      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg px-4 py-6 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="flex-shrink-0 flex items-center h-10">
              <PrimarilyLogo className="h-8" />
            </Link>
            <button
              onClick={toggleMenu}
              className="border-2 border-primary text-primary rounded-lg p-2 hover:bg-primary-light focus:outline-none"
              aria-label="Close menu"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-row gap-4 mb-6">
            <Link
              to="/signup"
              className="btn-primary hover:btn-primary-hover text-white font-medium py-2 px-6 rounded-full transition-colors text-base shadow-md flex-1 text-center"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="border border-primary text-primary hover:bg-primary-light hover:text-primary font-medium rounded-full px-6 py-2 transition-colors text-base bg-white flex-1 text-center"
            >
              Login
            </Link>
          </div>
          <ul className="flex flex-col space-y-4">
            {/* Features Dropdown */}
            <li className="relative group">
              <button
                onClick={toggleFeatures}
                className={`flex items-center justify-between w-full px-2 py-1 transition-colors duration-150 ${
                  featuresOpen
                    ? "text-primary"
                    : "text-gray-800 hover:text-primary-hover"
                }`}
                aria-expanded={featuresOpen}
              >
                Features
                <IoChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                    featuresOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              <div
                className={`full-width-dropdown ${
                  featuresOpen ? "block" : "hidden md:group-hover:block"
                }`}
              >
                <div className="dropdown-container">
                  <div className="dropdown-title-column">
                    <Link
                      to="/features"
                      className="flex items-center text-2xl font-bold mb-3 text-gray-900 hover:text-primary-hover"
                    >
                      Features <FiArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <p className="text-base text-gray-600 mb-4">
                      Discover how Primarily simplifies inventory with features
                      designed for ease and organization.
                    </p>
                    <Link
                      to="/features"
                      className="flex items-center text-primary hover:text-primary font-medium text-base mt-4"
                    >
                      All Features <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                  <div className="dropdown-content-column">
                    <div className="two-column-grid">
                      <Link
                        to="/features/mobile-app"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <TbDeviceMobile className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Mobile App
                          </h4>
                          <p className="text-base text-gray-600">
                            Track inventory from any device, any location with
                            our easy mobile app.
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/features/qr-coding"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <HiOutlineQrcode className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            QR Coding
                          </h4>
                          <p className="text-base text-gray-600">
                            Save time on inventory with built-in QR code
                            scanning & labeling.
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/features/barcoding"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <TbBarcode className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Barcoding
                          </h4>
                          <p className="text-base text-gray-600">
                            Save time on inventory with built-in barcode
                            scanning & labeling.
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/features/alerts"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <TbAlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Alerts
                          </h4>
                          <p className="text-base text-gray-600">
                            Simplify reordering with low stock and date-based
                            alerts.
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/features/integrations"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <TbPlug className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Integrations
                          </h4>
                          <p className="text-base text-gray-600">
                            Connect Primarily with your favorite business tools
                            and platforms.
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/features/reporting"
                        className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                      >
                        <div className="text-primary mr-3 mt-1">
                          <TbReportAnalytics className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Reporting
                          </h4>
                          <p className="text-base text-gray-600">
                            Generate powerful insights with customizable
                            inventory reports.
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* Solutions Dropdown */}
            <li className="relative group">
              <button
                onClick={toggleSolutions}
                className={`flex items-center justify-between w-full px-2 py-1 transition-colors duration-150 ${
                  solutionsOpen
                    ? "text-primary"
                    : "text-gray-800 hover:text-primary-hover"
                }`}
                aria-expanded={solutionsOpen}
              >
                Solutions
                <IoChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                    solutionsOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              <div
                className={`full-width-dropdown ${
                  solutionsOpen ? "block" : "hidden md:group-hover:block"
                }`}
              >
                <div className="dropdown-container">
                  <div className="dropdown-title-column">
                    <Link
                      to="/solutions"
                      className="flex items-center text-2xl font-bold mb-3 text-gray-900 hover:text-primary-hover"
                    >
                      Solutions <FiArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <p className="text-base text-gray-600 mb-4">
                      No matter what you need to track, Primarily has you
                      covered.
                    </p>
                    <Link
                      to="/solutions"
                      className="flex items-center text-primary hover:text-primary font-medium text-base mt-4"
                    >
                      All Solutions <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                  <div className="dropdown-content-column grid grid-cols-3 gap-8 w-full">
                    <div className="flex flex-col h-full">
                      <div className="dropdown-section-header text-xs font-semibold text-gray-500 mb-2">
                        USE CASES
                      </div>
                      <div className="space-y-4">
                        <Link
                          to="/solutions/inventory-management"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbBuildingWarehouse className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Inventory Management
                            </h4>
                            <p className="text-base text-gray-600">
                              Manage, organize, and track all your business's
                              inventory.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/supplies-tracking"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbTruckDelivery className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Supplies Tracking
                            </h4>
                            <p className="text-base text-gray-600">
                              Track the supplies, materials, and parts your
                              business uses.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/asset-tracking"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <FiTool className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Asset Tracking
                            </h4>
                            <p className="text-base text-gray-600">
                              Track tools, equipment, and other high-value
                              assets with ease.
                            </p>
                          </div>
                        </Link>
                      </div>
                      <Link
                        to="/solutions"
                        className="flex items-center text-primary hover:text-primary font-medium text-base p-3"
                      >
                        All Solutions <FiArrowRight className="ml-1" />
                      </Link>
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="dropdown-section-header text-xs font-semibold text-gray-500 mb-2">
                        INDUSTRIES
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Link
                          to="/solutions/construction"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbBuildingWarehouse className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Construction
                            </h4>
                            <p className="text-base text-gray-600">
                              Manage construction inventory and tools across all
                              job sites.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/medical"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbMedicalCross className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Medical
                            </h4>
                            <p className="text-base text-gray-600">
                              Seamlessly manage medical supplies & equipment
                              on-the-go.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/retail"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Retail
                            </h4>
                            <p className="text-base text-gray-600">
                              Streamline inventory management for retail
                              operations.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/warehouse"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbBuildingWarehouse className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Warehouse
                            </h4>
                            <p className="text-base text-gray-600">
                              Optimize inventory flow and reduce errors in large
                              warehouses.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/food-and-beverage"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Food & Beverage
                            </h4>
                            <p className="text-base text-gray-600">
                              Manage inventory for restaurants, cafes, and food
                              production.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/manufacturing"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbBuildingFactory2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Manufacturing
                            </h4>
                            <p className="text-base text-gray-600">
                              Track raw materials, finished goods, and inventory
                              across multiple production lines.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/education"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbSchool className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Education
                            </h4>
                            <p className="text-base text-gray-600">
                              Manage inventory for schools, libraries, and
                              educational institutions.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/government"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbBuildingBank className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Government
                            </h4>
                            <p className="text-base text-gray-600">
                              Track inventory for public agencies and military.
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/solutions/non-profit"
                          className="flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                          <div className="text-primary mr-3 mt-1">
                            <TbHeartHandshake className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Non-Profit
                            </h4>
                            <p className="text-base text-gray-600">
                              Manage inventory for charitable organizations and
                              community projects.
                            </p>
                          </div>
                        </Link>
                      </div>
                      <Link
                        to="/solutions/industries"
                        className="flex items-center text-primary hover:text-primary font-medium text-base p-3"
                      >
                        All Industries <FiArrowRight className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* Enterprise - Simple Link */}
            <li>
              <Link
                to="/enterprise"
                className="text-gray-800 hover:text-primary-hover font-medium px-2 py-1 transition-colors duration-150"
              >
                Enterprise
              </Link>
            </li>

            {/* Pricing - Simple Link */}
            <li>
              <Link
                to="/pricing"
                className="text-gray-800 hover:text-primary-hover font-medium px-2 py-1 transition-colors duration-150"
              >
                Pricing
              </Link>
            </li>

            {/* Learn Dropdown */}
            <li className="relative group">
              <button
                onClick={toggleLearn}
                className={`flex items-center justify-between w-full px-2 py-1 transition-colors duration-150 ${
                  learnOpen
                    ? "text-primary"
                    : "text-gray-800 hover:text-primary-hover"
                }`}
                aria-expanded={learnOpen}
              >
                Learn
                <IoChevronDown
                  className={`ml-1 w-4 h-4 transition-transform ${
                    learnOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              <div
                className={`full-width-dropdown ${
                  learnOpen ? "block" : "hidden md:group-hover:block"
                }`}
              >
                <div className="dropdown-container">
                  <div className="dropdown-title-column">
                    <Link
                      to="/learn"
                      className="flex items-center text-2xl font-bold mb-3 text-gray-900 hover:text-primary-hover"
                    >
                      Learn <FiArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <p className="text-base text-gray-600 mb-4">
                      Stay ahead of the curve with resources and insights from
                      Primarily.
                    </p>
                    <Link
                      to="/learn"
                      className="flex items-center text-primary hover:text-primary font-medium text-base mt-4"
                    >
                      All Resources <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                  <div className="dropdown-content-column">
                    <div className="three-column-grid">
                      {/* INSIGHTS Column */}
                      <div>
                        <div className="dropdown-section-header text-xs font-semibold text-gray-500 mb-2">
                          INSIGHTS
                        </div>
                        <div className="space-y-4">
                          <Link
                            to="/learn/case-study-tcm"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <TbUsersGroup className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Case Study: TCM Enterprises
                              </h4>
                              <p className="text-base text-gray-600">
                                See how they saved time and money on
                                construction inventory
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/learn/case-study-lemoine"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <TbUsersGroup className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Case Study: Lemoine
                              </h4>
                              <p className="text-base text-gray-600">
                                Disaster recovery team achieved efficiency and
                                transparency
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/learn/primarily-vs-spreadsheets"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <FiArrowRight className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Primarily vs. Spreadsheets
                              </h4>
                              <p className="text-base text-gray-600">
                                Why Primarily is better for inventory
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/learn/primarily-vs-inflow"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <FiArrowRight className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Primarily vs. InFlow
                              </h4>
                              <p className="text-base text-gray-600">
                                Comparison of mobile solutions
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                      {/* RESOURCES Column */}
                      <div>
                        <div className="dropdown-section-header text-xs font-semibold text-gray-500 mb-2">
                          RESOURCES
                        </div>
                        <div className="space-y-4">
                          <Link
                            to="/reviews"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <FiStar className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">Reviews</h4>
                              <p className="text-base text-gray-600">
                                Customer feedback and testimonials
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/blog"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <FiFileText className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">Blog</h4>
                              <p className="text-base text-gray-600">
                                Latest articles and expert insights
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/primarily-university"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <BsPlayFill className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Primarily University
                              </h4>
                              <p className="text-base text-gray-600">
                                Expert tutorials and best practices
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/glossary"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <TbBook2 className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">Glossary</h4>
                              <p className="text-base text-gray-600">
                                Key terms and inventory concepts
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/knowledge-center"
                            className="dropdown-item flex items-start p-3 rounded-lg hover:bg-primary-light transition-colors"
                          >
                            <TbHelpCircle className="text-primary mr-3 mt-1 flex-shrink-0 w-6 h-6" />
                            <div>
                              <h4 className="font-semibold">
                                Knowledge Center
                              </h4>
                              <p className="text-base text-gray-600">
                                Help documentation and FAQs
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                      {/* BLOG Column */}
                      <div>
                        <div className="dropdown-section-header text-xs font-semibold text-gray-500 mb-2">
                          BLOG
                        </div>
                        <div className="space-y-4">
                          <Link
                            to="/blog/inventory-mistakes"
                            className="group block rounded-lg hover:bg-primary-light transition-colors p-3"
                          >
                            <div className="relative rounded-lg overflow-hidden mb-2">
                              <img
                                src="https://media.primarily.com/wp-content/uploads/2024/05/03190646/iStock-1284867257-290x155.jpg"
                                alt="Warehouse worker"
                                className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <h4 className="font-semibold group-hover:text-primary-hover">
                              8 Common Inventory Mistakes
                            </h4>
                            <p className="text-base text-gray-600">
                              And how to avoid them
                            </p>
                          </Link>
                          <Link
                            to="/blog/barcodes-vs-qrcodes"
                            className="group block rounded-lg hover:bg-primary-light transition-colors p-3"
                          >
                            <div className="relative rounded-lg overflow-hidden mb-2">
                              <img
                                src="https://media.primarily.com/wp-content/uploads/2024/02/28193332/iStock-1311355201-290x155.jpg"
                                alt="Phone scanning barcode"
                                className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <h4 className="font-semibold group-hover:text-primary-hover">
                              Barcodes vs. QR Codes
                            </h4>
                            <p className="text-base text-gray-600">
                              For inventory management
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
