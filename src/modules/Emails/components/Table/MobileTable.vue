<script>
import InfoLabelVue from '../InfoLabel.vue';

export default {
  components: {
    InfoLabelVue,
  },
  emits: ['editTemplate', 'deleteTemplate'],
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <q-card flat bordered class="my-card bg-grey-1 q-mb-md full-width">
    <q-card-section>
      <div class="row items-start no-wrap">
        <div class="col">
          <InfoLabelVue title="Nombre" :valueRender="data.name" />
          <InfoLabelVue title="Modulo" :valueRender="data.modules" />
          <InfoLabelVue title="Tipo" :valueRender="data.type" />
          <InfoLabelVue title="Descripción" :valueRender="data.description" />
          <InfoLabelVue title="CreatedBy" :valueRender="data.createdBy" />
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close :offset="[110, 0]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section @click="$emit('editTemplate', 'read', data)"
                    >Editar</q-item-section
                  >
                </q-item>
                <q-item clickable>
                  <q-item-section @click="$emit('deleteTemplate')"
                    >Eliminar</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
