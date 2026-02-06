import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { User, Menu, X } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import { useAuthStore } from '../../../store/auth.store';
import { useSidebarOpen, useToggleSidebar } from '../../../store/dashboard.store';
import { logout } from '../../../services/auth.service';

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, clearAuth } = useAuthStore();
  const sidebarOpen = useSidebarOpen();
  const toggleSidebar = useToggleSidebar();

  const handleLogout = () => {
    clearAuth();
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  const handleMyProjects = () => {
    navigate('/my-projects');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <Link to="/" className="logo-section">
          <img
            src="/cloneOs.jpeg"
            alt="DCVerse"
            className="h-auto w-[100px] object-contain"
          />
          {/* <span className="logo-text">DCVERSE</span> */}
        </Link>
        <div className="header-actions">
          {user ? (
            <>
              <div className="user-info flex items-center gap-2 text-white">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
                <span className="text-xs bg-purple-600 px-2 py-1 rounded">
                  {user.creditsBalance} credits
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="header-btn text-white hover:bg-white/10"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
                  <DropdownMenuItem 
                    onClick={handleMyProjects}
                    className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 hover:text-white focus:text-white"
                  >
                    My Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 hover:text-white focus:text-white"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              variant="ghost"
              className="header-btn text-white hover:bg-white/10"
              onClick={handleLoginRedirect}
            >
              <User className="w-4 h-4 mr-1" />
              Login
            </Button>
          )}
          <Button
            variant="ghost"
            className="header-btn text-white hover:bg-white/10"
          >
            1834 HELP
          </Button>
        </div>
        <Button
          variant="ghost"
          className="mobile-menu-btn"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>
    </header>
  );
}
