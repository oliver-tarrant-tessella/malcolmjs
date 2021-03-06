export const openParentPanelType = 'OPEN_PARENT_PANEL';
export const updateVersionNumerType = 'UPDATE_VERSION';
export const showFooterType = 'SHOW_FOOTER_TYPE';
export const snackbar = 'PUSH_SNACKBAR';
export const popout = 'WINDOW_IS_POPOUT';
export const panelDirection = 'PANEL_TRANSITION_DIRECTION';

export const openParentPanel = open => ({
  type: openParentPanelType,
  openParentPanel: open,
});

export const snackbarState = (open, message) => ({
  type: snackbar,
  snackbar: {
    open,
    message,
  },
});

export const updateVersionNumber = (version, title) => ({
  type: updateVersionNumerType,
  payload: {
    version,
    title,
  },
});

export const showFooterAction = footerHeight => ({
  type: showFooterType,
  payload: {
    footerHeight,
  },
});

export const flagAsPopout = () => ({
  type: popout,
});

export const parentPanelTransition = transition => ({
  type: panelDirection,
  payload: {
    transition,
  },
});

export default {
  openParentPanel,
};
