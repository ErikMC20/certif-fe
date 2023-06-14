<template>
  <template v-if="enabledGroup">
    <q-item-label header class="text-uppercase">
      {{ groupTitle }}
    </q-item-label>

    <q-list
      class="text-primary"
      v-for="{ title, caption, icon, link, route, separator, enabled, type, listOptions1 }  in (listOptions as any)"
      :key="title"
    >
      <q-expansion-item
        :content-inset-level="0.5"
        expand-separator
        default-opened
        group="somegroup"
        :icon="icon"
        :label="title"
        dense
        v-if="type == 'multiple'"
      >
        <template v-if="type === 'only'">
          <q-expansion-item
            :content-inset-level="0.5"
            expand-separator
            dense
            icon="noise_control_off"
            :label="title"
            group="somegroup2"
            v-for="{ title, listOptions2 }  in (listOptions1 as any)"
            :key="title"
          >
            <listSimple
              v-for="item in listOptions2"
              :key="item.title"
              v-bind="item"
            />
          </q-expansion-item>
        </template>
        <template v-else>
          <ListSimple
            v-for="{ title, caption,  link, route, separator, enabled, type },index  in (listOptions1 as any)"
            :title="title"
            :caption="caption"
            icon="noise_control_off"
            :link="link"
            :route="route"
            :separator="separator"
            :enabled="enabled"
            :type="type"
            :key="index"
          />
        </template>
      </q-expansion-item>

      <listSimple
        :title="title"
        :caption="caption"
        :icon="icon"
        :link="link"
        :route="route"
        :separator="separator"
        :enabled="enabled"
        :type="type"
        v-else
      />
    </q-list>
    <q-separator v-if="separatorGroup" class="q-my-sm" />
  </template>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import listSimple from '../MenuBar/listSimple.vue';
import ListSimple from '../MenuBar/listSimple.vue';
export default defineComponent({
  name: 'LeftSidebar',
  components: {
    listSimple,
    ListSimple,
  },
  props: {
    groupTitle: {
      type: String,
      required: false,
      default: 'Opciones',
    },
    enabledGroup: {
      type: Boolean,
      required: true,
    },
    separatorGroup: {
      type: Boolean,
      required: true,
    },
    positionGroup: {
      type: Number,
      required: true,
    },
    listOptions: {
      type: Array,
      required: true,
    },
  },
});
</script>
