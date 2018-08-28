import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const baseDiv = {
  display: 'flex',
  alignItems: 'center',
};

const textUpdateBase = {
  padding: 4,
  paddingRight: 9,
  textAlign: 'Right',
  width: '80%',
  whiteSpace: 'pre',
};

const styles = theme => ({
  div: {
    ...baseDiv,
    borderLeft: `2px solid ${
      theme.widgetColours ? theme.widgetColours.textUpdateBar : 'grey'
    }`,
  },
  divNoWrap: {
    ...baseDiv,
    padding: 4,
    paddingRight: 4,
  },
  textUpdateNoWrap: {
    textAlign: 'Right',
    width: '100%',
    wordWrap: 'break-word',
  },
  textUpdate80: textUpdateBase,
  textUpdate100: {
    ...textUpdateBase,
    paddingRight: 4,
    width: '100%',
  },
  unitBox: {
    color: emphasize(theme.palette.primary.contrastText, 0.2),
    padding: 4,
    paddingRight: 2,
    width: '20%',
  },
});

const WidgetTextUpdate = props => {
  let valueString =
    props.Text !== undefined ? props.Text.toString() : 'UNDEFINED';
  const whiteSpace = valueString !== '' ? {} : { whiteSpace: 'pre' };
  valueString = valueString !== '' ? valueString : ' ';
  if (!props.Units) {
    if (!props.noWrap) {
      return (
        <div className={props.classes.divNoWrap}>
          <Typography
            className={props.classes.textUpdateNoWrap}
            style={whiteSpace}
          >
            {valueString}
          </Typography>
        </div>
      );
    }
    return (
      <div className={props.classes.div}>
        <Typography
          className={props.classes.textUpdate100}
          style={whiteSpace}
          noWrap
        >
          {valueString}
        </Typography>
      </div>
    );
  }
  return (
    <div className={props.classes.div}>
      <Typography
        className={props.classes.textUpdate80}
        style={whiteSpace}
        noWrap
      >
        {valueString}
      </Typography>
      <Typography className={props.classes.unitBox} noWrap>
        {props.Units}
      </Typography>
    </div>
  );
};

WidgetTextUpdate.propTypes = {
  Text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  Units: PropTypes.string,
  classes: PropTypes.shape({
    textUpdate100: PropTypes.string,
    textUpdate80: PropTypes.string,
    unitBox: PropTypes.string,
    div: PropTypes.string,
    divNoWrap: PropTypes.string,
    textUpdateNoWrap: PropTypes.string,
  }).isRequired,
  noWrap: PropTypes.bool,
};

WidgetTextUpdate.defaultProps = {
  Units: null,
  noWrap: true,
};

export default withStyles(styles, { withTheme: true })(WidgetTextUpdate);
