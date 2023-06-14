<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    valueRender: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <div class="text-h6">{{ title }}</div>
  <div class="text-subtitle2">{{ valueRender }}</div>
</template>
