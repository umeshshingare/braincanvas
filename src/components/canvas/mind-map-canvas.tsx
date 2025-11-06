"use client"

import * as React from 'react'
import { useRef, useState } from 'react'
import { MindMapNode } from './mind-map-node'
import { MindMapConnection } from './mind-map-connection'
import useMindMapStore from '@/store/mind-map-store'
import { MindMapNode as NodeType } from '@/types/mind-map'

export function MindMapCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { present, addNode, setJustBlurredFromNode, setCanvasOffset } = useMindMapStore()
  const { nodes, connections, rootNodeId, isAnyNodeEditing, justBlurredFromNode, canvasOffset, zoom } = present;
  const lastEditExitTime = useRef(0);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mouseDownPosRef = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!isAnyNodeEditing) {
      lastEditExitTime.current = Date.now();
    }
  }, [isAnyNodeEditing]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isAnyNodeEditing || (e.target as HTMLElement).closest('.mind-map-node')) return;

    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (!isDraggingCanvas) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setCanvasOffset({
      x: canvasOffset.x + deltaX,
      y: canvasOffset.y + deltaY,
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (justBlurredFromNode) {
      console.log("Canvas click consumed after node blur.");
      setJustBlurredFromNode(false);
      return;
    }

    if (isAnyNodeEditing) {
      return;
    }

    const target = e.target as HTMLElement
    
    const moveDistance = Math.sqrt(
      Math.pow(e.clientX - mouseDownPosRef.current.x, 2) +
      Math.pow(e.clientY - mouseDownPosRef.current.y, 2)
    );

    const isDragClick = moveDistance > 5;

    if (
      target.closest('.mind-map-node') || 
      target.closest('.rsw-editor') ||
      isDragClick
    ) {
      return
    }

    if (!canvasRef.current?.contains(target)) return;

    const rect = canvasRef.current.getBoundingClientRect()

    const clickX_canvas = e.clientX - rect.left;
    const clickY_canvas = e.clientY - rect.top;

    const x = (clickX_canvas - canvasOffset.x) / zoom;
    const y = (clickY_canvas - canvasOffset.y) / zoom;

    if (!rootNodeId) {
      addNode(null, { x, y })
    } else {
      addNode(rootNodeId, { x, y })
    }
  }

  React.useEffect(() => {
    if (isDraggingCanvas) {
      window.addEventListener('mousemove', handleCanvasMouseMove);
      window.addEventListener('mouseup', handleCanvasMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      window.removeEventListener('mouseup', handleCanvasMouseUp);
    };
  }, [isDraggingCanvas, dragStart, canvasOffset, zoom]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-background mind-map-canvas"
      onClick={handleCanvasClick}
      onMouseDown={handleCanvasMouseDown}
      data-export="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(#ddd_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {Object.values(connections).map((connection) => (
            <MindMapConnection key={connection.id} connection={connection} />
          ))}
        </div>
        
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {Object.values(nodes).map((node: NodeType) => (
            <MindMapNode key={node.id} node={node} />
          ))}
        </div>
      </div>

      {!rootNodeId && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
          <div className="text-muted-foreground text-sm">
            Click anywhere to create your first node
          </div>
        </div>
      )}
    </div>
  )
} 