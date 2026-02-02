import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockStoryboardFrames } from "../../components/mock";
import DashboardSidebar from "./components/DashboardSidebar";
import ProjectSection from "./components/projectSection/Section";
import AvatarSection from "./components/avatarSection/Section";
import UploadScriptSection from "./components/UploadScriptSection";
import StoryboardSection from "./components/StoryboardSection/Section";
import VideoGenerationSection from "./components/VideoGenerationSection";
import { useIsGeneratingScript } from "../../store/storyboard.store";

const Dashboard = ({ sidebarOpen, setSidebarOpen }) => {
  const [selectedActors, setSelectedActors] = useState([]);
  const [currentSection, setCurrentSection] = useState("select-project");
  const [storyboardFrames, setStoryboardFrames] =
    useState(mockStoryboardFrames);
  const isGeneratingScript = useIsGeneratingScript();
  const navigate = useNavigate();

  const sectionRefs = {
    "select-project": useRef(null),
    "select-avatar": useRef(null),
    "upload-script": useRef(null),
    storyboard: useRef(null),
    "video-generation": useRef(null),
  };

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId);
    sectionRefs[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="dcverse-dashboard">
      <div className="dashboard-layout">
        {/* Sidebar */}
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          currentSection={currentSection}
          scrollToSection={scrollToSection}
        />

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Section 0: Select Project */}
          <ProjectSection
            sectionRef={sectionRefs["select-project"]}
            onNext={(targetSection) => {
              if (targetSection === 'storyboard') {
                scrollToSection('storyboard');
              } else {
                scrollToSection("select-avatar");
              }
            }}
          />

          {/* Section 1: Select Your Actor */}
          <AvatarSection
            sectionRef={sectionRefs["select-avatar"]}
            onSelectionChange={(list) => setSelectedActors(list)}
            onNext={() => scrollToSection('upload-script')}
          />

          {/* Section 2: Upload Script */}
          <UploadScriptSection
            sectionRef={sectionRefs["upload-script"]}
            onFramesReady={(frames) => setStoryboardFrames(frames)}
          />

          {/* Section 3: Storyboard Generation */}
          <StoryboardSection
            sectionRef={sectionRefs["storyboard"]}
            onFramesChange={(frames) => setStoryboardFrames(frames)}
            onProceed={() => scrollToSection('video-generation')}
            isGenerating={isGeneratingScript}
          />

          {/* Section 4: Video Generation */}
          <VideoGenerationSection
            sectionRef={sectionRefs['video-generation']}
            frames={storyboardFrames}
            actors={selectedActors}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
