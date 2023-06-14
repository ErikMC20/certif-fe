<script lang="ts" setup>
import { ref, computed } from 'vue';
import HeaderBoard from './HeaderBoard.vue';
import Draggable from 'vuedraggable';

const list1 = ref([
  { name: 'John', id: 1 },
  { name: 'Joao', id: 2 },
  { name: 'Jean', id: 3 },
  { name: 'Gerard', id: 4 },
]);

const list2 = ref([
  { name: 'Juan', id: 5 },
  { name: 'Edgard', id: 6 },
  { name: 'Johnson', id: 7 },
]);
const list3 = ref([
  { name: 'Juan', id: 5 },
  { name: 'Edgard', id: 6 },
  { name: 'Johnson', id: 7 },
]);
const list4 = ref([
  { name: 'Juan', id: 5 },
  { name: 'Edgard', id: 6 },
  { name: 'Johnson', id: 7 },
]);
const list5 = ref([
  { name: 'Juan', id: 5 },
  { name: 'Edgard', id: 6 },
  { name: 'Johnson', id: 7 },
]);
const list6 = ref([
  { name: 'Juan', id: 5 },
  { name: 'Edgard', id: 6 },
  { name: 'Johnson', id: 7 },
]);

const drag = ref(false);

//* methods
const log = (evt: any) => {
  window.console.log(evt);
};
</script>

<template>
  <HeaderBoard />
  <div class="row q-col-gutter-sm">
    <div class="bg-blue-3 q-px-sm" style="width: 300px">
      <div class="text-h6">Identificacion {{ list1.length }}</div>
      <Draggable
        class="list-group"
        :list="list1"
        group="people"
        @change="log"
        itemKey="name"
      >
        <template #item="{ element, index }">
          <transition
            appear
            enter-active-class="animated bounceIn"
            leave-active-class="animated bounceOut"
            ><q-card class="my-card q-mt-sm">
              <q-card-section>
                <div class="text-h6">Our Changing Planet</div>
                <div class="text-subtitle2">{{ element.name }}</div>
              </q-card-section>
              <q-card-section class="text-caption">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                {{ index }}
              </q-card-section>
            </q-card>
          </transition>
        </template>
      </Draggable>
    </div>
    <div class="col-2 bg-cyan-3 q-px-sm">
      <div class="text-h6">Cotizacion {{ list2.length }}</div>
      <transition
        appear
        enter-active-class="animated bounceIn"
        leave-active-class="animated bounceOut"
        ><Draggable
          class="list-group"
          :list="list2"
          group="people"
          @change="log"
          itemKey="name"
        >
          <template #item="{ element, index }">
            <q-card class="my-card q-mt-sm">
              <q-card-section>
                <div class="text-h6">Our Changing Planet</div>
                <div class="text-subtitle2">{{ element.name }}</div>
              </q-card-section>
              <q-card-section class="text-caption">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                {{ index }}
              </q-card-section>
            </q-card>
          </template>
        </Draggable>
      </transition>
    </div>
    <div class="col-2 bg-orange-3 q-px-sm">
      <div class="text-h6">Cotizacion {{ list3.length }}</div>
      <Draggable
        class="list-group"
        :list="list3"
        group="people"
        @change="log"
        itemKey="name"
      >
        <template #item="{ element, index }">
          <q-card class="my-card q-mt-sm">
            <q-card-section>
              <div class="text-h6">Our Changing Planet</div>
              <div class="text-subtitle2">{{ element.name }}</div>
            </q-card-section>
            <q-card-section class="text-caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
              {{ index }}
            </q-card-section>
          </q-card>
        </template>
      </Draggable>
    </div>
    <div class="col-2 bg-green-3 q-px-sm">
      <div class="text-h6">Cotizacion {{ list4.length }}</div>
      <Draggable
        class="list-group"
        :list="list4"
        group="people"
        @change="log"
        itemKey="name"
      >
        <template #item="{ element, index }">
          <q-card class="my-card q-mt-sm">
            <q-card-section>
              <div class="text-h6">Our Changing Planet</div>
              <div class="text-subtitle2">{{ element.name }}</div>
            </q-card-section>
            <q-card-section class="text-caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
              {{ index }}
            </q-card-section>
          </q-card>
        </template>
      </Draggable>
    </div>
    <div class="col-2 bg-purple-3 q-px-sm">
      <div class="text-h6">Cotizacion {{ list5.length }}</div>
      <Draggable
        class="list-group"
        :list="list5"
        group="people"
        @change="log"
        itemKey="name"
      >
        <template #item="{ element, index }">
          <q-card class="my-card q-mt-sm">
            <q-card-section>
              <div class="text-h6">Our Changing Planet</div>
              <div class="text-subtitle2">{{ element.name }}</div>
            </q-card-section>
            <q-card-section class="text-caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
              {{ index }}
            </q-card-section>
          </q-card>
        </template>
      </Draggable>
    </div>
    <div class="col-2 bg-red-3 q-px-sm">
      <div class="text-h6">Cotizacion {{ list6.length }}</div>
      <Draggable
        class="list-group"
        :list="list6"
        group="people"
        @change="log"
        itemKey="name"
      >
        <template #item="{ element, index }">
          <q-card class="my-card q-mt-sm">
            <q-card-section>
              <div class="text-h6">Our Changing Planet</div>
              <div class="text-subtitle2">{{ element.name }}</div>
            </q-card-section>
            <q-card-section class="text-caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
              {{ index }}
            </q-card-section>
          </q-card>
        </template>
      </Draggable>
    </div>
  </div>
</template>
