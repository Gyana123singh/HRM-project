import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HRSidebar } from '../components/navigation/HRSidebar';
import { Navbar } from '../components/navigation/Navbar';
import { MobileDrawer } from '../components/navigation/MobileDrawer';

export const HRLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f4f5f8] text-[#2c2738] flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <HRSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Mobile Slide-in Drawer */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
