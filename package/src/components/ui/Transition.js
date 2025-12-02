/**
 * @fileoverview Animated transition effects.
 * @module src/components/ui
 * @author Rakshana
 * @date 31/10/2025
 * @since 1.0.0
 */



import React from "react";
import { Slide } from "@mui/material";

/**
 * A reusable, generic Slide transition component for animating sections or content
 * with upward slide-in effects by default. Optimized for performance with configurable
 * props, mountOnEnter, and unmountOnExit to prevent unnecessary renders.
 *
 * @example
 * <AnimatedSlide in={showForm} timeout={800}>
 *   <Paper>...</Paper>
 * </AnimatedSlide>
 *
 * @param {Object} props - Standard Slide props from MUI, plus defaults for common use cases.
 * @param {string} [props.direction="up"] - Slide direction.
 * @param {boolean} [props.in] - Whether to show the component.
 * @param {number} [props.timeout=800] - Animation timeout.
 * @param {boolean} [props.mountOnEnter=false] - Mount on enter.
 * @param {boolean} [props.unmountOnExit=false] - Unmount on exit.
 * @param {Object} [props.easing] - Easing curves.
 * @param {ReactNode} props.children - Child elements.
 */
const AnimatedSlide = (props) => {
  const {
    direction = "up", // Default to upward slide for section reveals
    in: inProp,
    timeout = 800, // Default timeout matching the original usage
    mountOnEnter = false, // Enable for conditional content to avoid initial mount
    unmountOnExit = false, // Enable for cleanup on exit
    easing = { // Smooth easing for natural feel
      enter: "cubic-bezier(0.4, 0, 0.2, 1)",
      exit: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    children,
    ...rest
  } = props;

  return (
    <Slide
      direction={direction}
      in={inProp}
      timeout={timeout}
      mountOnEnter={mountOnEnter}
      unmountOnExit={unmountOnExit}
      easing={easing}
      {...rest}
    >
      {children}
    </Slide>
  );
};

export default AnimatedSlide;