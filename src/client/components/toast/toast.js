import React, { PureComponent } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import difference from "lodash/difference";

import * as styles from "client/styles/variables";
import { getVisibleToasts } from "client/state/reducers/toasts";
import { closeToast } from "client/state/actions/toasts";

const StyledToastContainer = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledToast = styled.div`
  display: flex;
  background-color: ${styles.white100};
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: ${styles.borderRadiusSmall};
  box-shadow: ${styles.boxShadowSmall};
`;

class Toast extends PureComponent {
  static mapStateToProps(state) {
    return {
      toasts: getVisibleToasts(state.toasts)
    };
  }

  constructor(props) {
    super(props);
    this._timers = {};
  }

  componentDidMount() {
    this.startToastCloseTimer(this.props.toasts);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.toasts !== this.props.toasts) {
      const newToasts = difference(nextProps.toasts, this.props.toasts);
      if (newToasts.length > 0) {
        this.startToastCloseTimer(newToasts);
      }
    }
  }

  startToastCloseTimer(toasts = this.props.toasts) {
    toasts.forEach(toast => {
      this._timers[toast.id] = setTimeout(() => {
        this.closeToast(toast.id);
      }, 5000);
    });
  }

  closeToast(id) {
    this.props.dispatch(closeToast(id));
    this._timers[id] = null;
  }

  render() {
    return (
      <StyledToastContainer>
        {this.props.toasts.map(toast => (
          <StyledToast key={toast.id}>{toast.message}</StyledToast>
        ))}
      </StyledToastContainer>
    );
  }
}

export default connect(Toast.mapStateToProps)(Toast);
