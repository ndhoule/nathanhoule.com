import { Control, type ControlOptions, DomUtil } from "leaflet";

export interface LegendControlOptions extends ControlOptions {
  items?: { color: string; label: string }[] | undefined;
}

export class LegendControl extends Control {
  // @ts-expect-error(ndhoule)
  public override options: LegendControlOptions;

  public override onAdd() {
    const { items = [] } = this.options;

    const className = "leaflet-control-legend";
    const container = DomUtil.create("legend", className);

    if (items.length === 0) {
      return container;
    }

    container.innerHTML += "<h4>Legend</h4>";
    for (const { color, label } of items) {
      container.innerHTML += `<i style="background: ${color}"></i><span>${label}</span><br>`;
    }

    return container;
  }
}
