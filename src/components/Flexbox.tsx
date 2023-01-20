import { css } from "@emotion/react";
import React from "react";

export type BoxProps = React.ComponentProps<typeof Box>;

export const boxStyles = css({
  boxSizing: "border-box",
  margin: 0,
  minWidth: 0,
});

export const flexStyles = css([boxStyles, { display: "flex" }]);

export const flexColumnStyles = css([
  boxStyles,
  flexStyles,
  { flexDirection: "column" },
]);

export const flexRowStyles = css([
  boxStyles,
  flexStyles,
  { flexDirection: "row" },
]);

export const Box = ({
  children,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <div css={boxStyles} {...otherProps}>
    {children}
  </div>
);

export const Flex = ({
  children,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <div css={flexStyles} {...otherProps}>
    {children}
  </div>
);

export const FlexColumn = ({
  children,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <div css={flexColumnStyles} {...otherProps}>
    {children}
  </div>
);

export const FlexRow = ({
  children,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <div css={flexRowStyles} {...otherProps}>
    {children}
  </div>
);
