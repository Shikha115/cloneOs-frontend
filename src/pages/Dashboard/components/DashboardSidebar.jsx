import React from 'react';
import { FolderOpen, User, FileText, Film, Video } from 'lucide-react';
import { useStoryboardFrames } from '@/store/storyboard.store';
import { useSidebarOpen } from '@/store/dashboard.store';

export default function DashboardSidebar({ currentSection, scrollToSection }) {
  const frames = useStoryboardFrames();
  const sidebarOpen = useSidebarOpen();
  const doesFramesExist = frames && frames.length > 0;
  const sections = [
    { id: 'select-project', title: '1. Select Project', icon: FolderOpen },
    { id: 'select-avatar', title: '2. Select Avatar', icon: User },
    { id: 'upload-script', title: '3. Upload Script', icon: FileText },
      ...(doesFramesExist ? [{ id: 'storyboard', title: '4. Generate Storyboard', icon: Film }] : []),
    { id: 'video-generation', title: `${doesFramesExist ? "5" : "4"}. Create Video`, icon: Video },
  ];
  return (
    <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <h2 className="sidebar-title">CREATION FLOW</h2>
        <nav className="sidebar-nav">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`nav-item ${currentSection === section.id ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{section.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <h3 className="footer-title">Quick Start Guide</h3>
          <p className="footer-text">Create Yours Guide</p>
          <p className="footer-text">Tech Review Check</p>
        </div>
      </div>
    </aside>
  );
}
