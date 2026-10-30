/**
 * Shared Framer Motion animation variants used throughout CivicAI.
 * Import these in components instead of repeating inline definitions.
 */

// Fade up – used for section headings and page entrances
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' },
  }),
}

// Fade in – simple opacity only
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.35, delay: i * 0.06, ease: 'easeOut' },
  }),
}

// Scale up – for cards and modals
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: i * 0.07, ease: 'easeOut' },
  }),
}

// Slide in from left – for sidebars and mobile menus
export const slideLeft = {
  hidden: { x: -280 },
  visible: { x: 0, transition: { duration: 0.25, ease: 'easeInOut' } },
  exit: { x: -280, transition: { duration: 0.25, ease: 'easeInOut' } },
}

// Slide in from right
export const slideRight = {
  hidden: { x: 280 },
  visible: { x: 0, transition: { duration: 0.25, ease: 'easeInOut' } },
  exit: { x: 280, transition: { duration: 0.25, ease: 'easeInOut' } },
}

// Height collapse – for accordions and error messages
export const heightCollapse = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.2 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } },
}

// Staggered container – wraps a list of items
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
}

// Individual stagger child
export const staggerChild = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// Table row entrance
export const tableRow = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.25, delay: i * 0.03 },
  }),
}

// Slide down – for mobile nav and dropdowns
export const slideDown = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.2 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } },
}

// Viewport default for whileInView
export const viewport = { once: true, margin: '-60px' }
