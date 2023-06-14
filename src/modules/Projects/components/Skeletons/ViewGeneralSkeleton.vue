<script setup lang="ts">
import IndicatorsSkeleton from './IndicatorsSkeleton.vue';
import CardSkeleton from './CardSkeleton.vue';
import ResponsiblesSkeleton from './ResponsiblesSkeleton.vue';
import TabsSkeleton from './TabsSkeleton.vue';
</script>
<template>
  <div class="row q-col-gutter-sm">
    <IndicatorsSkeleton />
    <div class="col-md-7 col-xs-12">
      <CardSkeleton :inputs="7" />
      <CardSkeleton :inputs="4" />
      <CardSkeleton :inputs="4" />
    </div>
    <div class="col-md-5 col-sm-12 col-xs-12">
      <ResponsiblesSkeleton :users="2" class="q-mb-sm" />
      <TabsSkeleton />
    </div>
  </div>
</template>
