"use client"

import * as React from 'react'
import type { MindMapConnection as ConnectionType } from '@/types/mind-map.ts'
import useMindMapStore from '@/store/mind-map-store'

interface ConnectionProps {
  connection: ConnectionType
}

export function MindMapConnection({ connection }: ConnectionProps) {
  const { present } = useMindMapStore();
  const { nodes, zoom } = present;
  const sourceNode = nodes[connection.sourceId]
  const targetNode = nodes[connection.targetId]

  if (!sourceNode || !targetNode) return null

  // Calculate the center points of the nodes in the unscaled coordinate space
  const unscaledSourceX = sourceNode.position.x + 60; // Unscaled x-coordinate of source node connection point
  const unscaledSourceY = sourceNode.position.y + 20; // Unscaled y-coordinate of source node connection point
  const unscaledTargetX = targetNode.position.x + 60; // Unscaled x-coordinate of target node connection point
  const unscaledTargetY = targetNode.position.y + 20; // Unscaled y-coordinate of target node connection point

  // Calculate dx and dy using unscaled coordinates
  const dx = unscaledTargetX - unscaledSourceX;
  const dy = unscaledTargetY - unscaledSourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  // Control distance affects curve shape relative to line length, calculate based on unscaled distance
  const controlDistance = distance * 0.3; // Increased curve intensity for better visibility, adjust as needed

  // Calculate perpendicular offset for control points based on unscaled dx and dy
  const offsetX = distance === 0 ? 0 : -dy / distance * controlDistance;
  const offsetY = distance === 0 ? 0 : dx / distance * controlDistance;

  // Create two control points for a subtle curve, relative to unscaled source/target points
  const control1X_unscaled = unscaledSourceX + dx * 0.5 + offsetX;
  const control1Y_unscaled = unscaledSourceY + dy * 0.5 + offsetY;
  const control2X_unscaled = unscaledSourceX + dx * 0.5 - offsetX;
  const control2Y_unscaled = unscaledSourceY + dy * 0.5 - offsetY;

  // Scale all coordinates for the path
  const sourceX = unscaledSourceX * zoom;
  const sourceY = unscaledSourceY * zoom;
  const targetX = unscaledTargetX * zoom;
  const targetY = unscaledTargetY * zoom;
  const control1X = control1X_unscaled * zoom;
  const control1Y = control1Y_unscaled * zoom;
  const control2X = control2X_unscaled * zoom;
  const control2Y = control2Y_unscaled * zoom;

  // Create the path for the curved line using cubic bezier with scaled coordinates
  const path = `M ${sourceX} ${sourceY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${targetX} ${targetY}`;

  const scaledStrokeWidth = 3 * zoom; // Scale stroke width by zoom level

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        // Remove scale transform from SVG, path coordinates are already scaled
        // transform: `scale(${zoom})`,
        // transformOrigin: 'top left',
        overflow: 'visible'
      }}
    >
      {/* Main connection line */}
      <path
        d={path}
        // Apply stroke color and other styles directly
        stroke="currentColor" // Default stroke color (will be overridden by CSS)
        strokeWidth={scaledStrokeWidth} // Scaled stroke width
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary/80 dark:stroke-gray-400 drop-shadow-sm dark:drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]" // Use Tailwind classes for theme-based color and shadow
      />
    </svg>
  )
} 