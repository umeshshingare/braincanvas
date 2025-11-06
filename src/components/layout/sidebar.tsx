"use client"

import { useCallback, useState } from "react"
import useMindMapStore from "@/store/mind-map-store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  FileJson,
  PenToolIcon,
  Trash2,
} from "lucide-react"

export function Sidebar() {
  const { addNode, zoomIn, zoomOut, resetView, exportAsPng, exportAsJson, clearMindMap } = useMindMapStore()

  const handleAddNode = useCallback((type: "text" | "image" | "link") => {
    // Add node at center of viewport
    const viewportCenter = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
    addNode(null, viewportCenter, type)
  }, [addNode])

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed left-0 top-0 z-40 h-screen w-16 border-r bg-background p-2 hidden md:block">
        <div className="flex h-full flex-col items-center gap-4">

          <div className="my-4">
            <PenToolIcon className="w-5 h-5 text-primary" />
          </div>

          <div className="w-6 h-[1px] bg-border" />

          {/* Node Creation Tools */}
          <div className="flex flex-col items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAddNode("text")}
                >
                  <Type className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Text Node</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAddNode("image")}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Image Node</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAddNode("link")}
                >
                  <LinkIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Link Node</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-6 h-[1px] bg-border" />

          {/* View Controls */}
          <div className="flex flex-col items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={zoomIn}>
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Zoom In</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={zoomOut}>
                  <ZoomOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Zoom Out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={resetView}>
                  <Maximize className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Reset View</TooltipContent>
            </Tooltip>
          </div>

          {/* Export Tools */}
          <div className="mt-auto flex flex-col items-center gap-2 mb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={exportAsPng}>
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Export as PNG</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={exportAsJson}>
                  <FileJson className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Export as JSON</TooltipContent>
            </Tooltip>

            <div className="w-6 h-[1px] bg-border my-2" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearMindMap}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Reset Canvas</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 z-40 w-full border-t bg-background p-2 md:hidden">
        <div className="flex items-center justify-around">
          <Button variant="ghost" size="icon" onClick={() => handleAddNode("text")}>
            <Type className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleAddNode("image")}>
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleAddNode("link")}>
            <LinkIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={zoomIn}>
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={zoomOut}>
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearMindMap}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  )
} 