<script setup lang="ts">
import { VButton } from "@halo-dev/components";
import { useRouteQuery } from '@vueuse/router'

</script>

<template>
    <div class="slide">
        <div class="top-banner">
            <p class="slide-name">blog-hao 幻灯片</p>
            <div class="operation-wrap">
                <VButton :route="{ name: 'NewSlide' }">新建幻灯片</VButton>
            </div>
        </div>
        <div class="core-content">
            <router-view></router-view>
        </div>
    </div>
</template>
<style scoped lang="scss">
.slide {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;

    .top-banner {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #FFFFFF;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .core-content {
        width: 97%;
        height: 86vh;
        margin: 20px auto 0;
        background-color: #FFFFFF;
    }
}
</style>
