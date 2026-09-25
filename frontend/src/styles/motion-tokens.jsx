// ============================================================
// KrishiSetu Motion Tokens
// Centralized Framer Motion variants.
// ============================================================

export const fadeSlideUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
    },
  },
};

export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 10,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const cardHover = {
  rest: {
    y: 0,
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.05)",
  },

  hover: {
    y: -4,
    boxShadow:
      "0 4px 8px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.10)",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const buttonTap = {
  scale: 0.97,
};

export const buttonHover = {
  scale: 1.02,
};

export const modalSpring = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 8,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },

  exit: {
    opacity: 0,
    scale: 0.97,
    transition: {
      duration: 0.15,
    },
  },
};

export const pillSlide = {
  layout: true,

  transition: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  },
};

export const reducedVariants = {
  hidden: {
    opacity: 1,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0,
    },
  },

  exit: {
    opacity: 1,
    transition: {
      duration: 0,
    },
  },
};