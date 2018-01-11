import React, { PureComponent } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import styles from "./transition.scss";

class Transition extends PureComponent {
  render() {
    return (
      <ReactCSSTransitionGroup
        className={this.props.className}
        component={this.props.component || "span"}
        transitionName={this.props.transitionName || styles}
        transitionAppear
        transitionEnter
        transitionLeave
        transitionAppearTimeout={400}
        transitionEnterTimeout={400}
        transitionLeaveTimeout={400}
      >
        {this.props.children}
      </ReactCSSTransitionGroup>
    );
  }
}

export default Transition;
