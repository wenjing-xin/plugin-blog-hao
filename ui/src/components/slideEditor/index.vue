<script setup lang="ts">

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";

import ace from "ace-builds";
import "ace-builds/src-min-noconflict/theme-github";
import "ace-builds/src-min-noconflict/mode-markdown";
import "ace-builds/src-min-noconflict/ext-language_tools";

import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import Highlight from "reveal.js/plugin/highlight/highlight.esm.js";

import { onMounted, ref, onUnmounted, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";

import debounce from "lodash.debounce";

const props = defineProps({
    raw: {
        type: String,
        required: false,
        default: "",
    },
    content: {
        type: String,
        required: false,
        default: "",
    },
});

const emit = defineEmits<{
    (event: "update:raw", value: string): void;
    (event: "update:content", value: string): void;
    (event: "update", value: string): void;
}>();

const $slides = ref(null);

const slideNumber = ref({
    h: 0,
    v: 0,
});

watch(
    () => props.raw,
    (value) => {
        editor.setValue(value, -1);
    }
);

const initReveal = (deck: Reveal.Api) => {
    try {
        deck.getState();
        deck.destroy();
    } catch (error) {
        console.log(error);
    }
    deck.initialize().then(() => {
        deck.slide(slideNumber.value.h, slideNumber.value.v);
    });
};

onMounted(() => {
    const deck = new Reveal(document.querySelector(".reveal") as Element, {
        plugins: [Markdown, Highlight],
        slideNumber: true,
        embedded: true,
    });
    const editor = ace.edit("editor", {
        theme: "ace/theme/github",
        mode: "ace/mode/markdown",
        showPrintMargin: true,
        fontSize: 16,
    });
    if (props.raw === "") {
        editor.setValue(
            `<!--使用 --- 分割内容创建新的横向幻灯片, 使用 -- 分割内容创建新的纵向幻灯片-->`
        );
    } else {
        editor.setValue(props.raw, -1);
    }

    initReveal(deck);

    editor.selection.on("changeCursor", function () {
        const cursor = editor.selection.getCursor();
        currentCursorSlide(cursor.row);
        deck.slide(slideNumber.value.h, slideNumber.value.v);
    });

    editor.on(
        "change",
        debounce(() => {
            const editorContent = editor.getValue();
            const htmlContent = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.4.0/dist/reveal.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.4.0/dist/theme/white.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/styles/github-dark.css">
      \x3Cscript src="https://cdn.jsdelivr.net/npm/reveal.js@4.4.0/dist/reveal.js">\x3C/script>
      \x3Cscript src="https://cdn.jsdelivr.net/npm/reveal.js@4.4.0/plugin/markdown/markdown.js">\x3C/script>
      \x3Cscript src="https://cdn.jsdelivr.net/npm/reveal.js@4.4.0/plugin/highlight/highlight.js">\x3C/script>
      <div class="reveal-wrapper"  style="width: 100%; height: 32rem">
        <div class="reveal">
          <div class="slides" id="slides" ref="$slides">
            <section data-markdown data-separator="^---" data-separator-vertical="^--">
              ${editorContent}
            </section>
          </div>
        </div>
      </div>
      \x3Cscript type="Module">
        import Markdown from 'https://cdn.jsdelivr.net/npm/reveal.js@4.4.0/plugin/markdown/markdown.esm.js';
        import Highlight from 'https://cdn.jsdelivr.net/npm/reveal.js@4.4.0/plugin/highlight/highlight.esm.js';
        Reveal.initialize({
          plugins: [Markdown, Highlight],
          slideNumber: true,
          embedded: true,
        })
      \x3C/script>`;
            emit("update:raw", editorContent);
            emit("update", editorContent);
            emit("update:content", htmlContent);
            const cursor = editor.selection.getCursor();
            currentCursorSlide(cursor.row);
            $slides.value.innerHTML = `<section data-markdown data-separator="^---" data-separator-vertical="^--">${editorContent}</section>`;
            initReveal(deck);
        }, 500)
    );
});

function currentCursorSlide(cursorLine: number) {
    const text = ace.edit("editor").getValue();
    const lines = text.split("\n");
    let line = "";
    let slide = 0;
    let subSlide = 0;

    for (let i = 0; i <= cursorLine; i++) {
        if (line.substring(0, 3) === "---") {
            slide = slide + 1;
            subSlide = 0;
        } else if (line.substring(0, 2) === "--") {
            subSlide = subSlide + 1;
        }
        line = lines[i];
    }

    slideNumber.value = {
        h: slide,
        v: subSlide,
    };
}
</script>

<template>
    <div class="slide-editor">
        <div id="editor"></div>
        <div id="preview">
            <div class="reveal">
                <div class="slides" id="slides" ref="$slides">
                    <section data-markdown data-separator="^---" data-separator-vertical="^--">
                        {{ raw }}
                    </section>
                </div>
            </div>
        </div>

    </div>
</template>
<style scoped lang="scss">
.slide-editor {
    width: 100%;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-color: #FFFFFF;

    #editor {
        width: 50%;
        height: 100vh;
        overflow: auto;
        margin: 0 auto;
    }

    #preview {
        width: 48%;
        height: 48vh;
        margin: 0 auto;
        /**  box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, .04),
            0px 8px 20px rgba(0, 0, 0, .08);*/
    }

}
</style>
