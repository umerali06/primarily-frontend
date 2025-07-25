import React, { useRef, useState, useEffect } from "react";
import FeaturedHero from "../components/FeaturedHero";
import OrganizeSection from "../components/OrganizeSection";
import CustomizeSection from "../components/CustomizeSection";
import ManageSection from "../components/ManageSection";
import TrackUpdateSection from "../components/TrackUpdateSection";
import TryPrimarilySection from "../components/TryPrimarilySection";
import ReportSection from "../components/ReportSection";
import IntegrationSection from "../components/IntegrationSection";
import ExperienceInventorySection from "../components/ExperienceInventorySection";

const TABS = [
  { id: "organize", label: "Organize" },
  { id: "customize", label: "Customize" },
  { id: "manage", label: "Manage" },
  { id: "trackupdate", label: "Track & Update" },
  { id: "report", label: "Report" },
  { id: "integrations", label: "Integrations" },
];

// Helper HOC to center content and increase image size in all tab sections
const withCenteredSection = (Comp) => (props) =>
  (
    <div className="flex flex-col items-center text-center w-full">
      <Comp {...props} imageSizeClass="h-32 w-32" />
    </div>
  );

const CenteredOrganizeSection = withCenteredSection(OrganizeSection);
const CenteredCustomizeSection = withCenteredSection(CustomizeSection);
const CenteredManageSection = withCenteredSection(ManageSection);
const CenteredTrackUpdateSection = withCenteredSection(TrackUpdateSection);
const CenteredReportSection = withCenteredSection(ReportSection);
const CenteredIntegrationSection = withCenteredSection(IntegrationSection);

const NAVBAR_HEIGHT = 96; // px, increased for more space below navbar

const FeaturedPage = () => {
  // Refs for each section
  const organizeRef = useRef(null);
  const customizeRef = useRef(null);
  const manageRef = useRef(null);
  const trackUpdateRef = useRef(null);
  const reportRef = useRef(null);
  const integrationsRef = useRef(null);

  const sectionRefs = {
    organize: organizeRef,
    customize: customizeRef,
    manage: manageRef,
    trackupdate: trackUpdateRef,
    report: reportRef,
    integrations: integrationsRef,
  };

  // Scrollspy logic
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + NAVBAR_HEIGHT + 32; // Offset for sticky nav and spacing
      let current = TABS[0].id;
      for (const tab of TABS) {
        const ref = sectionRefs[tab.id];
        if (ref.current) {
          const { top } = ref.current.getBoundingClientRect();
          const sectionTop = window.scrollY + top;
          if (scrollPosition >= sectionTop) {
            current = tab.id;
          }
        }
      }
      setActiveTab(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tab click scroll
  const handleTabClick = (id) => {
    const ref = sectionRefs[id];
    if (ref.current) {
      const y =
        ref.current.getBoundingClientRect().top +
        window.scrollY -
        NAVBAR_HEIGHT -
        16;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main>
      <FeaturedHero />
      {/* Tab Navigation - sticky just below navbar */}
      <nav
        className="sticky z-40 bg-white border-b border-gray-100 shadow-lg"
        style={{ top: `${NAVBAR_HEIGHT}px` }}
      >
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap justify-center gap-2 md:gap-6 py-4">
            {TABS.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`px-4 py-2 rounded-full font-semibold transition-colors text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7662] focus-visible:ring-offset-2
                    ${
                      activeTab === tab.id
                        ? "bg-[#0a7662] text-white shadow"
                        : "bg-gray-50 text-gray-800 hover:bg-[#e6f3f1] hover:text-[#075c4c]"
                    }
                  `}
                  onClick={() => handleTabClick(tab.id)}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* Sections - all centered, images larger */}
      <section ref={organizeRef} id="organize">
        <CenteredOrganizeSection />
      </section>
      <section ref={customizeRef} id="customize">
        <CenteredCustomizeSection />
      </section>
      <section ref={manageRef} id="manage">
        <CenteredManageSection />
      </section>
      <section ref={trackUpdateRef} id="trackupdate">
        <CenteredTrackUpdateSection />
      </section>
      {/* Try Primarily Section before Report */}
      <TryPrimarilySection />
      <section ref={reportRef} id="report">
        <CenteredReportSection />
      </section>
      <section ref={integrationsRef} id="integrations">
        <CenteredIntegrationSection />
      </section>
      {/* Experience Inventory Section after Integrations */}
      <ExperienceInventorySection />
    </main>
  );
};

export default FeaturedPage;
