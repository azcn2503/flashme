export const SHOW_TOOLTIP = "SHOW_TOOLTIP";
export const HIDE_TOOLTIP = "HIDE_TOOLTIP";

export const showTooltip = ({ x, y, width, height, message }) => ({
  type: SHOW_TOOLTIP,
  x,
  y,
  width,
  height,
  message
});

export const hideTooltip = () => ({
  type: HIDE_TOOLTIP
});
