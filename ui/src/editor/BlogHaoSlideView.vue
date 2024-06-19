<script lang="ts" setup>
import type { PMNode } from "@halo-dev/richtext-editor";
import type { Editor, Node } from "@halo-dev/richtext-editor";
import { NodeViewWrapper } from "@halo-dev/richtext-editor";
import SwipperBlock from "@/components/SwipperBlock.vue";

</script>

<template>
    <node-view-wrapper as="div" class="inline-block-box inline-block">
        <SwipperBlock />
    </node-view-wrapper>
</template>

<style></style>