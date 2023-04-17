"use client"; // TODO(ndhoule): Push this further down the component stack

import React from "react";
import { ControlPanelProvider } from "./ControlPanel";
import { Map as BaseMap, type MapProps as BaseMapProps } from "./Map";
import * as styles from "./index.css";

export type MapProps = React.ComponentProps<typeof Map>;

export const Map = (props: BaseMapProps) => {
  return (
    <div className={styles.mapOuterContainer}>
      <div className={styles.mapInnerContainer}>
        <ControlPanelProvider>
          <BaseMap {...props} />
        </ControlPanelProvider>
      </div>
    </div>
  );
};
