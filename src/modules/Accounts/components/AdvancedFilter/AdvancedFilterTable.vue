<template>
  <q-card class="no-shadow border-none">
    <q-card-section>
      <div class="row q-col-gutter-y-sm">
        <template v-for="(item, index) in form" :key="index">
          <component
            :is="item.input"
            @keyup.enter="onSubmit"
            :label="item.label"
            dense
            outlined
            v-model="dataFilter[item.field]"
            :options="item.options"
            :use-input="item.use_input"
            :multiple="item.multiple"
            :use-chips="item.use_chips"
            :input-debounce="item.debounce"
            :option-value="item.option_value"
            :option-label="item.option_label"
            :options-dense="item.options_dense"
            :options-selected-class="item.selected_class"
            :emit-value="item.emit_value"
            :map-options="item.map_options"
            @filter="item.filter_function"
            class="col-12"
            v-if="item.visible && item.field !== 'creation_date'"
          >
            <!-- {{ item.field }} -->
            <!-- <pre>{{ dataFilter[item.field] }}</pre> -->
            <template #selected-item="scope" v-if="item.with_avatar">
              <q-chip
                removable
                dense
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
                color="grey-4"
                size="md"
                text-color="primary"
              >
                <q-avatar>
                  <img :src="`${HANSACRM3_URL}${scope.opt.avatar}`" />
                </q-avatar>
                <div class="ellipsis">
                  {{ scope.opt.user_name }}
                  <q-tooltip class="bg-primary">
                    <div>{{ scope.opt.user_name }}</div>
                  </q-tooltip>
                </div>
              </q-chip>
            </template>
            <template #option="scope" v-if="item.with_avatar">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img
                    :src="`${HANSACRM3_URL}${scope.opt.avatar}`"
                    style="width: 30px"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.user_name }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.a_mercado }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </component>
          <!-- <pre>{{ dataFilter[item.field] }}</pre> -->
          <component
            :is="DateRangeComponent"
            :date="dataFilter.creation_date"
            ref="dynamicInput"
            @changeDate="changeDate"
            v-if="item.visible && item.field === 'creation_date'"
          >
          </component>
          <!-- <pre>{{ dataFilter[item.field] }}</pre> -->
        </template>
        <!-- <DateRangeComponent
          ref="dateRangeRef"
          :date="dataFilter.creation_date"
          @changeDate="changeDate"
        /> -->

        <q-btn
          label="agregar campos"
          dense
          outline
          class="full-width q-my-sm"
          color="accent"
          @click="show_more_input = !show_more_input"
        ></q-btn>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog v-model="show_more_input">
    <q-card :style="$q.screen.xs ? '' : 'width: 700px'">
      <q-card-section>
        <div class="text-h7 q-pt-none">
          <q-checkbox v-model="todos" @click="selectAllInputs" /> Campos de
          búsqueda
          <q-btn
            icon="close"
            flat
            dense
            class="float-right"
            v-close-popup
            @click="cancelSelecction"
          />
        </div>
        <hr />
        <div class="q-col-gutter-sm">
          <q-checkbox
            v-for="(item, index) in form"
            :key="index"
            keep-color
            v-model="form_fields"
            :label="item['label']"
            color="primary"
            :style="$q.screen.xs ? 'width: 50%' : 'width: 33.3%'"
            :val="item.field"
          />
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn
          color="primary"
          icon="save"
          label="Guardar"
          v-close-popup
          @click="setVisibleFields"
        />
        <q-btn
          color="secondary"
          label="Cancelar"
          v-close-popup
          @click="cancelSelecction"
        />
      </q-card-actions>
      <!-- <q-card-section class="q-pt-none">
        <div class="text-h6 q-pt-none">Módulos relaciondos</div>
        <hr />
        <div class="q-col-gutter-sm">
          <q-checkbox
            v-for="(item, index) in form_modules"
            :key="index"
            keep-color
            v-model="item['visible']"
            :label="item['label']"
            color="primary"
            style="width: 33.3%"
            disable
            :val="item['visible']"
          />
        </div>
      </q-card-section> -->
    </q-card>
  </q-dialog>
  <!-- <pre>{{ dataFilter }}</pre> -->
</template>

<script setup lang="ts">
import DateRangeComponent from '../../../../components/DateRange/DateRangeComponent.vue';
import { ref, onMounted } from 'vue';
import { useAdvancedFilter } from '../../composables';
import { AccountTableStore } from '../../store/AccountTableStore';

const {
  form,
  dataFilter,
  HANSACRM3_URL,
  clearFilter: clearData,
  todos,
} = useAdvancedFilter();
const tableStore = AccountTableStore();

const show_more_input = ref(false);
const dynamicInput = ref<InstanceType<typeof DateRangeComponent> | null>(null);

const form_fields = ref([...tableStore.visible_fields]);
onMounted(() => {
  getVisibleField();
});

/**Filter Methods */
const onSubmit = () => {
  emit('submitFilter');
  // console.log('UTILIZANDO EL ENTER');
};

const clearFilter = () => {
  clearData();
  // if (!dynamicInput.value?.resetData) {
  if (dynamicInput.value?.length > 0) {
    // console.log('entrando date cuenta');
    dynamicInput.value[0].resetData();
    // dynamicInput.value[0].value.resetData
    // dynamicInput.value?.resetData();
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const changeDate = (val: any) => {
  // console.log(dataFilter);
  dataFilter.value.creation_date = val;
  // console.log(dataFilter.value.creation_date);
};

const getVisibleField = () => {
  form.value.map((el) => {
    const visible = form_fields.value.find((el2) => el2 === el.field);
    return el.field == visible ? (el.visible = true) : (el.visible = false);
  });
};

const setVisibleFields = () => {
  getVisibleField();
  tableStore.setVisibleField(form_fields.value);
};

const selectAllInputs = () => {
  form_fields.value = [];
  if (todos.value) {
    form_fields.value = form.value.map((el) => {
      el.visible = todos.value;
      return el.field;
    });
  }
};
const cancelSelecction = () => {
  form_fields.value = [...tableStore.visible_fields];
};

/** Emits and Exposes */
const emit = defineEmits<{
  (event: 'submitFilter'): void;
}>();

const getDataFilter = () => {
  // console.log('dsadasdasd', dateRangeRef.value?.localDate);
  return dataFilter;
};

defineExpose({ dataFilter, getDataFilter, clearFilter });
</script>

<style lang="scss" scoped>
.q-chip {
  max-width: 140px;
}
.range-input-text {
  border: 1px solid #c2c2c2;
  margin-top: 7px;
  padding: 0.2em;
  border-radius: 5px;
}
</style>
