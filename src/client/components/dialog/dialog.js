import React, { PureComponent } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import styles from "./dialog.scss";

class Dialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      opening: false,
      closing: false
    };
    this._parent = null;
    this._container = null;
    this.onClickBackground = this.onClickBackground.bind(this);
    this.onContainerTransitionEnd = this.onContainerTransitionEnd.bind(this);
    this.onKeyDownWindow = this.onKeyDownWindow.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDownWindow);
    if (this._container) {
      this._container.addEventListener(
        "transitionend",
        this.onContainerTransitionEnd
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {
      if (nextProps.open) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDownWindow);
    if (this._container) {
      this._container.removeEventListener(
        "transitionend",
        this.onContainerTransitionEnd
      );
    }
  }

  onKeyDownWindow(e) {
    if (e.keyCode === 27 && this.state.open && !this.state.closing) {
      this.close();
    }
  }

  onContainerTransitionEnd() {
    if (this.state.opening && !this.state.open) {
      this.setState({
        open: true,
        opening: false
      });
    } else if (this.state.closing && this.state.open) {
      this.setState({
        open: false,
        closing: false
      });
    }
  }

  onClickBackground() {
    if (this.props.closeOnClickBackground) {
      this.close();
    }
  }

  close() {
    this.setState({
      closing: true
    });
    if (this.props.onClose) {
      this.props.onClose(this);
    }
  }

  open() {
    this.setState({
      opening: true
    });
    if (this.props.onOpen) {
      this.props.onOpen(this);
    }
  }

  renderHeader() {
    if (this.props.header) {
      return <div className={styles.header}>{this.props.header}</div>;
    } else {
      return null;
    }
  }

  renderBody() {
    if (this.props.body) {
      return <div className={styles.body}>{this.props.body}</div>;
    } else {
      return null;
    }
  }

  renderFooter() {
    if (this.props.footer) {
      return <div className={styles.footer}>{this.props.footer}</div>;
    } else {
      return null;
    }
  }

  render() {
    return (
      <div
        ref={el => (this._container = el)}
        className={classNames(styles.dialog, {
          [styles.open]: this.state.open,
          [styles.opening]: this.state.opening,
          [styles.closing]: this.state.closing
        })}
      >
        <div className={styles.background} onClick={this.onClickBackground} />
        <div className={styles.window}>
          {this.renderHeader()}
          {this.renderBody()}
          {this.renderFooter()}
        </div>
      </div>
    );
  }
}

Dialog.propTypes = {
  open: PropTypes.bool,
  closeOnClickBackground: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  header: PropTypes.node,
  body: PropTypes.node,
  footer: PropTypes.node
};

Dialog.defaultProps = {
  open: false,
  closeOnClickBackground: true
};

export default Dialog;
