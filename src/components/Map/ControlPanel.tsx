import { createContext, useContext, useState } from "react";
import * as styles from "./ControlPanel.css";

export type ControlPanelContext = {
  overlays: {
    currentLocation: boolean;
    photos: boolean;
    routes: boolean;
    tracks: boolean;
  };
  toggleOverlay: (overlay: keyof ControlPanelContext["overlays"]) => void;
};

const createDefaultControlPanelContext = () => ({
  overlays: {
    currentLocation: true,
    photos: true,
    routes: true,
    tracks: true,
  },
  toggleOverlay: () => {
    // Do nothing
  },
});

const ControlPanelContext = createContext<ControlPanelContext>(
  createDefaultControlPanelContext()
);

export const useControlPanel = (): ControlPanelContext =>
  useContext(ControlPanelContext);

export const ControlPanelConsumer = ControlPanelContext.Consumer;

export const ControlPanelProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [controlPanelContext, setControlPanelContext] = useState(
    createDefaultControlPanelContext()
  );

  return (
    <ControlPanelContext.Provider
      value={{
        ...controlPanelContext,
        toggleOverlay: (overlay) => {
          setControlPanelContext({
            ...controlPanelContext,
            overlays: {
              ...controlPanelContext.overlays,
              [overlay]: !controlPanelContext.overlays[overlay],
            },
          });
        },
      }}
    >
      {children}
    </ControlPanelContext.Provider>
  );
};

export const ControlPanel = ({
  showCurrentLocationSelector = true,
  showPhotosSelector = true,
  showRoutesSelector = true,
  showTracksSelector = true,
}: {
  showCurrentLocationSelector?: boolean;
  showPhotosSelector?: boolean;
  showTracksSelector?: boolean;
  showRoutesSelector?: boolean;
}) => {
  const { overlays, toggleOverlay } = useControlPanel();

  return (
    <div className={styles.controlPanel}>
      <div>
        <b>Overlays</b>
        {showCurrentLocationSelector && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={overlays.currentLocation}
                onChange={() => toggleOverlay("currentLocation")}
              />
              Current Location
            </label>
          </div>
        )}
        {showRoutesSelector && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={overlays.routes}
                onChange={() => toggleOverlay("routes")}
              />
              Route
            </label>
          </div>
        )}
        {showTracksSelector && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={overlays.tracks}
                onChange={() => toggleOverlay("tracks")}
              />
              Tracks
            </label>
          </div>
        )}
        {showPhotosSelector && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={overlays.photos}
                onChange={() => toggleOverlay("photos")}
              />
              Photos
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
