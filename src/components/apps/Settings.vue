<script setup>

</script>

<template>
    <div class="settings-app">
        <span class="title">Parametres</span>
    </div>
</template>

<style lang="scss">
.settings-app {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
    user-select: none;
    padding: 15cqw 3cqh 0cqw;
    background-color: rgb(10, 10, 10);

    .title {
        font-size: 8cqw;
        font-weight: 600;
        flex-shrink: 0;
    }
}
</style>