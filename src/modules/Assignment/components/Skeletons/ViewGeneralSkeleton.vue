<script setup lang="ts">
import CardSkeleton from './CardSkeleton.vue';
import ResponsiblesSkeleton from './ResponsiblesSkeleton.vue';
import TabsSkeleton from './TabsSkeleton.vue';
</script>
<template>
  <div class="row q-col-gutter-sm">
    <div class="col-md-7 col-sm-12">
      <CardSkeleton :inputs="10" />
    </div>
    <div class="col-md-5 col-sm-12">
      <ResponsiblesSkeleton :users="2" class="q-mb-sm" />
      <TabsSkeleton />
    </div>
  </div>
</template>
