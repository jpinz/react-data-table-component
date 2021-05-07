import React, { memo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const alignMap = {
  left: "flex-start",
  right: "flex-end",
  center: "center",
};

const SubheaderWrapper = styled.header`
  position: relative;
  display: flex;
  flex: 1 1 auto;
  box-sizing: border-box;
  align-items: center;
  padding: 4px 16px 4px 24px;
  width: 100%;
  justify-content: ${props => alignMap[props.align]};
  flex-wrap: ${props => (props.wrapContent ? 'wrap' : 'nowrap')};
  ${props => props.theme.subHeader.style}
`;

const TableColSubheader = ({ id, column, align, wrapContent }) => (
  <SubheaderWrapper align={align} wrapContent={wrapContent}>
    {column.subHeader && column.subHeader(column, id)}
  </SubheaderWrapper>
);

TableColSubheader.propTypes = {
  id: PropTypes.string.isRequired,
  column: PropTypes.object.isRequired,
  align: PropTypes.oneOf(['center', 'left', 'right']),
  wrapContent: PropTypes.bool,
};

TableColSubheader.defaultProps = {
  align: 'center',
  wrapContent: true,
};

export default TableColSubheader;
