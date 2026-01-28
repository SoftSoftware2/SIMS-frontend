
<template>
    <button @click="$emit('click')" class="text-black">Example</button>
</template>

<script setup lang="ts">

defineEmits(['click'])
</script>
<style scoped>

</style>
