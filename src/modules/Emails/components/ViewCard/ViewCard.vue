<script setup lang="ts">
import { ref } from 'vue';
import BaseCardVue from '../BaseCard/BaseCard.vue';

const props = defineProps<{
  iconName: string;
  title: string;
  isEditValue: boolean;
}>();

defineEmits(['update:modelValue']);

const isEditing = ref(props.isEditValue);

const editCard = () => {
  isEditing.value = !isEditing.value;
};

defineExpose({
  editCard,
});
</script>
<template>
  <BaseCardVue>
    <template #header>
      <div class="text-h6 q-mt-none row justify-between">
        <div><q-icon :name="iconName" class="q-mr-sm" />{{ title }}</div>
        <div v-if="!isEditing">
          <q-btn
            color="primary"
            round
            size="sm"
            icon="edit"
            @click="editCard"
          />
        </div>
      </div>
    </template>
    <template #default>
      <div v-if="isEditing">
        <slot name="edit"></slot>
      </div>
      <div v-else>
        <slot name="read"></slot>
      </div>
    </template>
  </BaseCardVue>
</template>
