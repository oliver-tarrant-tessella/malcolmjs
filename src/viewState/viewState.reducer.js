import {
  openParentPanelType,
  updateVersionNumerType,
  snackbar,
  showFooterType,
  popout,
  panelDirection,
} from './viewState.actions';

const initialViewState = {
  openParentPanel: true,
  openChildPanel: true,
  snackbar: {
    message: '',
    open: false,
  },
  footerHeight: 0,
  transitionParent: false,
};

const viewStateReducer = (state = initialViewState, action = {}) => {
  switch (action.type) {
    case openParentPanelType:
      return { ...state, openParentPanel: action.openParentPanel };

    case updateVersionNumerType:
      if (document) {
        document.title = `${action.payload.title} ${action.payload.version}`;
      }
      return state;

    case snackbar:
      return {
        ...state,
        snackbar: { ...action.snackbar },
      };

    case showFooterType:
      return {
        ...state,
        footerHeight: action.payload.footerHeight || 0,
      };

    case popout:
      return {
        ...state,
        popout: true,
      };
    case panelDirection:
      return {
        ...state,
        transitionParent: action.payload.transition,
      };
    default:
      return state;
  }
};

export default viewStateReducer;
