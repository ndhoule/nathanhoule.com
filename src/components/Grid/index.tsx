import { css } from "@emotion/react";
import * as React from "react";

export const Grid: React.FunctionComponent<{
  alignment?: "start" | "center" | "end";
  columns?: number;
}> = ({ alignment = "start", children, columns }) => (
  <div
    css={css`
      display: grid;
      grid-template-columns: repeat(
        ${columns != null ? columns : "auto-fit"},
        1fr
      );
      justify-items: ${alignment};
      width: 100%;
    `}
  >
    {children}
  </div>
);

export type GridProps = React.ComponentPropsWithoutRef<typeof Grid>;

export const Column: React.FunctionComponent<{ width?: number }> = ({
  children,
  width = 1,
}) => (
  <div
    css={css`
      grid-column-end: span ${width};
      grid-column-start: auto;
    `}
  >
    {children}
  </div>
);

export type ColumnProps = React.ComponentPropsWithoutRef<typeof Column>;

export const Row: React.FunctionComponent<{ columns?: number }> = ({
  children,
  columns,
}) => (
  <div
    css={css`
      display: grid;
      grid-template-columns: repeat(
        ${columns != null ? columns : "auto-fit"},
        1fr
      );
      grid-column-end: -1;
      grid-column-start: 1;
      width: 100%;
    `}
  >
    {children}
  </div>
);

export type RowProps = React.ComponentPropsWithoutRef<typeof Row>;
