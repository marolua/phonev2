<script setup>

</script>

<template>
    <div class="phone-app">
        <h1>Recent</h1>
        <div class="container">

        </div>
        <div class="bottom-app-phone">

        </div>
    </div>
</template>

<style lang="scss">
.phone-app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding: 15cqw 3cqh 2.5cqw;
    background-color: rgb(10, 10, 10);

    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 75%;
        background-color: blue;
    }

    .bottom-app-phone {
        display: flex;
        width: 100%;
        height: 20%;
        background-color: red;
    }
}
</style>