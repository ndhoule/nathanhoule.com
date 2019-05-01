import { SerializedStyles, css } from "@emotion/react";
import * as React from "react";

type MenuProps = React.PropsWithChildren<{
  css?: SerializedStyles;
}>;

export const Menu: React.FunctionComponent<MenuProps> = ({
  children,
  css: userCss,
}) => (
  <div
    css={[
      css`
        align-items: center;
        display: flex;
        padding-top: 15px;
        padding-bottom: 15px;
      `,
      userCss,
    ]}
  >
    {children}
  </div>
);

export type MenuItemProps = React.PropsWithChildren<{
  css?: SerializedStyles;
}>;

export const MenuItem: React.FunctionComponent<MenuItemProps> = ({
  children,
  css: userCss,
}) => (
  <div
    css={[
      userCss,
      css`
        padding-left: 15px;
        padding-right: 15px;
      `,
    ]}
  >
    {children}
  </div>
);

export interface SubMenuProps {
  css?: SerializedStyles;
  position?: "left" | "right";
}

export const SubMenu: React.FunctionComponent<SubMenuProps> = ({
  children,
  css: userCss,
  position = "left",
}) => (
  <div
    // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Alignment/Box_Alignment_in_Flexbox#Alignment_and_auto_margins
    css={[
      css`
        display: flex;
        align-items: inherit;
        ${position === "left" ? null : "margin-left: auto;"}
      `,
      userCss,
    ]}
  >
    {children}
  </div>
);
