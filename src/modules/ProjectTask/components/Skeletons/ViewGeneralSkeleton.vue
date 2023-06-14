<script setup lang="ts">
import CardSkeleton from './CardSkeleton.vue';
import TabsSkeleton from './TabsSkeleton.vue';
</script>
<template>
  <div class="row q-col-gutter-sm">
    <div class="col-md-6 col-xs-12">
      <CardSkeleton :inputs="4" />
    </div>
    <div class="col-md-6 col-xs-12">
      <CardSkeleton :inputs="4" />
    </div>
    <div class="col-md-12 col-xs-12">
      <TabsSkeleton />
    </div>
  </div>
</template>
