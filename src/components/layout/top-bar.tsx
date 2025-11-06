"use client"

import { Save, Undo, Redo, Download, MoreVertical, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import useMindMapStore from "@/store/mind-map-store"

export function TopBar() {
  const { present, updateTitle, undo, redo, saveMindMap, exportAsPng, exportAsJson } = useMindMapStore();
  const canUndo = useMindMapStore(state => state.past.length > 0);
  const canRedo = useMindMapStore(state => state.future.length > 0);
  const { zoomIn, zoomOut } = useMindMapStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg">
      <Input
        type="text"
        placeholder="Untitled Mind Map"
        value={present.title}
        onChange={(e) => updateTitle(e.target.value)}
        className="w-[100px] sm:w-[300px] border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="h-4 w-[1px] bg-border" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={saveMindMap}>
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={!canUndo}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={!canRedo}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <div className="h-4 w-[1px] bg-border" />
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportAsPng}>
              <Download className="mr-2 h-4 w-4" />
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportAsJson}>
              <Download className="mr-2 h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 