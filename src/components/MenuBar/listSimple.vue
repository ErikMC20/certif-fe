<template>
  <q-item
    dense
    clickable
    :to="{ name: `${route}` }"
    active-class="active-link"
    v-ripple
    v-if="enabled"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon
        :name="type == 'multiple' ? 'noise_control_off' : icon"
        color="primary"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
    <q-tooltip anchor="center right" self="center left">{{ title }}</q-tooltip>
  </q-item>
  <q-separator v-if="separator" class="q-mt-md q-mb-md" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'listSimple',
  props: {
    title: {
      type: String,
      required: false,
      default: 'Sin titulo'
    },
    caption: {
      type: String,
      required: false,
      default: 'Sin titulo'
    },
    icon: {
      type: String,
      required: false,
      default: 'noise_control_off'
    },
    link: {
      type: String,
      required: false
    },
    route: {
      type: String,
      required: false
    },
    separator: {
      type: Boolean,
      required: false
    },
    enabled: {
      type: Boolean,
      required: false
    },
    type: {
      type: String,
      required: true
    }
  }
});
</script>
