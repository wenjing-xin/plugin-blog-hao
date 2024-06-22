import {
  Node,
  VueNodeViewRenderer,
  mergeAttributes,
  nodeInputRule,
  type Editor,
  ToolboxItem,
  type Range,
} from "@halo-dev/richtext-editor";
import BlogHaoSlideView from "./BlogHaoSlideView.vue";
import { markRaw } from "vue";
import IconParkSolidSlideTwo from '~icons/icon-park-solid/slide-two';

const BlogHaoSlideExtension = Node.create({
  name: "blogHaoSlide",
  group: 'block',

  addOptions() {

    return {
      ...this.parent?.(),
      getToolboxItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 99,
            component: markRaw(ToolboxItem),
            props: {
              editor,
              icon: markRaw(IconParkSolidSlideTwo),
              title: "幻灯片",
              action: () => {

                editor
                  .chain()
                  .focus()
                  .insertContent([{ type: "blogHaoSlide" }])
                  .run();
              },
            },
          },
        ];
      },
      getCommandMenuItems() {
        return {
          priority: 200,
          icon: markRaw(IconParkSolidSlideTwo),
          title: "幻灯片",
          keywords: ["slide", "revealjs"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent([{ type: "blogHaoSlide" }])
              .run();
          },
        };
      },
      getDraggable() {
        return {
          getRenderContainer({ dom, view }) {
            console.log(dom);
            console.log(view);
            let container = dom;
            while (container && container.tagName !== "P") {
              container = container.parentElement as HTMLElement;
            }
            if (container) {
              container = container.firstElementChild
                ?.firstElementChild as HTMLElement;
            }
            let node;
            if (container.firstElementChild) {
              const pos = view.posAtDOM(container.firstElementChild, 0);
              const $pos = view.state.doc.resolve(pos);
              node = $pos.node();
            }

            return {
              node: node,
              el: container as HTMLElement,
            };
          },
          allowPropagationDownward: true,
        };
      },
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("src");
        },
      },
    };
  },
  parseHTML() {
    return [{
      tag: 'bloghao-slide',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['bloghao-slide', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(BlogHaoSlideView);

  },
  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$bloghao-slide\$$/,
        type: this.type,
        getAttributes: () => {
          return { width: "100%", minHeight: "500px" };
        },
      }),
    ];
  },

});
export default BlogHaoSlideExtension;
