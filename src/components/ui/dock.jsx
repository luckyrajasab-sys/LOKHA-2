import React, { createContext, useContext, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const DockContext = createContext({
  mouseX: null,
  magnification: 64,
  distance: 140,
});

/**
 * Dock Container
 * Tracks mouseX motion value across all children
 */
export function Dock({
  className,
  children,
  magnification = 58,
  distance = 140,
  direction = 'middle',
  ...props
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <DockContext.Provider value={{ mouseX, magnification, distance }}>
      <motion.nav
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        role="toolbar"
        aria-label="Application navigation dock"
        className={cn(
          'relative flex items-center justify-center gap-2',
          direction === 'top' && 'items-start',
          direction === 'middle' && 'items-center',
          direction === 'bottom' && 'items-end',
          className
        )}
        {...props}
      >
        {children}
      </motion.nav>
    </DockContext.Provider>
  );
}

/**
 * Dock Item
 * Scales dynamically based on distance to mouse cursor
 */
export function DockItem({
  className,
  children,
  onClick,
  onKeyDown,
  isActive = false,
  tabIndex = 0,
  'aria-label': ariaLabel,
  ...props
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { mouseX, magnification = 58, distance = 140 } = useContext(DockContext);

  // Default base size when cursor is far away
  const baseSize = 44;
  const fallbackMouseX = useMotionValue(Infinity);
  const targetMouseX = mouseX || fallbackMouseX;

  const distanceCalc = useTransform(targetMouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [baseSize, magnification, baseSize]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (onClick) {
        e.preventDefault();
        onClick(e);
      }
    }
    if (onKeyDown) onKeyDown(e);
  };

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role="button"
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'dock-item relative flex items-center justify-center rounded-2xl cursor-pointer select-none transition-colors duration-200 outline-none',
        isActive && 'dock-item-active',
        className
      )}
      {...props}
    >
      {/* Pass hovered/focused state to children */}
      {typeof children === 'function' ? children({ isHovered: isHovered || isFocused }) : children}
    </motion.div>
  );
}

/**
 * Dock Label (Tooltip)
 * Appears smoothly when the dock item is hovered or focused
 */
export function DockLabel({ children, className, isVisible = false, ...props }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          role="tooltip"
          className={cn(
            'dock-label pointer-events-none absolute -bottom-8 z-50 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide',
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Dock Icon Wrapper
 */
export function DockIcon({ children, className, ...props }) {
  return (
    <div
      className={cn('dock-icon flex h-full w-full items-center justify-center p-2.5', className)}
      {...props}
    >
      {children}
    </div>
  );
}
