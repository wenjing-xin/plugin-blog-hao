import {
  type Editor,
  type ExtendedRegExpMatchArray,
  mergeAttributes,
  Node,
  nodeInputRule,
  nodePasteRule,
  type Range,
  VueNodeViewRenderer,
} from "@halo-dev/richtext-editor";
import BlogHaoSlideView from "./BlogHaoSlideView.vue";
import IconParkSolidSlideTwo from '~icons/icon-park-solid/slide-two';
import { ToolboxItem } from "@halo-dev/richtext-editor";
import { markRaw } from "vue";
declare module "@halo-dev/richtext-editor" {
  interface Commands<ReturnType> {
    blogHaoSlide: {
      setBlogHaoSlide: (options: { src: string }) => ReturnType;
    };
  }
}

const BlogHaoSlide = Node.create({
  name: "blogHaoSlide",
  code: true,
  inline() {
    return true;
  },
  group() {
    return "inline";
  },
  parseHTML() {
    return [
      {
        tag: "blogHaoSlide",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["blogHaoSlide", mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setBlogHaoSlide:
        (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
    };
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$blogHaoSlide\$$/,
        type: this.type,
        getAttributes: () => {
          return { width: "100%" };
        },
      }),
    ];
  },
  addPasteRules() {
    return [
      nodePasteRule({
        find: /^\$blogHaoSlide\$$/,
        type: this.type,
        getAttributes: (match: ExtendedRegExpMatchArray) => {
          return {
            content: match[2],
          };
        },
      }),
    ];
  },
  addNodeView() {
    return VueNodeViewRenderer(BlogHaoSlideView);
  },
  addOptions() {
    return {
      getCommandMenuItems() {
        return {
          priority: 2e2,
          icon: markRaw(IconParkSolidSlideTwo),
          title: "幻灯片展示",
          keywords: ["blogHaoSlide", "幻灯片展示"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent([
                { type: "blogHaoSlide", attrs: { src: "" } },
                { type: "paragraph", content: "" },
              ])
              .run();
          },
        };
      },
      getToolboxItems({ editor }: { editor: Editor }) {
        return {
          priority: 59,
          component: markRaw(ToolboxItem),
          props: {
            editor,
            icon: markRaw(IconParkSolidSlideTwo),
            title: "幻灯片展示",
            action: () => {
              editor
                .chain()
                .focus()
                .insertContent([{ type: "blogHaoSlide" }])
                .run();
            },
          },
        };
      },
      getDraggable() {
        return {
          getRenderContainer({ dom }: { dom: HTMLElement }) {
            let container = dom;
            while (
              container &&
              !container.hasAttribute("data-node-view-wrapper")
            ) {
              container = container.parentElement as HTMLElement;
            }
            return {
              el: container,
            };
          },
          allowPropagationDownward: true,
        };
      },
    }
  }
})
export default BlogHaoSlide;
