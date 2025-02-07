"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { LiaDocker } from "react-icons/lia";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from '@/lib/hook'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MenuIcon, HomeIcon, RocketIcon, LayersIcon, SettingsIcon, PlusIcon, ChevronDownIcon, UserIcon, WalletIcon, LogOutIcon, CreditCardIcon, BellIcon, SunIcon, MoonIcon, CodeIcon, ServerIcon, GlobeIcon, DatabaseIcon, Router,Rocket,CloudLightning ,HardDrive} from 'lucide-react'
import { useRouter } from 'next/navigation'
import LogoutModal from '../modals/LogoutModal'
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(3)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const wallet = useAppSelector(state=>state.wallet.wallet)
  const user = useAppSelector(state=>state.user.user)

  useEffect(() => {
    setMounted(true)
  }, [])

  const NavItems = () => (
    <div>
      <Link href="/" passHref>
        <Button variant="ghost" className="w-full justify-start">
          <HomeIcon className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      <Link href="/deployments" passHref>
        <Button variant="ghost" className="w-full justify-start">
          <RocketIcon className="mr-2 h-4 w-4" />
          Deployments
        </Button>
      </Link>
      <Collapsible
        open={isProjectsOpen}
        onOpenChange={setIsProjectsOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
      
        
          <Button variant="ghost" className="w-full justify-start">
            <LayersIcon className="mr-2 h-4 w-4" />
            Projects
            <ChevronDownIcon className={`ml-auto h-4 w-4 transition-transform duration-200 ${isProjectsOpen ? 'transform rotate-180' : ''}`} />
          </Button>
         
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 px-4 py-2">
        <Link href={"/project/app-platform"}>
          <Button variant="ghost" className="w-full justify-start pl-6">
            <CodeIcon className="mr-2 h-4 w-4" />
            App Platform
          </Button>
          </Link>
          <Link href={"/project/webbuilder"}>
          <Button variant="ghost" className="w-full justify-start pl-6">
            <LayersIcon className="mr-2 h-4 w-4" />
            Web Builder
          </Button>
          </Link>
          <Link href={"/project/database"}>
          <Button variant="ghost" className="w-full justify-start pl-6">
            <DatabaseIcon className="mr-2 h-4 w-4" />
            Database
          </Button>
          </Link>
          <Link href={"/project/storage"}>
          <Button variant="ghost" className="w-full justify-start pl-6">
            <HardDrive className="mr-2 h-4 w-4" />
            Storage
          </Button>
          </Link>
        </CollapsibleContent>
      </Collapsible>
      
      <Link href="/customization" passHref>
        <Button variant="ghost" className="w-full justify-start">
          <CloudLightning className="mr-2 h-4 w-4" />
            Cloud Customization
        </Button>
      </Link>
      <Link href="https://dockergen.deploylite.tech" target="_blank">
        <Button variant="ghost" className="w-full justify-start">
          <LiaDocker className="mr-2 h-4 w-4" />
            DockerGen
        </Button>
      </Link>
      <Link href="/settings" passHref>
        <Button variant="ghost" className="w-full justify-start">
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </Link>
    </div>
  )

  const markAllAsRead = () => {
    setUnreadNotifications(0)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex w-64 flex-col bg-background border-r">
        <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Rocket className="w-6 h-6 mr-2 text-blue-500" />
            DeployLite
          </h1>
        </div>
        <ScrollArea className="flex-grow">
          <nav className="space-y-2 p-4">
            <NavItems />
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="flex items-center justify-between p-4 bg-background border-b">
          <div className="flex items-center">
            {/* Menu button for mobile */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4">
                  <h2 className="text-2xl font-bold">DeployLite</h2>
                </div>
                <nav className="space-y-2 p-4">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-semibold md:hidden">DeployLite</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>

            {/* Create Dropdown */}
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
                    <span className="text-xs text-muted-foreground">React, Vue, Angular</span>
                  </div>
                </DropdownMenuItem>
                </Link>
                <Link href="/project/app-platform">
                <DropdownMenuItem>
                  <ServerIcon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Backend</span>
                    <span className="text-xs text-muted-foreground">Node.js, Python, Java</span>
                  </div>
                </DropdownMenuItem>
                </Link>
                <Link href="/project/app-platform">
                <DropdownMenuItem>
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Fullstack</span>
                    <span className="text-xs text-muted-foreground">Next.js, MERN, MEAN</span>
                  </div>
                </DropdownMenuItem>
                </Link>
                <Link href="/project/webbuilder">
                <DropdownMenuItem>
                  <LayersIcon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Web Builder</span>
                    <span className="text-xs text-muted-foreground">No-code solution</span>
                  </div>
                </DropdownMenuItem>
                </Link>
                <Link href="/project/database">
                <DropdownMenuItem>
                  <DatabaseIcon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Database</span>
                    <span className="text-xs text-muted-foreground">SQL, NoSQL</span>
                  </div>
                </DropdownMenuItem>
                </Link>
                <Link href="/project/storage">
                <DropdownMenuItem>
                  <HardDrive className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Cloud Studio</span>
                    <span className="text-xs text-muted-foreground">Storage, Buckets, Object Store</span>
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
                    <Badge variant="destructive" className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center">
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
                        <p className="text-sm font-medium">New deployment successful</p>
                        <p className="text-xs text-muted-foreground">Project X deployed to production</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">Database backup completed</p>
                        <p className="text-xs text-muted-foreground">Weekly backup finished successfully</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">New team member added</p>
                        <p className="text-xs text-muted-foreground">John Doe joined Project Y</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  <Link href="/notifications" className="w-full text-primary">View all notifications</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user&&user.img} alt="User" />
                  <AvatarFallback>{user&&user.name[0]}</AvatarFallback>
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
                <DropdownMenuItem
                >
                  <WalletIcon className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                </Link>

                <Link href={"/settings"}>
               
                <DropdownMenuItem 
        
                >
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>setIsOpen(true)}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <LogoutModal isOpen={isOpen} setIsOpen={setIsOpen} />
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}