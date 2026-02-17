<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  Command,
  Building2,
  Gauge
} from "lucide-vue-next"

import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: "inset",
})

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/app/home",
      icon: Gauge,
      isActive: true,
    },
    {
      title: "Administración",
      url: "/app",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Empresas",
          url: "/app/companies",
        },
        {
          title: "Admins",
          url: "/app/admins",
        },
        {
          title: "Vehicle Types",
          url: "/app/vehicle-types",
        },
        {
          title: "Vehicles",
          url: "/app/vehicles",
        },
      ],
    },
  ]
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">SIMS</span>
                <span class="truncate text-xs">SoftSoftware</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
