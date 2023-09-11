import { cjsInterop } from "vite-plugin-cjs-interop";

export default {
  plugins: [
    cjsInterop({
      dependencies: ["@googlemaps/js-api-loader"],
    }),
  ],
};
