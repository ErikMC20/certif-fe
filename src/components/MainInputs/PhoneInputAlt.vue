<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { CountryOptions, PhoneModel, RowTableModel } from '../types/index';
import PhoneInputCustom from './PhoneInputCustom.vue';

//* local types
interface PhoneLocalModel extends PhoneModel {
  isNew: boolean;
  deleted: boolean;
}

const props = defineProps<{
  phones: PhoneModel[];
  options: CountryOptions[];
  localId?: string;
}>();

// * local variables
const localPhones = ref([] as PhoneLocalModel[]);
const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);
const reassigning = ref(false);
let currentKey = 0;

// * computed variables
const activePhones = computed(() => {
  return localPhones.value.filter((phone) => !phone.deleted);
});

// * methods
const generateId = () => currentKey++;
const generateNewPhone = (): PhoneLocalModel => ({
  id: `${generateId()}`,
  phone: '',
  country: 'BO',
  country_code: '+591',
  whatsapp: '0',
  primary_item: '0',
  description: '010',
  isNew: true,
  deleted: false,
});

const assignCode = (code: string, id?: string) => {
  if (props.options.length > 0) {
    const option = props.options.find((option) => option.id === code);
    if (option && id)
      localPhones.value = localPhones.value.map((phone) =>
        phone.id === id ? { ...phone, country_code: option.code } : phone
      );
  }
};

const onDeletePhone = (id?: string) => {
  reassigning.value = true;
  setTimeout(() => {
    if (id)
      localPhones.value = localPhones.value.map((phone) => {
        if (phone.id === id) return { ...phone, deleted: true };
        return phone;
      });
    reassigning.value = false;
  }, 100);
};

const convertToLocal = (phones: PhoneModel[]): PhoneLocalModel[] => {
  return phones.map((phone) => ({
    ...phone,
    isNew: phone.inherited ? true : false,
    deleted: false,
  }));
};

const convertToExternal = (phone: PhoneLocalModel): PhoneModel => ({
  id: phone.id || '',
  phone: phone.phone,
  country: phone.country,
  country_code: phone.country_code,
  whatsapp: phone.whatsapp,
  primary_item: phone.primary_item,
  description: phone.description,
});

const constructorComp = (phones: PhoneModel[]) => {
  localPhones.value = convertToLocal(phones);
};

const captureNewPhones = (): PhoneModel[] => {
  return localPhones.value
    .filter((phone) => phone.isNew && !phone.deleted)
    .map((phone) => convertToExternal({ ...phone, id: '' }));
};

const capturePhones = (): PhoneModel[] => {
  return localPhones.value
    .filter((phone) => !phone.deleted && !phone.isNew)
    .map((phone) => {
      return convertToExternal(phone);
    });
};

const captureDeletedPhones = (): PhoneModel[] => {
  return localPhones.value
    .filter((phone) => !phone.isNew && phone.deleted)
    .map((phone) => convertToExternal(phone));
};

const captureActivePhones = (): PhoneModel[] => {
  return localPhones.value
    .filter((phone) => !phone.deleted)
    .map((phone) => convertToExternal(phone));
};

onMounted(() => {
  constructorComp(props.phones);
});

defineExpose({
  constructorComp,
  capturePhones,
  captureDeletedPhones,
  captureNewPhones,
  captureActivePhones,
});
</script>

<template>
  <q-dialog v-model="repeatedDialogOpen">
    <q-card>
      <table-dialog-component :data="repeatedDialogData" />
    </q-card>
  </q-dialog>
  <div v-if="localPhones.length > 0">
    <div v-if="reassigning">
      <transition appear v-for="(item, index) in activePhones" :key="index">
        <PhoneInputCustom
          :id="item.id || ''"
          :local-id="localId || ''"
          v-model:phone="item.phone"
          v-model:country="item.country"
          v-model:country_code="item.country_code"
          v-model:description="item.description"
          v-model:whatsapp="item.whatsapp"
          @delete-item="onDeletePhone"
        >
          <template #countryCode>
            <q-select
              v-model="item.country"
              :options="options"
              map-options
              emit-value
              option-value="id"
              option-label="name_es"
              label="Codigo"
              outlined
              dense
              @update:model-value="assignCode(item.country, item.id)"
            >
              <template #selected-item="{ opt }">
                <div class="row">
                  <div class="col q-mr-sm">
                    <q-avatar size="20px" font-size="52px">
                      <img
                        v-if="!!item.country_code"
                        :src="`https://countryflagsapi.com/png/${opt.id}`"
                      />
                    </q-avatar>
                  </div>

                  <span>{{ opt.code }}</span>
                </div>
              </template>
            </q-select></template
          ></PhoneInputCustom
        >
      </transition>
    </div>
    <transition
      v-else
      appear
      enter-active-class="animated fadeInDown"
      leave-active-class="animated backOutRight"
      v-for="(item, index) in activePhones"
      :key="index"
    >
      <PhoneInputCustom
        :id="item.id || ''"
        :local-id="localId || ''"
        v-model:phone.trim="item.phone"
        v-model:country="item.country"
        v-model:country_code="item.country_code"
        v-model:description="item.description"
        v-model:whatsapp="item.whatsapp"
        @delete-item="onDeletePhone"
      >
        <template #countryCode>
          <q-select
            v-model="item.country"
            :options="options"
            map-options
            emit-value
            option-value="id"
            option-label="name_es"
            label="Codigo"
            outlined
            dense
            @update:model-value="assignCode(item.country, item.id)"
          >
            <template #selected-item="{ opt }">
              <div class="row">
                <div class="col q-mr-sm">
                  <q-avatar size="20px" font-size="52px">
                    <img
                      v-if="!!item.country_code"
                      :src="`https://countryflagsapi.com/png/${opt.id}`"
                    />
                  </q-avatar>
                </div>

                <span>{{ opt.code }}</span>
              </div>
            </template>
          </q-select></template
        ></PhoneInputCustom
      >
    </transition>
  </div>

  <q-btn
    class="q-ml-sm add-phone q-pa-md"
    @click="localPhones.push(generateNewPhone())"
  >
    <template #default>
      <div>
        <q-icon name="add" color="primary" class="q-mr-md" />
        <span>Añadir Nuevo</span>
      </div>
    </template>
  </q-btn>
</template>

<style lang="scss" scoped>
.button-input {
  display: flex;
  justify-content: center;
  margin: auto 0;
}

.add-phone {
  border-radius: 3px;
}

.q-btn:before {
  content: none;
}
</style>
