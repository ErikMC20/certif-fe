<template>
  <div>
    <organization-chart :datasource="ds"></organization-chart>
  </div>
</template>
<script lang="ts">
import OrganizationChart from 'vue3-organization-chart';
import { ref } from 'vue';
</script>
<script setup lang="ts">
const ds = ref({
  id: '1',
  name: 'Lao Lao',
  title: 'general manager',
  children: [
    { id: '2', name: 'Bo Miao', title: 'department manager' },
    { id: '8', name: 'Hong Miao', title: 'department manager' },
    { id: '8', name: 'Hong Miao', title: 'department manager' },
    { id: '8', name: 'Hong Miao', title: 'department manager' },
    {
      id: '8',
      name: 'Hong Miao',
      title: 'department manager',
      children: [
        { id: '2', name: 'Bo Miao', title: 'department manager' },
        { id: '8', name: 'Hong Miao', title: 'department manager' },
        { id: '8', name: 'Hong Miao', title: 'department manager' },
        { id: '8', name: 'Hong Miao', title: 'department manager' },
        { id: '8', name: 'Hong Miao', title: 'department manager' },
      ],
    },
  ],
});
</script>

<style lang="scss">
.chartOrgchart table.table > tbody > tr:nth-of-type(0) td {
  .chartNode {
    border: 1px solid $negative;
    .chartTitle {
      background: $negative;
    }
  }
}
@import './diagramCss.scss';
</style>
