"use client"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { CirclePlusIcon, MailIcon } from "lucide-react"
import { AddProductSheet } from "@/components/add-product-sheet"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <AddProductSheet
              trigger={
                <SidebarMenuButton
                  tooltip="Add Product"
                  className="min-w-8 bg-primary text-black font-semibold hover:bg-primary/90 transition-all"
                >
                  <CirclePlusIcon className="size-4" />
                  <span>Add Product</span>
                </SidebarMenuButton>
              }
            />
            <Button
              size="icon"
              className="size-8 bg-transparent group-data-[collapsible=icon]:opacity-0"
              variant="ghost"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} className="group-data-[collapsible=icon]:size-8">
                <Link href={item.url}>
                  {item.icon && <div className="size-4 opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</div>}
                  <span className="font-medium tracking-tight">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
