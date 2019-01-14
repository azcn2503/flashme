import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { keepAlive } from "client/api/site";

class KeepAlive extends PureComponent {
  constructor(props) {
    super(props);
    this.interval = null;
    this.keepAlive = this.keepAlive.bind(this);
  }

  componentWillMount() {
    this.interval = setInterval(this.keepAlive, this.props.interval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  keepAlive() {
    keepAlive().catch(err =>
      console.error("Could not send keep-alive request", err)
    );
  }

  render() {
    return null;
  }
}

KeepAlive.propTypes = {
  interval: PropTypes.number
};

KeepAlive.defaultProps = {
  interval: 30000
};

export default KeepAlive;
