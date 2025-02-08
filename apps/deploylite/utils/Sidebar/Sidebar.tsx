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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MenuIcon,
  HomeIcon,
  Bot,
  LayersIcon,
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
  X as XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoutModal from "../modals/LogoutModal";
import LottieAnimation from "@/components/ui/LottieAnimation";

// A small helper for conditionally combining classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // <-- Hook to get the current route

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // For logout modal

  // New state for desktop sidebar collapsed/expanded
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const wallet = useAppSelector((state) => state.wallet.wallet);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  // Helper to check if a route is "active" (for pink text)
  function isActiveRoute(route: string) {
    return pathname === route;
  }

  // Helper to check if a route is part of a collapsible sub-route
  function isActiveSubRoute(route: string) {
    // e.g. /project/app-platform starts with /project
    return pathname.startsWith(route);
  }

  const NavItems = () => (
    <div className="space-y-3">
      {/* Dashboard */}
      <Link href="/" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-md transition-colors",
            "text-gray-700 dark:text-gray-300",
            // Hover states for text/icon only
            "hover:text-pink-600 dark:hover:text-pink-400",
            // Active route => pink text/icon
            isActiveRoute("/") && "text-pink-600 dark:text-pink-400"
          )}
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          {!isSidebarCollapsed && "Dashboard"}
        </Button>
      </Link>

      {/* Deployments */}
      <Link href="/ai" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-md transition-colors",
            "text-black dark:text-gray-300",
            "hover:text-pink-600 dark:hover:text-pink-400",
            isActiveRoute("/deployments") && "text-pink-600 dark:text-pink-400"
          )}
        >
          <Brain className="mr-2 h-4 w-4" />
          {!isSidebarCollapsed && "Automated Workflows"}
        </Button>
      </Link>

      <Link href="/mlmodel" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-md transition-colors",
            "text-black dark:text-gray-300",
            "hover:text-pink-600 dark:hover:text-pink-400",
            isActiveRoute("/deployments") && "text-pink-600 dark:text-pink-400"
          )}
        >
          <Bot  className="mr-2 h-4 w-4" />
          {!isSidebarCollapsed && "ML Models"}
        </Button>
      </Link>


      {/* Projects (Collapsible) */}
      <Collapsible
        open={isProjectsOpen}
        onOpenChange={setIsProjectsOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start rounded-md transition-colors",
              "text-black dark:text-gray-300",
              "hover:text-pink-600 dark:hover:text-pink-400"
            )}
          >
            <LayersIcon className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && "Projects"}
            <ChevronDownIcon
              className={cn(
                "ml-auto h-4 w-4 transition-transform duration-200",
                isProjectsOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 px-2 py-2">
          <Link href={"/project/app-platform"}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start pl-6 rounded-md transition-colors",
                "text-gray-700 dark:text-gray-300",
                "hover:text-pink-600 dark:hover:text-pink-400",
                isActiveSubRoute("/project/app-platform") &&
                  "text-pink-600 dark:text-pink-400"
              )}
            >
              <CodeIcon className="mr-2 h-4 w-4" />
              {!isSidebarCollapsed && "App Platform"}
            </Button>
          </Link>
          <Link href={"/project/webbuilder"}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start pl-6 rounded-md transition-colors",
                "text-gray-700 dark:text-gray-300",
                "hover:text-pink-600 dark:hover:text-pink-400",
                isActiveSubRoute("/project/webbuilder") &&
                  "text-pink-600 dark:text-pink-400"
              )}
            >
              <LayersIcon className="mr-2 h-4 w-4" />
              {!isSidebarCollapsed && "Web Builder"}
            </Button>
          </Link>
          <Link href={"/project/database"}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start pl-6 rounded-md transition-colors",
                "text-gray-700 dark:text-gray-300",
                "hover:text-pink-600 dark:hover:text-pink-400",
                isActiveSubRoute("/project/database") &&
                  "text-pink-600 dark:text-pink-400"
              )}
            >
              <DatabaseIcon className="mr-2 h-4 w-4" />
              {!isSidebarCollapsed && "Database"}
            </Button>
          </Link>
          <Link href={"/project/storage"}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start pl-6 rounded-md transition-colors",
                "text-gray-700 dark:text-gray-300",
                "hover:text-pink-600 dark:hover:text-pink-400",
                isActiveSubRoute("/project/storage") &&
                  "text-pink-600 dark:text-pink-400"
              )}
            >
              <HardDrive className="mr-2 h-4 w-4" />
              {!isSidebarCollapsed && "Storage"}
            </Button>
          </Link>
        </CollapsibleContent>
      </Collapsible>

      {/* Cloud Customization */}
      <Link href="/customization" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-md transition-colors",
            "text-gray-700 dark:text-gray-300",
            "hover:text-pink-600 dark:hover:text-pink-400",
            isActiveRoute("/customization") &&
              "text-pink-600 dark:text-pink-400"
          )}
        >
          <CloudLightning className="mr-2 h-4 w-4" />
          {!isSidebarCollapsed && "Cloud Customization"}
        </Button>
      </Link>

      {/* DockerGen (external link) */}
      <Link href="https://dockergen.deploylite.tech" target="_blank">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-md transition-colors",
            "text-gray-700 dark:text-gray-300",
            "hover:text-pink-600 dark:hover:text-pink-400"
          )}
        >
          <LiaDocker className="mr-2 h-4 w-4" />
          {!isSidebarCollapsed && "DockerGen"}
        </Button>
      </Link>

      {/* Settings */}
      <Link href="/settings" passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start rounded-md transition-colors",
            "text-gray-700 dark:text-gray-300",
            "hover:text-pink-600 dark:hover:text-pink-400",
            isActiveRoute("/settings") && "text-pink-600 dark:text-pink-400"
          )}
        >
          <SettingsIcon className="mr-2 h-4 w-4" />
          {!isSidebarCollapsed && "Settings"}
        </Button>
      </Link>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r  transition-width duration-200",
          isSidebarCollapsed ? "w-24" : "w-64",
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-black border-pink-600"
        )}
      >
        <div className="p-4 flex items-center  justify-between">
          <div className="flex items-center">
            <LottieAnimation width={40} height={40} />
            {!isSidebarCollapsed && (
              <span className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
                DeployLite
              </span>
            )}
          </div>
          {/* Toggle Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <ScrollArea className="flex-grow">
          <nav className="p-4">
            <NavItems />
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="flex items-center justify-between p-4 bg-background  border-b">
          <div className="flex items-center">
            {/* Mobile Sidebar Toggle */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className={cn(
                  "w-64 p-0 transition-colors duration-200",
                  theme === "light" ? "bg-white" : "bg-neutral-900"
                )}
              >
                {/* Close Button for Mobile Sidebar */}
                <div className="flex justify-end p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <h2 className="text-2xl font-bold">DeployLite</h2>
                </div>
                <nav className="p-4">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold md:hidden">DeployLite</h1>
          </div>

          <div className="flex items-center space-x-4">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Create New Project</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/project/app-platform">
                  <DropdownMenuItem>
                    <CodeIcon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>Frontend</span>
                      <span className="text-xs text-muted-foreground">
                        React, Vue, Angular
                      </span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/project/app-platform">
                  <DropdownMenuItem>
                    <ServerIcon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>Backend</span>
                      <span className="text-xs text-muted-foreground">
                        Node.js, Python, Java
                      </span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/project/app-platform">
                  <DropdownMenuItem>
                    <GlobeIcon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>Fullstack</span>
                      <span className="text-xs text-muted-foreground">
                        Next.js, MERN, MEAN
                      </span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/project/webbuilder">
                  <DropdownMenuItem>
                    <LayersIcon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>Web Builder</span>
                      <span className="text-xs text-muted-foreground">
                        No-code solution
                      </span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/project/database">
                  <DropdownMenuItem>
                    <DatabaseIcon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>Database</span>
                      <span className="text-xs text-muted-foreground">
                        SQL, NoSQL
                      </span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/project/storage">
                  <DropdownMenuItem>
                    <HardDrive className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>Cloud Studio</span>
                      <span className="text-xs text-muted-foreground">
                        Storage, Buckets, Object Store
                      </span>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden sm:flex">
                  <WalletIcon className="mr-2 h-4 w-4" />
                  <span className="font-semibold">₹{wallet.balance}.00</span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Wallet</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={"/wallet"}>
                  <DropdownMenuItem>
                    <WalletIcon className="mr-2 h-4 w-4" />
                    View Wallet
                  </DropdownMenuItem>
                </Link>
                <Link href={"/wallet"}>
                  <DropdownMenuItem>
                    <CreditCardIcon className="mr-2 h-4 w-4" />
                    Recharge Balance
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <BellIcon className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between">
                  Notifications
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2 p-2">
                    <DropdownMenuItem>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                          New deployment successful
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Project X deployed to production
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 minutes ago
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                          Database backup completed
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Weekly backup finished successfully
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 hour ago
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                          New team member added
                        </p>
                        <p className="text-xs text-muted-foreground">
                          John Doe joined Project Y
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  <Link href="/notifications" className="w-full text-primary">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user && user.img} alt="User" />
                  <AvatarFallback>{user && user.name[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/billing">
                  <DropdownMenuItem>
                    <WalletIcon className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                </Link>
                <Link href={"/settings"}>
                  <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <LogoutModal isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
