import { definePlugin } from "@halo-dev/console-shared";
import { markRaw } from "vue";
import SlideEditor from "@/components/slideEditor/index.vue";


export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "editor:create": () => {
      return [
        {
          name: "revealjs",
          displayName: "revealjs",
          component: markRaw(SlideEditor),
          rawType: "revealjs",
        },
      ];
    },
  },
});
