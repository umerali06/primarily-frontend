import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import ResourcesPage from "./pages/ResourcesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import FeaturedPage from "./pages/FeaturedPage";
import SolutionsPage from "./pages/SolutionsPage";
import EnterprisePage from "./pages/EnterprisePage";
import OnboardingCategory from "./components/OnboardingCategory";
import FreeTrialPage from "./pages/FreeTrialPage";
import ItemsDashboardPage from "./pages/ItemsDashboardPage";
import ItemsDashboardErrorBoundary from "./components/ItemsDashboardErrorBoundary";
import useAuthStore from "./store/authStore";
import AuthSuccessPage from "./pages/AuthSuccessPage";

// Features pages
import MobileAppPage from "./pages/features/MobileAppPage";
import QRCodingPage from "./pages/features/QRCodingPage";
import BarcodingPage from "./pages/features/BarcodingPage";
import AlertsPage from "./pages/features/AlertsPage";
import IntegrationsPage from "./pages/features/IntegrationsPage";
import ReportingPage from "./pages/features/ReportingPage";

// Solutions pages
import InventoryManagementPage from "./pages/solutions/InventoryManagementPage";
import SuppliesTrackingPage from "./pages/solutions/SuppliesTrackingPage";
import AssetTrackingPage from "./pages/solutions/AssetTrackingPage";
import ConstructionPage from "./pages/solutions/ConstructionPage";
import MedicalPage from "./pages/solutions/MedicalPage";
import RetailPage from "./pages/solutions/RetailPage";
import WarehousePage from "./pages/solutions/WarehousePage";
import FoodBeveragePage from "./pages/solutions/FoodBeveragePage";
import ManufacturingPage from "./pages/solutions/ManufacturingPage";
import EducationPage from "./pages/solutions/EducationPage";
import GovernmentPage from "./pages/solutions/GovernmentPage";
import NonProfitPage from "./pages/solutions/NonProfitPage";
import IndustriesPage from "./pages/solutions/IndustriesPage";

// Learn pages
import LearnPage from "./pages/LearnPage";
import CaseStudyTCMPage from "./pages/learn/CaseStudyTCMPage";
import CaseStudyLemoinePage from "./pages/learn/CaseStudyLemoinePage";
import PrimarilyVsSpreadsheetsPage from "./pages/learn/PrimarilyVsSpreadsheetsPage";
import PrimarilyVsInflowPage from "./pages/learn/PrimarilyVsInflowPage";
import ReviewsPage from "./pages/ReviewsPage";
import BlogPage from "./pages/learn/BlogPage";
import HelpCenterPage from "./pages/learn/HelpCenterPage";
import WebinarsPage from "./pages/learn/WebinarsPage";
import TemplatesPage from "./pages/learn/TemplatesPage";
import PrimarilyUniversityPage from "./pages/learn/PrimarilyUniversityPage";
import GlossaryPage from "./pages/learn/GlossaryPage";
import KnowledgeCenterPage from "./pages/learn/KnowledgeCenterPage";
import InventoryMistakesBlogPage from "./pages/learn/InventoryMistakesBlogPage";
import BarcodesVsQRCodesBlogPage from "./pages/learn/BarcodesVsQRCodesBlogPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/items" replace />;
};

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "#16A34A",
              secondary: "#black",
            },
          },
        }}
      />
      <Routes>
        <Route path="/auth/success" element={<AuthSuccessPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="features" element={<FeaturedPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="enterprise" element={<EnterprisePage />} />

          {/* Features submenu routes */}
          <Route path="features/mobile-app" element={<MobileAppPage />} />
          <Route path="features/qr-coding" element={<QRCodingPage />} />
          <Route path="features/barcoding" element={<BarcodingPage />} />
          <Route path="features/alerts" element={<AlertsPage />} />
          <Route path="features/integrations" element={<IntegrationsPage />} />
          <Route path="features/reporting" element={<ReportingPage />} />

          {/* Solutions submenu routes */}
          <Route
            path="solutions/inventory-management"
            element={<InventoryManagementPage />}
          />
          <Route
            path="solutions/supplies-tracking"
            element={<SuppliesTrackingPage />}
          />
          <Route
            path="solutions/asset-tracking"
            element={<AssetTrackingPage />}
          />
          <Route path="solutions/construction" element={<ConstructionPage />} />
          <Route path="solutions/medical" element={<MedicalPage />} />
          <Route path="solutions/retail" element={<RetailPage />} />
          <Route path="solutions/warehouse" element={<WarehousePage />} />
          <Route
            path="solutions/food-and-beverage"
            element={<FoodBeveragePage />}
          />
          <Route
            path="solutions/manufacturing"
            element={<ManufacturingPage />}
          />
          <Route path="solutions/education" element={<EducationPage />} />
          <Route path="solutions/government" element={<GovernmentPage />} />
          <Route path="solutions/non-profit" element={<NonProfitPage />} />
          <Route path="solutions/industries" element={<IndustriesPage />} />

          {/* Learn submenu routes */}
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/case-study-tcm" element={<CaseStudyTCMPage />} />
          <Route
            path="learn/case-study-lemoine"
            element={<CaseStudyLemoinePage />}
          />
          <Route
            path="learn/primarily-vs-spreadsheets"
            element={<PrimarilyVsSpreadsheetsPage />}
          />
          <Route
            path="learn/primarily-vs-inflow"
            element={<PrimarilyVsInflowPage />}
          />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="learn/blog" element={<BlogPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="learn/help-center" element={<HelpCenterPage />} />
          <Route path="learn/webinars" element={<WebinarsPage />} />
          <Route path="learn/templates" element={<TemplatesPage />} />
          <Route
            path="primarily-university"
            element={<PrimarilyUniversityPage />}
          />
          <Route path="glossary" element={<GlossaryPage />} />
          <Route path="knowledge-center" element={<KnowledgeCenterPage />} />
          <Route
            path="blog/inventory-mistakes"
            element={<InventoryMistakesBlogPage />}
          />
          <Route
            path="blog/barcodes-vs-qrcodes"
            element={<BarcodesVsQRCodesBlogPage />}
          />
        </Route>

        {/* Protected Routes */}
        <Route
          path="items"
          element={
            <ProtectedRoute>
              <ItemsDashboardErrorBoundary>
                <ItemsDashboardPage />
              </ItemsDashboardErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="onboarding"
          element={
            <ProtectedRoute>
              <OnboardingCategory />
            </ProtectedRoute>
          }
        />

        {/* Public Routes (redirect if authenticated) */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        <Route path="free-trial" element={<FreeTrialPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
