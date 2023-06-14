<script lang="ts" setup>
import { useBusinessesStore } from '../store';
import { useBusinesses } from '../composables/Core/useBusinesses/index';

interface Emits {
  (e: 'valueSelected', value: string): void;
}

defineEmits<Emits>();

const businessStore = useBusinessesStore();
const { formatAmount } = useBusinesses();
</script>

<template>
  <q-page-sticky position="bottom" style="box-sizing: border-box">
    <q-toolbar id="data" class="footer-bar bg-primary text-white">
      <div
        v-for="item in businessStore.stats"
        :key="item.id"
        class="stat-card row q-pa-xs bg-grey-1 text-black"
        @click="$emit('valueSelected', item.value)"
      >
        <div class="col-3">
          <q-icon :name="item.icon" size="sm" />
        </div>
        <div class="col-9">
          <div class="column">
            <span class="stat-card-title text-uppercase">{{ item.title }}</span>
            <span class="stat-card-description"
              ><span v-if="item.isMoney">USD </span>
              {{ item.isMoney ? formatAmount(item.amount) : item.amount }}
              <span v-if="item.isPercentage">%</span></span
            >
          </div>
        </div>
      </div>
    </q-toolbar>
  </q-page-sticky>
</template>

<style lang="scss" scoped>
.footer-bar {
  bottom: 0px;
  left: 0px;
  min-height: 45px;
  overflow-x: scroll;
  padding-bottom: 3px;
  padding-left: 50px;
  padding-top: 3px;
  position: absolute;
  right: 0px;

  .stat-card {
    min-width: 120px;
    width: inherit;
    border-radius: 5px;
    margin-right: 0.5rem;
    .stat-card-title {
      font-size: 0.5rem;
    }

    .stat-card-description {
      font-size: 0.7rem;
    }
  }
}
/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: none;
  scrollbar-color: #00054d #ffffff;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}
::-webkit-scrollbar-thumb:active {
  background: #000000;
}
::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-track:hover {
  background: #666666;
}
::-webkit-scrollbar-track:active {
  background: #333333;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
