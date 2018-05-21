import * as React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import { withStyles } from 'material-ui/styles';
import { darken, lighten } from 'material-ui/styles/colorManipulator';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
  },
  checkBoxRoot: {
    color: lighten(theme.palette.primary.light, 0.1),
    '&$checkBoxChecked': {
      color: theme.palette.primary.light,
    },
  },
  checkBoxChecked: {},

  spinner: {
    size: 44,
    color: darken(theme.palette.primary.light, 0.25),
  },
});

const WidgetCheckbox = props => (
  <div className={props.classes.div}>
    <Checkbox
      checked={props.CheckState}
      onChange={(event, checked) => props.checkEventHandler(checked)}
      classes={{
        root: props.classes.checkBoxRoot,
        checked: props.classes.checkBoxChecked,
      }}
      value={props.Label}
      disabled={props.Pending}
    />
  </div>
);

WidgetCheckbox.propTypes = {
  CheckState: PropTypes.bool.isRequired,
  checkEventHandler: PropTypes.func.isRequired,
  Pending: PropTypes.bool,
  Label: PropTypes.string,
  classes: PropTypes.shape({
    div: PropTypes.string,
    checkBoxRoot: PropTypes.string,
    checkBoxChecked: PropTypes.string,
  }).isRequired,
};

WidgetCheckbox.defaultProps = {
  Pending: false,
  Label: '',
};

export default withStyles(styles, { withTheme: true })(WidgetCheckbox);