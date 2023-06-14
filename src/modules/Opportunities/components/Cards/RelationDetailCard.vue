<script lang="ts" setup>
withDefaults(
  defineProps<{
    moduleName: string;
    title?: string;
    description?: string;
    subtitle1?: string;
    icon?: string;
    noData?: boolean;
  }>(),
  {
    icon: 'person',
  }
);
</script>

<template>
  <q-card bordered flat>
    <q-list bordered>
      <q-item>
        <q-item-section v-if="$slots.leftOptions" side
          ><slot name="leftOptions"></slot
        ></q-item-section>

        <q-item-section v-if="noData">
          <q-item-label caption class="text-weight-bold" lines="1">
            <q-icon :name="icon" class="q-mr-sm" />{{
              moduleName
            }}</q-item-label
          >
          <q-item-label class="text-grey-7">
            <q-icon name="warning" />
            <span class="text-weight-thin"> No Seleccionado </span>
          </q-item-label>
        </q-item-section>
        <q-item-section v-else>
          <q-item-label class="text-weight-bold" caption lines="1">
            <q-icon :name="icon" class="q-mr-sm" />{{
              moduleName
            }}</q-item-label
          >

          <q-item-label>{{ title }}</q-item-label>
          <q-item-label v-if="description" caption lines="1"
            >Asignado a:
            <span class="text-weight-bold"> {{ description }} </span>
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label v-if="subtitle1" caption>{{ subtitle1 }}</q-item-label>
          <slot name="options"> </slot>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>
