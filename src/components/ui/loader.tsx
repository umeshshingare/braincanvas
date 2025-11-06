"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenToolIcon } from 'lucide-react'

interface LoaderProps {
  onComplete: () => void
}

export function Loader({ onComplete }: LoaderProps) {
  const [isExiting, setIsExiting] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      // Delay the onComplete callback to allow exit animation to complete
      setTimeout(onComplete, 500)
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence mode="wait">
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -100,
            transition: {
              duration: 0.5,
              ease: "easeInOut"
            }
          }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
              scale: 0.8,
              opacity: 0,
              y: -50,
              transition: {
                duration: 0.5,
                ease: "easeInOut"
              }
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <PenToolIcon className="h-16 w-16 text-primary" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ 
                opacity: 0,
                y: -20,
                transition: {
                  duration: 0.3,
                  ease: "easeInOut"
                }
              }}
              transition={{
                delay: 0.3,
                duration: 0.5,
              }}
              className="text-2xl font-bold tracking-tight"
            >
              BrainCanvas
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ 
                width: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeInOut"
                }
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
              className="h-1 bg-primary/20 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                exit={{ 
                  x: "100%",
                  transition: {
                    duration: 0.3,
                    ease: "easeInOut"
                  }
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="h-full bg-primary"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 