export function adjustAlphaColor(rgbaColor, alpha) {
    const colors = rgbaColor.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/);
    return `rgba(${colors[1]}, ${colors[2]}, ${colors[3]}, ${alpha})`;
}