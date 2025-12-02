// src/components/ui/Colors.js
import { useState, useEffect } from 'react';

// Color generator hook
export const useColorGenerator = (defaultColor = '#757575') => {
  const [color, setColor] = useState(defaultColor);

  const generateColor = () => {
    const colors = [
      '#e91e63', // pink
      '#2196f3', // blue
      '#9c27b0', // purple
      '#ff9800', // orange
      '#4caf50', // green
      '#757575'  // gray
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
    return randomColor;
  };

  useEffect(() => {
    generateColor();
  }, []);

  return { color, generateColor };
};

// Dynamic color generator - automatically generates colors without relationship mapping
export const getDynamicColor = () => {
  const colors = [
    '#e91e63', // pink
    '#2196f3', // blue
    '#9c27b0', // purple
    '#ff9800', // orange
    '#4caf50', // green
    '#757575'  // gray
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Color palette for reference
export const colorPalette = {
  pink: '#e91e63',
  blue: '#2196f3',
  purple: '#9c27b0',
  orange: '#ff9800',
  green: '#4caf50',
  gray: '#757575'
};

// Main Colors component
const Colors = ({ children, onColorChange }) => {
  const { color, generateColor } = useColorGenerator();

  const handleColorChange = () => {
    const newColor = generateColor();
    if (onColorChange) {
      onColorChange(newColor);
    }
  };

  return children ? children({ color, generateColor: handleColorChange }) : null;
};

export default Colors;