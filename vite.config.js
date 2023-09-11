import { cjsInterop } from "vite-plugin-cjs-interop";

export default {
  ssr: {
    noExternal: ["@googlemaps/js-api-loader"],
  },
  plugins: [
    cjsInterop({
      dependencies: ["@googlemaps/js-api-loader"],
    }),
  ],
};
