import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    // backgroundColor: theme.palette.primary.main,
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    paddingRight: 16,
    minHeight: 32,
  },
  expanded: {
    // backgroundColor: theme.palette.primary.main,
    margin: '0px 0 !important',
    minHeight: '32px !important',
  },
  content: {
    // backgroundColor: theme.palette.primary.main,
    margin: '0px 0 !important',
    minHeight: '32px !important',
    display: 'flex',
  },
  expandIcon: {
    width: '24px',
    height: '24px',
  },
  heading: {
    alignSelf: 'center',
  },
  detailsRoot: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 8,
  },
});

const WidgetGroupExpander = props => (
  <div>
    <ExpansionPanel defaultExpanded={props.expanded} elevation={0}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        classes={{
          root: props.classes.root,
          content: props.classes.content,
          expanded: props.classes.expanded,
          expandIcon: props.classes.expandIcon,
        }}
      >
        <Typography className={props.classes.heading} variant="subheading">
          {props.groupName}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        classes={{
          root: props.classes.detailsRoot,
        }}
      >
        <div style={{ width: '100%' }}>{props.children}</div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

WidgetGroupExpander.propTypes = {
  expanded: PropTypes.bool,
  groupName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string,
    expanded: PropTypes.string,
    content: PropTypes.string,
    expandIcon: PropTypes.string,
    heading: PropTypes.string,
    detailsRoot: PropTypes.string,
  }).isRequired,
};

WidgetGroupExpander.defaultProps = {
  expanded: false,
};

export const GroupExpanderComponent = WidgetGroupExpander;
export default withStyles(styles, { withTheme: true })(WidgetGroupExpander);
