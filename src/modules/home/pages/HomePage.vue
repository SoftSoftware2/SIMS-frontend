<template>
  <div class="min-h-screen w-full flex justify-center bg-background p-4">
    <div class="w-full max-w-4xl">
      <div class="text-center space-y-8">
        <!-- Hero Section -->
        <div class="space-y-4">
          <h1 class="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to SIMS
          </h1>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Integrated Management System
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card class="bg-card border border-border">
            <CardHeader class="text-center">
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle class="text-lg">Fast</CardTitle>
              <CardDescription class="text-sm">
                Optimized performance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card class="bg-card border border-border">
            <CardHeader class="text-center">
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <CardTitle class="text-lg">Secure</CardTitle>
              <CardDescription class="text-sm">
                Protected data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card class="bg-card border border-border">
            <CardHeader class="text-center">
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle class="text-lg">Simple</CardTitle>
              <CardDescription class="text-sm">
                Intuitive interface
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <!-- CTA Section -->
        <div class="bg-card rounded-2xl shadow-2xl border border-border p-8 md:p-12 mt-12">
          <h2 class="text-2xl font-bold text-foreground mb-3">
            Ready to start?
          </h2>
          <p class="text-muted-foreground mb-6">
            Explore all SIMS features
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <Button class="px-8">
              Get Started
            </Button>
            <Button variant="outline" class="px-8">
              Learn More
            </Button>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-sm text-muted-foreground mt-8">
          © 2026 SIMS. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>