import { createContext, useContext, useMemo, useState } from "react";
import * as styles from "./ControlPanel.css";

export type ControlPanelContext = {
  overlays: {
    photos: boolean;
    routes: boolean;
    tracks: boolean;
  };
  toggleOverlay: (overlay: keyof ControlPanelContext["overlays"]) => void;
};

const createDefaultControlPanelContext = () => ({
  overlays: {
    photos: true,
    routes: true,
    tracks: true,
  },
  toggleOverlay: () => {
    // Do nothing
  },
});

const ControlPanelContext = createContext<ControlPanelContext>(
  createDefaultControlPanelContext(),
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
    createDefaultControlPanelContext,
  );

  const value = useMemo(
    (): ControlPanelContext => ({
      ...controlPanelContext,
      toggleOverlay: (overlay) => {
        setControlPanelContext((context) => ({
          ...context,
          overlays: {
            ...context.overlays,
            [overlay]: !context.overlays[overlay],
          },
        }));
      },
    }),
    [controlPanelContext],
  );

  return (
    <ControlPanelContext.Provider value={value}>
      {children}
    </ControlPanelContext.Provider>
  );
};

export const ControlPanel = ({
  showPhotosSelector = true,
  showRoutesSelector = true,
  showTracksSelector = true,
}: {
  showPhotosSelector?: boolean;
  showTracksSelector?: boolean;
  showRoutesSelector?: boolean;
}) => {
  const { overlays, toggleOverlay } = useControlPanel();

  return (
    <div className={styles.controlPanel}>
      <div>
        <b>Overlays</b>
        {showRoutesSelector && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={overlays.routes}
                onChange={() => {
                  toggleOverlay("routes");
                }}
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
                onChange={() => {
                  toggleOverlay("tracks");
                }}
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
                onChange={() => {
                  toggleOverlay("photos");
                }}
              />
              Photos
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
