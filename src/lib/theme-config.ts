/**
 * Central theme configuration for the application
 * This ensures consistent styling across components
 */

// Brand colors
export const brandColors = {
  primary: {
    bg: "bg-orange-500",
    text: "text-orange-500",
    border: "border-orange-500",
    hover: {
      bg: "hover:bg-orange-600",
      text: "hover:text-orange-600",
      border: "hover:border-orange-600",
    },
  },
  secondary: {
    bg: "bg-gray-200",
    text: "text-gray-700",
    border: "border-gray-300",
    hover: {
      bg: "hover:bg-gray-300",
      text: "hover:text-gray-800",
      border: "hover:border-gray-400",
    },
  },
  success: {
    bg: "bg-green-500",
    text: "text-green-500",
    border: "border-green-500",
    hover: {
      bg: "hover:bg-green-600",
      text: "hover:text-green-600",
      border: "hover:border-green-600",
    },
  },
  warning: {
    bg: "bg-amber-500",
    text: "text-amber-500",
    border: "border-amber-500",
    hover: {
      bg: "hover:bg-amber-600",
      text: "hover:text-amber-600",
      border: "hover:border-amber-600",
    },
  },
  danger: {
    bg: "bg-red-500",
    text: "text-red-500",
    border: "border-red-500",
    hover: {
      bg: "hover:bg-red-600",
      text: "hover:text-red-600",
      border: "hover:border-red-600",
    },
  },
  info: {
    bg: "bg-blue-500",
    text: "text-blue-500",
    border: "border-blue-500",
    hover: {
      bg: "hover:bg-blue-600",
      text: "hover:text-blue-600",
      border: "hover:border-blue-600",
    },
  },
};

// Button variants
export const buttonStyles = {
  primary: `${brandColors.primary.gradient} ${brandColors.primary.gradientHover} text-white`,
  secondary: "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50",
  outline: "bg-transparent border border-gray-200 text-gray-800 hover:bg-gray-50",
  ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
  link: `${brandColors.primary.text} ${brandColors.primary.textHover} bg-transparent underline`,
  danger: "bg-red-500 hover:bg-red-600 text-white",
};

// Text styles
export const textStyles = {
  heading: {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-bold",
    h3: "text-xl font-bold",
    h4: "text-lg font-bold",
    h5: "text-base font-bold",
    h6: "text-sm font-bold",
  },
  body: {
    large: "text-lg",
    base: "text-base",
    small: "text-sm",
    tiny: "text-xs",
  },
};

// Spacing
export const spacing = {
  container: {
    sm: "max-w-sm mx-auto px-4",
    md: "max-w-md mx-auto px-4",
    lg: "max-w-lg mx-auto px-4",
    xl: "max-w-xl mx-auto px-4",
    "2xl": "max-w-2xl mx-auto px-4",
    full: "w-full px-4",
  },
  xs: "space-y-1",
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-6",
  xl: "space-y-8",
  "2xl": "space-y-10",
};

// Animation durations
export const animations = {
  fast: "duration-150",
  normal: "duration-300",
  slow: "duration-500",
  fadeIn: "animate-fadeIn",
  fadeOut: "animate-fadeOut",
  slideIn: "animate-slideIn",
  slideOut: "animate-slideOut",
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",
};

export const buttonSizes = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-2.5 text-lg",
  xl: "px-6 py-3 text-xl",
};

export const inputSizes = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-2.5 text-lg",
  xl: "px-6 py-3 text-xl",
};

export const fontSizes = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

export const borderRadius = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const shadows = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
}; 