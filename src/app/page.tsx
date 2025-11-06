"use client"

import { useState } from 'react'
import { TopBar } from "@/components/layout/top-bar"
import { Sidebar } from "@/components/layout/sidebar"
import { MindMapCanvas } from "@/components/canvas/mind-map-canvas"
import Footer from "@/components/layout/footer"
import { Loader } from '@/components/ui/loader'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <Loader onComplete={() => setIsLoading(false)} />
      {!isLoading && (
        <>
          <TopBar />
          <Sidebar />
          <MindMapCanvas />
          <Footer />
        </>
      )}
    </main>
  )
}