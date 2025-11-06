"use client"

import * as React from 'react'
import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { MindMapNode as NodeType } from '@/types/mind-map'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useMindMapStore from '@/store/mind-map-store'
import Editor from 'react-simple-wysiwyg'

interface MindMapNodeProps {
  node: NodeType
}

export function MindMapNode({ node }: MindMapNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<any>(null)
  const { updateNodePosition, updateNodeTitle, deleteNode, setIsAnyNodeEditing, setJustBlurredFromNode, present } = useMindMapStore()
  const { zoom } = present; // Access zoom from present

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent canvas click
    if (e.button !== 0) return // Only handle left click

    const rect = nodeRef.current?.getBoundingClientRect()
    if (!rect) return

    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !nodeRef.current) return

    // Scale mouse movement by current zoom level
    const x = (e.clientX - dragOffset.x) / zoom;
    const y = (e.clientY - dragOffset.y) / zoom;

    updateNodePosition(node.id, { x, y })
  }

  const handleMouseUp = (e: MouseEvent) => {
    e.stopPropagation() // Prevent canvas click
    setIsDragging(false)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent canvas click
    setIsEditing(true)
    setIsAnyNodeEditing(true); // Set global editing state to true
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent canvas click
    deleteNode(node.id)
  }

  const handleEditorBlur = () => {
    setIsEditing(false)
    setIsAnyNodeEditing(false); // Set global editing state to false
    setJustBlurredFromNode(true); // Indicate that a node just blurred
  }

  const handleEditorChange = (e: any) => {
    updateNodeTitle(node.id, e.target.value)
  }

  // Handle key down events in the editor
  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    // Check if the Enter key was pressed (key code 13)
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent default behavior (new line)
      setIsEditing(false) // Exit editing mode
      setIsAnyNodeEditing(false); // Set global editing state to false
    }
  }

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Focus and select all text when editing starts
  React.useEffect(() => {
    if (isEditing && editorRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      
      // Select all contents of the editable div
      range.selectNodeContents(editorRef.current);
      
      // Clear any existing selections and add the new range
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      // Note: react-simple-wysiwyg's ref is the contenteditable div itself
    }
  }, [isEditing])

  return (
    <div
      ref={nodeRef}
      className={`mind-map-node absolute select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: node.position.x * zoom, // Scale left position
        top: node.position.y * zoom, // Scale top position
        transform: `scale(${zoom})`,
        transformOrigin: 'center',
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`group relative bg-card border rounded-lg shadow-lg p-2 min-w-[120px] ${
          node.type === 'root' ? 'border-primary' : 'border-border'
        }`}
      >
        {isEditing ? (
          <Editor
            ref={editorRef}
            value={node.title}
            onChange={handleEditorChange}
            onBlur={handleEditorBlur}
            onKeyDown={handleEditorKeyDown}
          />
        ) : (
          <div
            className="px-2 py-1 cursor-text"
            onDoubleClick={handleDoubleClick}
            dangerouslySetInnerHTML={{ __html: node.title }}
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDelete}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 