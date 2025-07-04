"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LiaDocker } from "react-icons/lia";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/hook";
import {
  MenuIcon,
  HomeIcon,
  Bot,
  Brain,
  SettingsIcon,
  PlusIcon,
  ChevronDownIcon,
  UserIcon,
  WalletIcon,
  LogOutIcon,
  CreditCardIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  CodeIcon,
  ServerIcon,
  GlobeIcon,
  DatabaseIcon,
  HardDrive,
  CloudLightning,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import LogoutModal from "../modals/LogoutModal";
import LottieAnimation from "@/components/ui/LottieAnimation";
import { FaRobot } from "react-icons/fa";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const wallet = useAppSelector((state) => state.wallet.wallet);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  

  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  function isActiveRoute(route: string) {
    return pathname === route;
  }

  function isActiveSubRoute(route: string) {
    return pathname?.startsWith(route) ?? false;
  }

  const NavItems = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-2">
      {/* Dashboard */}
      <Link href="/" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            isActiveRoute("/")
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10"
              : "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <HomeIcon className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            isActiveRoute("/") ? "text-pink-400" : "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">Dashboard</span>
          )}
          {isActiveRoute("/") && (
            <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
          )}
        </Button>
      </Link>

      {/* AI Workflows */}
      <Link href="/aiagent" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            isActiveRoute("/ai")
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10"
              : "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <Brain className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            isActiveRoute("/ai") ? "text-pink-400" : "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">AI Agent</span>
          )}
          {isActiveRoute("/ai") && (
            <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
          )}
        </Button>
      </Link>

      {/* ML Models */}
      <Link href="/vspace" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            isActiveRoute("/vspace")
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10"
              : "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <Bot className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            isActiveRoute("/vspace") ? "text-pink-400" : "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">Virtual Space</span>
          )}
          {isActiveRoute("/vspace") && (
            <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
          )}
        </Button>
      </Link>

      {/* App Platform */}
      <Link href="/project/app-platform" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            isActiveSubRoute("/project/app-platform")
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10"
              : "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <CodeIcon className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            isActiveSubRoute("/project/app-platform") ? "text-pink-400" : "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">App Platform</span>
          )}
          {isActiveSubRoute("/project/app-platform") && (
            <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
          )}
        </Button>
      </Link>

      {/* Web Builder */}
      <Link href="/project/webbuilder" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            isActiveSubRoute("/project/webbuilder")
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10"
              : "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <GlobeIcon className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            isActiveSubRoute("/project/webbuilder") ? "text-pink-400" : "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">Web Builder</span>
          )}
          {isActiveSubRoute("/project/webbuilder") && (
            <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
          )}
        </Button>
      </Link>

      {/* Database */}
      <Link href="/project/database" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            isActiveSubRoute("/project/database")
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10"
              : "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <DatabaseIcon className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            isActiveSubRoute("/project/database") ? "text-pink-400" : "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">Database</span>
          )}
          {isActiveSubRoute("/project/database") && (
            <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
          )}
        </Button>
      </Link>

      <Link href="/project/chatbot" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            isActiveSubRoute("/chatbotbuild")
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10"
              : "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <FaRobot className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            isActiveSubRoute("/chatbotbuild") ? "text-pink-400" : "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">ChatBot Builder</span>
          )}
          {isActiveSubRoute("/chatbotbuild") && (
            <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
          )}
        </Button>
      </Link>

      {/* Storage */}
      <Link href="/project/storage" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            isActiveSubRoute("/project/storage")
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10"
              : "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <HardDrive className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            isActiveSubRoute("/project/storage") ? "text-pink-400" : "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">Storage</span>
          )}
          {isActiveSubRoute("/project/storage") && (
            <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
          )}
        </Button>
      </Link>

      {/* Cloud Customization */}
      <Link href="/customization" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            isActiveRoute("/customization")
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10"
              : "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <CloudLightning className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            isActiveRoute("/customization") ? "text-pink-400" : "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">Cloud Hub</span>
          )}
          {isActiveRoute("/customization") && (
            <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
          )}
        </Button>
      </Link>

      {/* DockerGen */}
      <Link href="https://dockergen.deploylite.tech" target="_blank">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <LiaDocker className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">DockerGen</span>
          )}
          {(!isSidebarCollapsed || isMobile) && (
            <div className="ml-auto">
              <Badge variant="secondary" className="text-xs bg-pink-500/20 text-pink-300 border-pink-500/30">
                Beta
              </Badge>
            </div>
          )}
        </Button>
      </Link>

      {/* Settings */}
      <Link href="/settings" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-xl transition-all duration-300 group relative overflow-hidden",
            "h-12 text-sm font-medium",
            isMobile ? "h-14 text-base" : "",
            isActiveRoute("/settings")
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/10"
              : "text-gray-300 hover:text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 hover:border-pink-500/20 border border-transparent",
            !isSidebarCollapsed || isMobile ? "px-4" : "px-2"
          )}
          onClick={() => isMobile && setIsSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-purple-600/0 group-hover:from-pink-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
          <SettingsIcon className={cn("shrink-0 transition-all duration-300", 
            isMobile ? "h-6 w-6" : "h-5 w-5",
            isActiveRoute("/settings") ? "text-pink-400" : "text-gray-400 group-hover:text-pink-300"
          )} />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="ml-3 transition-all duration-300">Settings</span>
          )}
          {isActiveRoute("/settings") && (
            <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full" />
          )}
        </Button>
      </Link>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col transition-all duration-300 border-r border-pink-500/20",
          "bg-gradient-to-b from-black via-gray-900/90 to-black backdrop-blur-xl",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Header */}
        <div className={cn(
          "p-6 flex items-center justify-between border-b border-pink-500/20",
          "bg-gradient-to-r from-pink-500/5 to-purple-500/5"
        )}>
          <div className="flex items-center">
            <div className="relative">
              <LottieAnimation width={isSidebarCollapsed ? 36 : 42} height={isSidebarCollapsed ? 36 : 42} />
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-lg" />
            </div>
            {!isSidebarCollapsed && (
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  DeployLite
                </h1>
                <p className="text-xs text-gray-400 font-medium">Cloud Platform</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="h-8 w-8 rounded-lg hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300"
          >
            {isSidebarCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-6">
          <NavItems />
        </ScrollArea>

        {/* User Section */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-pink-500/20 bg-gradient-to-r from-pink-500/5 to-purple-500/5">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
              <Avatar className="h-10 w-10 ring-2 ring-pink-500/30">
                <AvatarImage src={user?.img} alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                  {user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">₹{wallet?.balance}.00</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Navbar */}
        <header className="flex items-center justify-between p-4 bg-black/95 backdrop-blur-xl border-b border-pink-500/20">
          <div className="flex items-center">
            {/* Mobile Sidebar Toggle */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden h-10 w-10 rounded-xl hover:bg-pink-500/10 hover:text-pink-300"
                >
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 p-0 bg-gradient-to-b from-black via-gray-900/95 to-black backdrop-blur-xl border-pink-500/20"
              >
                {/* Mobile Header */}
                <div className="p-6 border-b border-pink-500/20 bg-gradient-to-r from-pink-500/5 to-purple-500/5">
                  <div className="flex items-center">
                    <LottieAnimation width={42} height={42} />
                    <div className="ml-3">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        DeployLite
                      </h1>
                      <p className="text-xs text-gray-400 font-medium">Cloud Platform</p>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Navigation */}
                <ScrollArea className="flex-1 px-6 py-6">
                  <NavItems isMobile={true} />
                </ScrollArea>

                {/* Mobile User Section */}
                <div className="p-6 border-t border-pink-500/20 bg-gradient-to-r from-pink-500/5 to-purple-500/5">
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                    <Avatar className="h-12 w-12 ring-2 ring-pink-500/30">
                      <AvatarImage src={user?.img} alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                        {user?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-200">{user?.name}</p>
                      <p className="text-sm text-gray-400">₹{wallet?.balance}.00</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold md:hidden bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              DeployLite
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Create Button - smaller on mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 rounded-xl font-medium shadow-lg shadow-pink-500/25 transition-all duration-300 px-3 sm:px-4 h-9 sm:h-10 text-sm">
                  <PlusIcon className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Create</span>
                  <ChevronDownIcon className="h-4 w-4 sm:ml-2 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-black/95 backdrop-blur-xl border-pink-500/20">
                <DropdownMenuLabel className="text-gray-200">Create New Project</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-pink-500/20" />
                <Link href="/project/app-platform">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300 rounded-lg m-1">
                    <CodeIcon className="mr-3 h-5 w-5 text-pink-400" />
                    <div className="flex flex-col">
                      <span className="font-medium">Frontend</span>
                      <span className="text-xs text-gray-400">React, Vue, Angular</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/project/app-platform">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300 rounded-lg m-1">
                    <ServerIcon className="mr-3 h-5 w-5 text-purple-400" />
                    <div className="flex flex-col">
                      <span className="font-medium">Backend</span>
                      <span className="text-xs text-gray-400">Node.js, Python, Java</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/project/app-platform">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300 rounded-lg m-1">
                    <GlobeIcon className="mr-3 h-5 w-5 text-blue-400" />
                    <div className="flex flex-col">
                      <span className="font-medium">Fullstack</span>
                      <span className="text-xs text-gray-400">Next.js, MERN, MEAN</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/project/webbuilder">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300 rounded-lg m-1">
                    <GlobeIcon className="mr-3 h-5 w-5 text-green-400" />
                    <div className="flex flex-col">
                      <span className="font-medium">Web Builder</span>
                      <span className="text-xs text-gray-400">No-code solution</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/project/database">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300 rounded-lg m-1">
                    <DatabaseIcon className="mr-3 h-5 w-5 text-yellow-400" />
                    <div className="flex flex-col">
                      <span className="font-medium">Database</span>
                      <span className="text-xs text-gray-400">SQL, NoSQL</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/project/storage">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300 rounded-lg m-1">
                    <HardDrive className="mr-3 h-5 w-5 text-indigo-400" />
                    <div className="flex flex-col">
                      <span className="font-medium">Cloud Studio</span>
                      <span className="text-xs text-gray-400">Storage, Buckets, Object Store</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="hidden sm:flex bg-black/50 border-pink-500/30 hover:bg-pink-500/10 hover:border-pink-500/50 text-gray-200 hover:text-pink-300 rounded-xl px-4 h-10 transition-all duration-300"
                >
                  <WalletIcon className="mr-2 h-4 w-4" />
                  <span className="font-semibold">₹{wallet?.balance}.00</span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/95 backdrop-blur-xl border-pink-500/20">
                <DropdownMenuLabel className="text-gray-200">Wallet</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-pink-500/20" />
                <Link href="/wallet">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300">
                    <WalletIcon className="mr-2 h-4 w-4" />
                    View Wallet
                  </DropdownMenuItem>
                </Link>
                <Link href="/wallet">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300">
                    <CreditCardIcon className="mr-2 h-4 w-4" />
                    Recharge Balance
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300"
                >
                  <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  {unreadNotifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white text-xs font-bold animate-pulse"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-black/95 backdrop-blur-xl border-pink-500/20">
                <DropdownMenuLabel className="flex justify-between text-gray-200">
                  Notifications
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs hover:text-pink-300"
                  >
                    Mark all as read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-pink-500/20" />
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2 p-2">
                    <DropdownMenuItem className="hover:bg-pink-500/10 transition-all duration-300 rounded-lg">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-gray-200">
                          New deployment successful
                        </p>
                        <p className="text-xs text-gray-400">
                          Project X deployed to production
                        </p>
                        <p className="text-xs text-pink-400">
                          2 minutes ago
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-pink-500/10 transition-all duration-300 rounded-lg">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-gray-200">
                          Database backup completed
                        </p>
                        <p className="text-xs text-gray-400">
                          Weekly backup finished successfully
                        </p>
                        <p className="text-xs text-pink-400">
                          1 hour ago
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-pink-500/10 transition-all duration-300 rounded-lg">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-gray-200">
                          New team member added
                        </p>
                        <p className="text-xs text-gray-400">
                          John Doe joined Project Y
                        </p>
                        <p className="text-xs text-pink-400">
                          2 hours ago
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </ScrollArea>
                <DropdownMenuSeparator className="bg-pink-500/20" />
                <DropdownMenuItem className="text-center justify-center hover:bg-pink-500/10">
                  <Link href="/notifications" className="w-full text-pink-400 hover:text-pink-300">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-pink-500/30 hover:ring-pink-500/50 transition-all duration-300">
                  <AvatarImage src={user?.img} alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-semibold">
                    {user?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-xl border-pink-500/20">
                <DropdownMenuLabel className="text-gray-200">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs text-gray-400 font-normal">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-pink-500/20" />
                <Link href="/profile">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/billing">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300">
                    <WalletIcon className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-pink-500/20" />
                <DropdownMenuItem 
                  onClick={() => setIsOpen(true)}
                  className="hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <LogoutModal isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-black via-gray-900/50 to-black">
          {children}
        </main>
      </div>
    </div>
  );
}