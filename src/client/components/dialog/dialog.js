import React, { PureComponent } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import styles from "./dialog.scss";

class Dialog extends PureComponent {
  constructor(props) {
    super(props);
    this._parent = null;
    this._container = null;
    this.onClickBackground = this.onClickBackground.bind(this);
    this.onKeyDownWindow = this.onKeyDownWindow.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDownWindow);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDownWindow);
  }

  onKeyDownWindow(e) {
    if (e.keyCode === 27 && this.state.open && !this.state.closing) {
      this.close();
    }
  }

  onClickBackground() {
    if (this.props.closeOnClickBackground) {
      this.close();
    }
  }

  close() {
    this.props.hideDialog();
    if (this.props.onClose) {
      this.props.onClose(this);
    }
  }

  open() {
    this.props.showDialog();
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
          [styles.open]: this.props.open
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
  footer: PropTypes.node,
  hideDialog: PropTypes.func,
  showDialog: PropTypes.func
};

Dialog.defaultProps = {
  open: false,
  closeOnClickBackground: true
};

export default Dialog;
