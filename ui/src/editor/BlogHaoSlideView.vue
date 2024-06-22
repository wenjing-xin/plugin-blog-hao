<script lang="ts" setup>
import { NodeViewWrapper, nodeViewProps } from "@halo-dev/richtext-editor";

import { computed } from "vue";
import IcOutlineFullscreen from "~icons/ic/outline-fullscreen";
import IcOutlineFullscreenExit from "~icons/ic/outline-fullscreen-exit";

import { ref } from "vue";

const props = defineProps(nodeViewProps);

const renderedSlide = computed(() => {
    if (!props.node.attrs.content) {
        return "";
    }
    return props.node.attrs.content.toString();

});

const fullscreen = ref(false);

function onEditorChange(value: string) {
    props.updateAttributes({ content: value });
}
</script>

<template>
    <node-view-wrapper class="slide-container" :class="{ 'slide-fullscreen': fullscreen }" as="div">
        <div class="slide-nav">
            <div class="slide-nav-start">
                <div>幻灯片</div>
                <a v-tooltip="`查阅revealjs的文档`" href="https://katex.org/" target="_blank">
                    文档
                </a>
            </div>
            <div class="slide-nav-end">
                <div class="slide-fullscreen-icon" @click="fullscreen = !fullscreen">
                    <IcOutlineFullscreenExit v-if="fullscreen" v-tooltip="'退出全屏'" />
                    <IcOutlineFullscreen v-else v-tooltip="'全屏'" />
                </div>
            </div>
        </div>
        <div class="slide-editor-panel">
            <div class="slide-code">
                <VCodemirror :model-value="node.attrs.content" style="min-height: 500px;" height="100%"
                    @change="onEditorChange" />
            </div>
            <div ref="previewRef" class="slide-preview" v-html="renderedSlide()"></div>
        </div>
    </node-view-wrapper>
</template>

<style>
.slide-container {
    border: 1px #e7e7e7 solid;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.75em;
}

.slide-nav {
    border-bottom: 1px #e7e7e7 solid;
    display: flex;
    padding: 5px 10px;
    align-items: center;
}

.slide-nav-start {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.slide-nav-end {
    justify-content: flex-end;
}

.slide-editor-panel {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    min-height: 500px;
    height: 100%;
}

.slide-code {
    min-height: 500px;
    height: 100%;
    border-right: 1px #e7e7e7 solid;
}

.slide-preview {
    padding: 5px;
    min-height: 500px;
    height: 100%;
}

.slide-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: #fff;
    margin-top: 0;
}

.slide-fullscreen-icon {
    cursor: pointer;
}

.slide-fullscreen-icon svg {
    font-size: 18px;
}

.slide-fullscreen-icon:hover {
    color: #999;
}
</style>
