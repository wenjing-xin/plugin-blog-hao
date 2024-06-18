import { definePlugin } from "@halo-dev/console-shared";
import { BlogHaoSlideExtension } from "./editor";
export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "default:editor:extension:create": () => {
      return [BlogHaoSlideExtension];
    },
  },
});
