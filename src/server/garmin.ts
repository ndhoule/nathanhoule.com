export type GarminClientConfig = {
  auth: {
    password: string;
  };
  mapId: string;
};

export const createGarminClient = (config: GarminClientConfig) => ({
  getMapKml: async () => {
    return fetch(`https://share.garmin.com/Feed/Share/${config.mapId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `:${config.auth.password}`
        ).toString("base64")}`,
      },
    });
  },
});
