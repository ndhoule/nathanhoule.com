import {
  type DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { parse as parseDuration } from "@lukeed/ms";
import { useMemo, useState } from "react";
import { parseNonUndefined } from "../../utils/parsers";
import { ControlPanelProvider } from "./ControlPanel";
import { Map as BaseMap, type MapProps as BaseMapProps } from "./Map";
import * as styles from "./TripMap.css";

export type TripMapProps = BaseMapProps & {
  // Using a JSON string prevents Astro from wrapping array elements, making this large GeoJSON-
  // filled state much larger.
  dehydratedState: string;
};

export const TripMap = ({ dehydratedState, ...props }: TripMapProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: parseNonUndefined(parseDuration("10m")),
          },
        },
      }),
  );
  const state = useMemo(
    () => JSON.parse(dehydratedState) as DehydratedState,
    [dehydratedState],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <HydrationBoundary state={state}>
        <div className={styles.mapOuterContainer}>
          <div className={styles.mapInnerContainer}>
            <ControlPanelProvider>
              <BaseMap {...props} />
            </ControlPanelProvider>
          </div>
        </div>
      </HydrationBoundary>
    </QueryClientProvider>
  );
};
