import { definePlugin } from "@halo-dev/console-shared";
import { markRaw } from "vue";
import SlideEditor from "@/components/slideEditor/index.vue";
import SLideManage from "@/components/slideManage/index.vue";
import Index from "./views/index.vue";
import RiSlideshow2Line from '~icons/ri/slideshow-2-line';
import RiSlideshowFill from '~icons/ri/slideshow-fill';
import BxSlideshow from '~icons/bx/slideshow';
// 文件幻灯片
import BiFileEarmarkSlides from '~icons/bi/file-earmark-slides';
export default definePlugin({
  name: "plugin-blog-hao",
  components: {},
  routes: [                                 // Console 控制台路由定义
    {
      parentName: "ToolsRoot",
      route: {
        path: "/slide",
        name: "Slide",
        component: Index,
        meta: {
          permissions: [""],
          menu: {
            name: "幻灯片",
            group: "content",
            icon: markRaw(RiSlideshow2Line),
            priority: 90
          },
        },
        children: [
          {
            path: "",
            name: "SlideIndex",
            component: markRaw(SLideManage),
          },
          {
            path: "new_slide",
            name: "NewSlide",
            component: markRaw(SlideEditor),
          }
        ]
      },
    },
  ],
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
