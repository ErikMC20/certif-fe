<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { RelationInfoLead } from '../../utils/types';
  import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
  import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
  import { useAsyncState } from '@vueuse/core';
  import visorDocumentDialog from '../Dialogs/visorDocumentDialog.vue';
  import {  QTableColumn } from 'quasar';
  const props = withDefaults(
    defineProps < { id?: string; data?: RelationInfoLead } > (),
    {}
  );
  const reserveStore = useReservasStore();
  const baseCardRef = ref < InstanceType < typeof ViewCardVue > | null > ();
  const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
  const visorDocDialog = ref();
  const iddoc = ref('');
  onMounted(async () => {
    await execute();
  });

  const { state, isLoading, execute } = useAsyncState(
    async () => {
      return await reserveStore.getDocOpportunitiesReserve(props.id || '');
    },
    {} as any,
    { immediate: false }
  );

  const exposeData = () => {
    // return leadRelations.value;
  };

  defineExpose({
    exposeData,
    isEditing,
  });

  const openVisorDoc = (id: string) => {
    iddoc.value = id;
    visorDocDialog.value.open = !visorDocDialog.value.open;
  };

  const columns :QTableColumn[]  = [
    { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
    { name: 'fecha_publicacion', align: 'left', label: 'Fecha Publicacion', field: 'fecha_publicacion', sortable: true },
    { name: 'tipo', align: 'left', label: 'Tipo', field: 'tipo' }
  ]
</script>
<template>
  <view-card-component flat ref="baseCardRef" :initial-status="id ? 'read' : 'edit'" icon-name="content_copy"
    title="Documentos cargados a la oportunidad" bordered style="width:100%">
    <template #edit>
      <div class="row q-col-gutter-lg q-py-md">


      </div>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg q-py-md">
        <div class="col-12">
          <q-table flat :rows="state.data" :columns="columns" row-key="name" hide-bottom>
            <template v-slot:body="props">
              <q-tr :props="props">

                <q-td key="nombre" :props="props">
                  <q-icon class="text-bold cursor-pointer" name="text_snippet" color="blue" size="sm"
                    @click="openVisorDoc(props.row.id_view_documento)" />
                  {{ props.row.nombre }}
                </q-td>
                <q-td key="fecha_publicacion" :props="props">
                  {{ props.row.fecha_publicacion }}
                </q-td>
                <q-td key="tipo" :props="props">
                  {{ props.row.tipo }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </template>
  </view-card-component>
  <visorDocumentDialog ref="visorDocDialog" :idModule="iddoc"  />
</template>