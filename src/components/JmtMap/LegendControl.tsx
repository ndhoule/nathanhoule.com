import { createControlComponent } from "@react-leaflet/core";
import {
  LegendControl as BaseLegendControl,
  type LegendControlOptions as BaseLegendControlOptions,
} from "./legend_control";

export type LegendControlProps = BaseLegendControlOptions;

export const LegendControl = createControlComponent<
  BaseLegendControl,
  BaseLegendControlOptions
>((props) => new BaseLegendControl(props));
