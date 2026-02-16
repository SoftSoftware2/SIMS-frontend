<script setup lang="ts">
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-vue-next"

import { ref } from "vue"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const props = defineProps<{
  versions: string[]
  defaultVersion: string
}>()

const selectedVersion = ref(props.defaultVersion)
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd class="size-4" />
            </div>
            <div class="flex flex-col gap-0.5 leading-none">
              <span class="font-medium">SIMS</span>
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
