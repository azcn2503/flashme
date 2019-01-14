import React, { PureComponent } from "react";
import classNames from "classnames";
import styled from "styled-components";
import * as styles from "client/styles/variables.js";

const borderColor = props => {
  if (props.deleting) return styles.deleteColor;
  if (props.dirty) return styles.darkGrey;
  if (props.highlightUpdate) return styles.successColor;
  if (props.selected) return styles.primaryColor;
  return styles.black38;
};

const StyledCard = styled.div`
  position: relative;
  width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => borderColor(props)};
  box-shadow: ${styles.boxShadowSmall};
  border-radius: ${styles.borderRadiusSmall};
  background-color: ${styles.white100};
`;

class Card extends PureComponent {
  render() {
    const {
      children,
      className,
      deleting,
      dirty,
      highlightUpdate,
      selected
    } = this.props;
    return (
      <StyledCard
        className={className}
        deleting={deleting}
        dirty={dirty}
        highlightUpdate={highlightUpdate}
        selected={selected}
      >
        {children}
      </StyledCard>
    );
  }
}

export default Card;
