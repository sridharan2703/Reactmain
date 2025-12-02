/**
 * @file FancyCircularLoader.jsx
 * @author Susmitha
 * @date 20-09-2025
 * @description A sophisticated animated circular loader component with multiple concentric rings
 * @version 1.0.0
 *
 * @example
 * // Basic usage
 * <FancyCircularLoader />
 *
 * @example
 * // With progress indicator
 * <FancyCircularLoader progress={45} />
 *
 * @example
 * // In a loading state
 * function App() {
 *   const [loading, setLoading] = useState(true);
 *   const [progress, setProgress] = useState(0);
 *
 *   return (
 *     <div>
 *       {loading && <FancyCircularLoader progress={progress} />}
 *     </div>
 *   );
 * }
 */

import React from "react";
import styled, { keyframes } from "styled-components";

// ============================================================================
// ANIMATION KEYFRAMES
// ============================================================================

/**
 * Animation for the outermost ring (Ring A)
 * Features complex stroke-dasharray and stroke-width changes for pulsating effect
 */
const ringA = keyframes`
  from, 4% { 
    stroke-dasharray: 0 660; 
    stroke-width: 20; 
    stroke-dashoffset: -330; 
  }
  12% { 
    stroke-dasharray: 60 600; 
    stroke-width: 30; 
    stroke-dashoffset: -335; 
  }
  32% { 
    stroke-dasharray: 60 600; 
    stroke-width: 30; 
    stroke-dashoffset: -595; 
  }
  40%, 54% { 
    stroke-dasharray: 0 660; 
    stroke-width: 20; 
    stroke-dashoffset: -660; 
  }
  62% { 
    stroke-dasharray: 60 600; 
    stroke-width: 30; 
    stroke-dashoffset: -665; 
  }
  82% { 
    stroke-dasharray: 60 600; 
    stroke-width: 30; 
    stroke-dashoffset: -925; 
  }
  90%, to { 
    stroke-dasharray: 0 660; 
    stroke-width: 20; 
    stroke-dashoffset: -990; 
  }
`;

/**
 * Animation for the innermost ring (Ring B)
 * Smaller circumference with synchronized timing for cohesive visual effect
 */
const ringB = keyframes`
  from, 12% { 
    stroke-dasharray: 0 220; 
    stroke-width: 20; 
    stroke-dashoffset: -110; 
  }
  20% { 
    stroke-dasharray: 20 200; 
    stroke-width: 30; 
    stroke-dashoffset: -115; 
  }
  40% { 
    stroke-dasharray: 20 200; 
    stroke-width: 30; 
    stroke-dashoffset: -195; 
  }
  48%, 62% { 
    stroke-dasharray: 0 220; 
    stroke-width: 20; 
    stroke-dashoffset: -220; 
  }
  70% { 
    stroke-dasharray: 20 200; 
    stroke-width: 30; 
    stroke-dashoffset: -225; 
  }
  90% { 
    stroke-dasharray: 20 200; 
    stroke-width: 30; 
    stroke-dashoffset: -305; 
  }
  98%, to { 
    stroke-dasharray: 0 220; 
    stroke-width: 20; 
    stroke-dashoffset: -330; 
  }
`;

/**
 * Animation for the middle ring (Ring C)
 * Medium circumference with offset timing for wave-like propagation
 */
const ringC = keyframes`
  from { 
    stroke-dasharray: 0 440; 
    stroke-width: 20; 
    stroke-dashoffset: 0; 
  }
  8% { 
    stroke-dasharray: 40 400; 
    stroke-width: 30; 
    stroke-dashoffset: -5; 
  }
  28% { 
    stroke-dasharray: 40 400; 
    stroke-width: 30; 
    stroke-dashoffset: -175; 
  }
  36%, 58% { 
    stroke-dasharray: 0 440; 
    stroke-width: 20; 
    stroke-dashoffset: -220; 
  }
  66% { 
    stroke-dasharray: 40 400; 
    stroke-width: 30; 
    stroke-dashoffset: -225; 
  }
  86% { 
    stroke-dasharray: 40 400; 
    stroke-width: 30; 
    stroke-dashoffset: -395; 
  }
  94%, to { 
    stroke-dasharray: 0 440; 
    stroke-width: 20; 
    stroke-dashoffset: -440; 
  }
`;

/**
 * Animation for the second middle ring (Ring D)
 * Similar to Ring C but with different timing for layered effect
 */
const ringD = keyframes`
  from, 8% { 
    stroke-dasharray: 0 440; 
    stroke-width: 20; 
    stroke-dashoffset: 0; 
  }
  16% { 
    stroke-dasharray: 40 400; 
    stroke-width: 30; 
    stroke-dashoffset: -5; 
  }
  36% { 
    stroke-dasharray: 40 400; 
    stroke-width: 30; 
    stroke-dashoffset: -175; 
  }
  44%, 50% { 
    stroke-dasharray: 0 440; 
    stroke-width: 20; 
    stroke-dashoffset: -220; 
  }
  58% { 
    stroke-dasharray: 40 400; 
    stroke-width: 30; 
    stroke-dashoffset: -225; 
  }
  78% { 
    stroke-dasharray: 40 400; 
    stroke-width: 30; 
    stroke-dashoffset: -395; 
  }
  86%, to { 
    stroke-dasharray: 0 440; 
    stroke-width: 20; 
    stroke-dashoffset: -440; 
  }
`;

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

/**
 * Main wrapper component that centers the loader on the screen
 * Uses fixed positioning to overlay on top of other content
 */
const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 16px;
  color: #2563eb;
  background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent background */
  z-index: 1000; /* Ensure it appears above other content */

  /* Full screen center positioning */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

/**
 * SVG container for the animated rings
 * Responsive sizing that scales with container
 */
const Svg = styled.svg`
  width: 6em;
  height: 6em;
`;

/**
 * Base ring component with common styles for all circles
 * Defines the fundamental circle properties without animations
 */
const Ring = styled.circle`
  fill: none; /* Transparent fill to show only the stroke */
  stroke-linecap: round; /* Rounded line ends for smoother appearance */
  transform-origin: center; /* Ensure rotations and transforms originate from center */
`;

/**
 * Outer ring component - Largest circle with red color
 * Applies the ringA animation sequence
 */
const RingA = styled(Ring)`
  stroke: #f42f25; /* Vibrant red color */
  animation: ${ringA} 2s linear infinite; /* Continuous 2-second animation */
`;

/**
 * Inner ring component - Smallest circle with orange color
 * Applies the ringB animation sequence
 */
const RingB = styled(Ring)`
  stroke: #f49725; /* Warm orange color */
  animation: ${ringB} 2s linear infinite; /* Continuous 2-second animation */
`;

/**
 * Middle ring component - Blue colored ring
 * Applies the ringC animation sequence
 */
const RingC = styled(Ring)`
  stroke: #255ff4; /* Bright blue color */
  animation: ${ringC} 2s linear infinite; /* Continuous 2-second animation */
`;

/**
 * Secondary middle ring component - Pink colored ring
 * Applies the ringD animation sequence
 */
const RingD = styled(Ring)`
  stroke: #f42582; /* Vibrant pink color */
  animation: ${ringD} 2s linear infinite; /* Continuous 2-second animation */
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * FancyCircularLoader Component
 *
 * A sophisticated loading indicator featuring four concentric animated rings
 * with synchronized but offset animations creating a wave-like visual effect.
 * Each ring has its own color and animation timing for a dynamic appearance.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} [props.progress=0] - Optional progress percentage to display (0-100)
 * @returns {React.Element} Rendered loader component
 *
 * @features
 * - Four concentric circles with perfect circular shape
 * - Synchronized but offset animations
 * - Progress indicator display
 * - Full-screen overlay positioning
 * - Responsive design
 * - Accessibility considerations
 *
 * @accessibility
 * - SVG includes title for screen readers
 * - Color contrast meets WCAG guidelines
 * - Progress text provides context
 */
const FancyCircularLoader = ({ progress = 0 }) => {
  return (
    <LoaderWrapper role="status" aria-live="polite">
      <Svg
        viewBox="0 0 220 220"
        aria-label="Loading indicator with animated rings"
      >
        <title>Loading animation with progress {progress}%</title>

        {/* 
          CONCENTRIC RINGS LAYOUT:
          - All circles share the same center point (110, 110) for perfect concentric alignment
          - Radii are carefully spaced to prevent overlap while maintaining visual harmony
          - Stroke widths vary during animation (20-30) creating pulsating effect
        */}

        {/* Outer ring - Largest radius with red color */}
        <RingA r="100" cx="110" cy="110" />

        {/* First middle ring - Blue color, medium radius */}
        <RingC r="70" cx="110" cy="110" />

        {/* Second middle ring - Pink color, smaller radius */}
        <RingD r="40" cx="110" cy="110" />

        {/* Inner ring - Smallest radius with orange color */}
        <RingB r="10" cx="110" cy="110" />
      </Svg>

      {/* Progress indicator text */}
      <div>Loading records... {progress}%</div>
    </LoaderWrapper>
  );
};

export default FancyCircularLoader;
