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
          <q-toggle
            v-model="dataFilter[item.field]"
            color="primary"
            :label="item.label"
            false-value="0"
            true-value="1"
            v-if="item.input === 'q-toggle' && item.visible"
          />
          <component
            :is="DateRangeComponent"
            :date="dataFilter.creation_date"
            ref="dynamicInput2"
            @changeDate="changeDate"
            v-if="item.visible && item.field === 'creation_date'"
          >
          </component>
          <!-- <div
            class="col-12 range-input-text row flex items-center"
            v-if="item.field === 'creation_date' && item.visible === true"
          >
            <div class="col-md-1 col-xs-2 text-center">
              <q-btn icon="event" dense flat color="primary">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dataFilter.creation_date"
                    range
                    mask="YYYY-MM-DD"
                    :locale="spanish"
                  >
                    <div class="row items-center justify-center">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-btn>
            </div>

            <div class="col-md-7 col-xs-10">
              Desde:
              {{
                dataFilter.creation_date.from == ''
                  ? 'AAAA-MM-DD'
                  : dataFilter.creation_date.from
              }}
              , Hasta:
              {{
                dataFilter.creation_date?.to == ''
                  ? 'AAAA-MM-DD'
                  : dataFilter.creation_date?.to
              }}
            </div>

            <q-select
              dense
              v-model="dataFilter['creation_date']"
              label="Selección rápida"
              :option-value="item.option_value"
              :option-label="item.option_label"
              :options-dense="item.options_dense"
              :options="item.options"
              :emit-value="item.emit_value"
              :map-options="item.map_options"
              class="col-md-4 col-xs-12"
            >
            </q-select>
          </div> -->
        </template>
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
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h7 q-pt-none">
          <q-checkbox v-model="todos" @click="selectAllInputs" />
          Campos de búsqueda
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
            style="width: 33.3%"
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
</template>

<script setup lang="ts">
import DateRangeComponent from '../../../../components/DateRange/DateRangeComponent.vue';
import { ref, onMounted } from 'vue';
import { useAdvancedFilter } from '../../composables';
import { ContactTableStore } from '../../store/ContactTableStore';

const {
  form,
  dataFilter,
  HANSACRM3_URL,
  clearFilter: clearData,
  todos,
} = useAdvancedFilter();
const tableStore = ContactTableStore();

const show_more_input = ref(false);
const form_fields = ref([...tableStore.visible_fields]);
const dynamicInput2 = ref<InstanceType<typeof DateRangeComponent> | null>(null);

onMounted(() => {
  getVisibleField();
});

/**Filter Methods */
const onSubmit = () => {
  emit('submitFilter');
};

const clearFilter = () => {
  clearData();
  // if (!dynamicInput2.value?.resetData) {
  if (dynamicInput.value?.length > 0) {
    // console.log('entrando datecontact');
    dynamicInput2.value[0].resetData();
    // dynamicInput.value[0].value.resetData
    // dynamicInput.value?.resetData();
  }
};

const getVisibleField = () => {
  form.value.map((el) => {
    const visible = form_fields.value.find((el2) => el2 === el.field);
    return el.field == visible ? (el.visible = true) : (el.visible = false);
  });
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

const setVisibleFields = () => {
  getVisibleField();
  // console.log(form_fields.value);

  tableStore.setVisibleField(form_fields.value);
};

const cancelSelecction = () => {
  form_fields.value = [...tableStore.visible_fields];
};

const changeDate = (val: string) => {
  // console.log(dataFilter);
  dataFilter.value.creation_date = val;
  // console.log(dataFilter.value.creation_date);
};
/** Emits and Exposes */
const emit = defineEmits<{
  (event: 'submitFilter'): void;
}>();
defineExpose({ dataFilter, clearFilter });
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
