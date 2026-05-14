"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon } from "lucide-react"

const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon />
      ),
    },
    {
      title: "Products",
      url: "/products",
      icon: (
        <ListIcon />
      ),
    },
    {
      title: "Stock Movements",
      url: "/stock-movements",
      icon: (
        <ChartBarIcon />
      ),
    },
    {
      title: "Suppliers",
      url: "/suppliers",
      icon: (
        <UsersIcon />
      ),
    },
    {
      title: "Barcode Scanner",
      url: "/scanner",
      icon: (
        <CameraIcon />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: (
        <Settings2Icon />
      ),
    },
    {
      title: "Pricing",
      url: "/pricing",
      icon: (
        <FileTextIcon />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <CircleHelpIcon />
      ),
    },
  ],
  documents: [
    {
      name: "RRA Reports",
      url: "/reports/rra",
      icon: (
        <DatabaseIcon />
      ),
    },
    {
      name: "Inventory Audit",
      url: "/reports/audit",
      icon: (
        <FileChartColumnIcon />
      ),
    },
  ],
}

import { authClient } from "@/lib/auth-client"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession()

  const user = session?.user || data.user

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="data-[slot=sidebar-menu-button]:px-2!"
            >
              <a href="/" className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                  <CommandIcon className="size-4 text-primary" />
                </div>
                <span className="text-sm font-semibold tracking-tight">Stockr</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Platform</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: user.name, email: user.email, avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
