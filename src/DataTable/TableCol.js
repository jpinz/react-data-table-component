import React, { memo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Cell } from "./Cell";
import { useTableContext } from "./DataTableContext";
import NativeSortIcon from "../icons/NativeSortIcon";
import TableColSubheader from "./TableColSubheader";

const TableColStyle = styled(Cell)`
  ${(props) => props.column.button && "text-align: center"};
`;

const ColumnSortable = styled.div`
  display: inline-flex;
  align-items: center;
  height: 100%;
  line-height: 1;
  user-select: none;
  ${(props) =>
    props.sortActive
      ? props.theme.headCells.activeSortStyle
      : props.theme.headCells.inactiveSortStyle};

  span.__rdt_custom_sort_icon__ {
    i,
    svg {
      ${(props) => (props.sortActive ? "opacity: 1" : "opacity: 0")};
      color: inherit;
      font-size: 18px !important;
      height: 18px !important;
      width: 18px !important;
      backface-visibility: hidden;
      transform-style: preserve-3d;
      transition-duration: 125ms;
      transition-property: transform;
    }

    &.asc i,
    &.asc svg {
      transform: rotate(180deg);
    }
  }

  &:hover {
    ${({ column }) => column.sortable && "cursor: pointer"};
    ${({ column, theme }) => column.sortable && theme.headCells.activeStyle};

    span,
    span.__rdt_custom_sort_icon__ * {
      ${({ sortActive, column }) =>
        !sortActive && column.sortable && "opacity: 1"};
    }
  }
`;

const TableCol = memo(({ column, sortIcon }) => {
  const {
    dispatch,
    pagination,
    paginationServer,
    sortColumn,
    sortDirection,
    sortServer,
    selectableRowsVisibleOnly,
    persistSelectedOnSort,
    filterColumn,
    filterValue,
    filterServer,
    persistSelectedOnFilter,
  } = useTableContext();

  if (column.omit) {
    return null;
  }

  const handleSortChange = () => {
    if (column.sortable) {
      let direction = sortDirection;
      // change sort direction only if sortColumn (currently selected column) is === the newly clicked column
      // otherwise, retain sort direction if the column is switched
      if (sortColumn === column.selector) {
        direction = sortDirection === "asc" ? "desc" : "asc";
      }

      dispatch({
        type: "SORT_CHANGE",
        sortDirection: direction,
        sortColumn: column.selector,
        sortServer,
        selectedColumn: column,
        pagination,
        paginationServer,
        visibleOnly: selectableRowsVisibleOnly,
        persistSelectedOnSort,
      });
    }
  };

  const handleFilterChange = (e) => {
    if (column.filter) {
      let value = filterValue;
      // change filtering value only if filterColumn (currently selected column) is === the newly clicked column
      // otherwise, retain filter direction if the column is switched
      // if (filterColumn === column.selector) {
      value = e.target.value;
      // }

      dispatch({
        type: "FILTER_CHANGE",
        filterValue: value,
        filterColumn: column.selector,
        filterServer,
        selectedColumn: column,
        pagination,
        paginationServer,
        visibleOnly: selectableRowsVisibleOnly,
        persistSelectedOnFilter,
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSortChange();
    }
  };

  const renderNativeSortIcon = (sortActive) => (
    <NativeSortIcon
      column={column}
      sortActive={sortActive}
      sortDirection={sortDirection}
    />
  );

  const renderCustomSortIcon = () => (
    <span className={[sortDirection, "__rdt_custom_sort_icon__"].join(" ")}>
      {sortIcon}
    </span>
  );

  const renderFilter = (filter) => {
    if (filter == true || filter == "search") {
      return <input type="search" onChange={handleFilterChange}></input>;
    }
    if (filter == "select") {
      var val = function (X) {
        return <option key={X}>{X}</option>;
      };
      return (
        <select onChange={handleFilterChange}>
          <option value="">None</option>
          {column.values.map(val)}
        </select>
      );
    }
    return (null);
  };

  const sortActive = column.sortable && sortColumn === column.selector;
  const nativeSortIconLeft = column.sortable && !sortIcon && !column.right;
  const nativeSortIconRight = column.sortable && !sortIcon && column.right;
  const customSortIconLeft = column.sortable && sortIcon && !column.right;
  const customSortIconRight = column.sortable && sortIcon && column.right;

  return (
    <TableColStyle
      className="rdt_TableCol"
      column={column} // required by Cell.js
      head
    >
      <div>
        {column.name && (
          <ColumnSortable
            id={`column-${column.selector}`}
            role="columnheader"
            tabIndex={0}
            className="rdt_TableCol_Sortable"
            onClick={handleSortChange}
            onKeyPress={handleKeyPress}
            sortActive={sortActive}
            column={column}
          >
            {customSortIconRight && renderCustomSortIcon()}
            {nativeSortIconRight && renderNativeSortIcon(sortActive)}
            <div>{column.name}</div>
            {customSortIconLeft && renderCustomSortIcon()}
            {nativeSortIconLeft && renderNativeSortIcon(sortActive)}
          </ColumnSortable>
        )}
        {column.filter && typeof column.filter == "function" && column.filter(column, handleFilterChange)}
        {column.filter && renderFilter(column.filter)}
      </div>
    </TableColStyle>
  );
});

TableCol.propTypes = {
  column: PropTypes.object.isRequired,
  sortIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};

export default TableCol;
