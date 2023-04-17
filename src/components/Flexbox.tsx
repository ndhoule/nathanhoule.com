import cn from "classnames";
import React from "react";
import * as styles from "./Flexbox.css";

export type BoxProps = React.ComponentProps<typeof Box>;

export const Box = ({
  children,
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <div className={cn(styles.box, className)} {...otherProps}>
    {children}
  </div>
);

export const Flex = ({
  children,
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <div className={cn(styles.flex, className)} {...otherProps}>
    {children}
  </div>
);

export const FlexColumn = ({
  children,
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <div className={cn(styles.flexColumn, className)} {...otherProps}>
    {children}
  </div>
);

export const FlexRow = ({
  children,
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <div className={cn(styles.flexRow, className)} {...otherProps}>
    {children}
  </div>
);
