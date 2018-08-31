import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { BaseWidget } from 'storm-react-diagrams';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: 20,
  },
  port: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  portIn: {
    marginRight: 3,
  },
  portOut: {
    marginLeft: 3,
  },
  portLabel: {
    fontSize: 12,
  },
  hiddenLink: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    paddingRight: 10,
    borderBottom: '3px dashed rgba(255,255,255,0.5)',
    right: '100%',
    bottom: '40%',
  },
  hiddenLinkLine: {
    width: '100%',
  },
});

class BlockPortWidget extends BaseWidget {
  constructor(props) {
    super('malcolm-port', props);
    this.state = {
      selected: false,
    };
  }

  getClassName() {
    return `port ${this.props.classes.port} ${super.getClassName()}${
      this.state.selected ? this.bem('--selected') : ''
    }`;
  }

  render() {
    const portColour =
      this.props.theme.portColours[this.props.portType] ||
      this.props.theme.palette.primary;

    const portStyle = {
      ...(this.props.inputPort ? styles().portIn : styles().portOut),
      background: this.state.selected ? portColour[100] : portColour[500],
    };

    const hiddenLink = (
      <div className={this.props.classes.hiddenLink}>
        <Typography>{this.props.portValue}</Typography>
      </div>
    );
    const port = (
      <div
        onMouseEnter={() => {
          this.setState({ selected: true });
        }}
        onMouseLeave={() => {
          this.setState({ selected: false });
        }}
        style={portStyle}
        {...this.getProps()}
        data-name={this.props.portName}
        data-nodeid={this.props.nodeId}
        role="presentation"
        onMouseDown={() => this.props.mouseDownHandler(this.props.portId, true)}
        onMouseUp={() => this.props.mouseDownHandler(this.props.portId, false)}
      />
    );
    const label = (
      <Typography className={this.props.classes.portLabel}>
        {this.props.portLabel}
      </Typography>
    );

    return (
      <div className={this.props.classes.container}>
        {this.props.inputPort && this.props.hiddenLink ? hiddenLink : null}
        {this.props.inputPort ? port : label}
        {this.props.inputPort ? label : port}
        {!this.props.inputPort && this.props.hiddenLink ? hiddenLink : null}
      </div>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const node = state.malcolm.layoutEngine.diagramModel.nodes[ownProps.nodeId];
  const port = node ? node.ports[ownProps.portId] : undefined;

  return {
    inputPort: port.in,
    portName: port.name,
    portLabel: port.label,
    portType: port.portType,
    hiddenLink: port.hiddenLink,
    portValue: port.value,
    mouseDownHandler: state.malcolm.layoutEngine.portMouseDown,
  };
};

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(BlockPortWidget)
);
