<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'ViewLeads',
  });
</script>
<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { AccountStore } from '../store/AccountStore';
  import { HANSACRM3_URL } from 'src/conections/api_conectors';
  import { QTableColumn } from 'quasar';
  import LeadDialog from 'src/modules/Leads/components/Dialogs/LeadDialog.vue';
  import { updateModuleRecord } from 'src/services/GlobalService';
  import RelacionadoLed from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoLed.vue';
  import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
  import { userStore } from 'src/modules/Users/store/UserStore';
  import Notification from 'src/composables/notify';
  const { getRelationAll } = AccountStore();
  const props = defineProps < {
    idAccount: string;
    nameAccount?: string;
  } > ();
  const filter = ref('');
  const ActiveSqeleton = ref(false);
  //const filterdocRelation = ref < any > ([]);
  const dataResult = ref([] as { [key: string]: string }[]);
  const leadDialogRef = ref < InstanceType < typeof LeadDialog > | null > (null);
  const relacionadoLeadRef = ref < InstanceType < typeof RelacionadoLed > | null > (
    null
  );
  const alert = ref(false);
  const infoLead = ref();
  const user = userStore();
  const { userCRM } = user;
  const relacarga = ref(false);
  const alertDelet = ref(false);

  onMounted(async () => {
    dataResult.value = await getRelationAll('Accounts', props.idAccount);
    ActiveSqeleton.value = true;
  });

  const openDialogLead = async (id?: string) => {
    await leadDialogRef.value?.openDialogAccountTab(id ? id : '');
  };

  const createNewLead = async (idAccount: string) => {
    const nameAcc: string = !!props.nameAccount
      ? props.nameAccount?.toString()
      : '';
    await leadDialogRef.value?.openDialogAccountTab('', {
      id: idAccount,
      name: nameAcc,
    });
  };

  const openAdvancedFilteLead = async () => {
    await relacionadoLeadRef.value?.openDialog();
  };

  const selectRelaLead = async (item: any) => {
    infoLead.value = item;
    alert.value = true;
  };

  const saveRelationLeadAccount = async () => {
    try {
      relacarga.value = true;
      const attributes = {
        modified_user_id: userCRM.id,
        account_id_c: props.idAccount,
      };

      await updateModuleRecord('HANO_Lead', infoLead.value.id, attributes);
      await relacionadoLeadRef.value?.onClose();
      await reloadLeadAccount();
      alert.value = false;
      relacarga.value = false;
    } catch (error) {
      Notification(
        'negative',
        'error',
        '<strong>Ops¡<strong/> Ocurrio un error.'
      );
    }
  };

  const openAlertDeletedRelationLeadAccount = async (itemLead: any) => {
    alertDelet.value = true;
    infoLead.value = { id: itemLead.idLead, name: itemLead.lead };
  };

  const deletedRelationLeadAccount = async () => {
    try {
      relacarga.value = true;
      const attributes = {
        modified_user_id: userCRM.id,
        account_id_c: '',
      };
      await updateModuleRecord('HANO_Lead', infoLead.value.id, attributes);
      alert.value = false;
      await reloadLeadAccount();
      relacarga.value = false;
    } catch (error) {
      Notification(
        'negative',
        'error',
        '<strong>Ops¡<strong/> Ocurrio un error.'
      );
    }
  };

  const reloadLeadAccount = async () => {
    dataResult.value = await getRelationAll('Accounts', props.idAccount);
  };

  // const openwindows = (id: string) => {
  //   const url = link + id;
  //   window.open(url, '_blank');
  // };

  const filterdocRelation = computed(() => {
    return dataResult.value.filter(
      (objeto) =>
        objeto.lead.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
        objeto.estadoLead.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
        objeto.asignado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
    );
  });
  const columns: QTableColumn[] = [
    {
      name: 'lead',
      align: 'left',
      label: 'lead',
      field: 'lead',
      sortable: true,
    },
    {
      name: 'estado',
      align: 'left',
      label: 'Estado',
      field: 'estado',
      sortable: true,
    },
    {
      name: 'fecha_creacion',
      align: 'left',
      label: 'Fecha de Creación',
      field: 'fecha_creacion',
      sortable: true,
    },
    {
      name: 'fecha_cierre',
      align: 'left',
      label: 'Fecha de cierre',
      field: 'fecha_cierre',
      sortable: true,
    },
    {
      name: 'monto',
      align: 'left',
      label: 'Monto',
      field: 'monto',
      sortable: true,
    },
    {
      name: 'asignado',
      align: 'left',
      label: 'Asignado a',
      field: 'asignado',
      sortable: true,
    },
    {
      name: 'descripcion',
      align: 'left',
      label: 'Descripción',
      field: 'descripcion',
      sortable: true,
    },
  ];
  // const link =
  //   HANSACRM3_URL + '/index.php?module=HANQ_Reservas&action=DetailView&record=';

  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 200,
  });
</script>
<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input bottom-slots dense v-model="filter" placeholder="Buscar por lead, estado y asignado">
            <template v-slot:hint>
              <span class="text-primary">{{
                filterdocRelation.length == 1
                ? filterdocRelation.length + ' Lead encontrado'
                : filterdocRelation.length + ' Leads encontrados'
                }}
              </span>
            </template>
            <template v-slot:append>
              <q-icon name="search" v-if="!filter" />
              <q-icon name="clear" v-else @click="filter = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end q-gutter-md">
            <slot name="buttons">
              <q-btn icon="update" :color="$q.dark.isActive ? 'grey-3' : 'primary'" dense flat
                @click="reloadLeadAccount" :label="`${$q.screen.xs ? '' : ''}`" />

              <div class="q-gutter-xs">
                <q-btn :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'" color="primary" target="_blank"
                  @click="createNewLead(props.idAccount)" label="Nuevo Lead" size="md" />
                <q-btn :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'" color="primary" @click="openAdvancedFilteLead"
                  label="buscar y agregar" size="md" />
              </div>
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="filterdocRelation.length > 0">
          <q-table :flat="!$q.screen.xs ? true : false" :grid="$q.screen.xs" :rows="filterdocRelation"
            :columns="columns" row-key="lead" :pagination="pagination" hide-bottom>
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-medium">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                  <q-btn size="sm" round :color="
                      props.row.estado == 'Confirmado'
                        ? 'green'
                        : props.row.estado == 'Rechazado'
                        ? 'red'
                        : props.row.estado == 'Cerrado'
                        ? 'teal'
                        : props.row.estado == 'Bloqueado'
                        ? 'orange'
                        : 'grey'
                    " :icon="
                      props.row.estado == 'Confirmado'
                        ? 'check'
                        : props.row.estado == 'Rechazado'
                        ? 'close'
                        : props.row.estado == 'Cerrado'
                        ? 'done_all'
                        : props.row.estado == 'Bloqueado'
                        ? 'block'
                        : 'edit_off'
                    ">
                  </q-btn>
                </q-td>
                <q-td key="lead" :props="props">
                  <a class="text-bold cursor-pointer flex items-center text-primary"
                    @click="() => openDialogLead(props.row.idLead)">{{ props.row.lead }}</a>
                </q-td>
                <q-td key="lead" :props="props">
                  <q-chip :color="
                      props.row.estadoLead == 'Confirmado'
                        ? 'teal'
                        : props.row.estadoLead == 'Rechazado'
                        ? 'red'
                        : props.row.estadoLead == 'Cerrado'
                        ? 'teal'
                        : props.row.estadoLead == 'Bloqueado'
                        ? 'orange'
                        : 'grey'
                    " size="xs" text-color="white">
                    {{ props.row.estadoLead }}
                  </q-chip>
                </q-td>
                <q-td key="lead" :props="props" :class="
                    $q.dark.isActive
                      ? 'text-white'
                      : props.row.fechaCreacionLead == 'Sin Registrar'
                      ? 'text-grey'
                      : 'text-black'
                  ">
                  <q-icon name="event" class="q-pr-xs" :color="
                      props.row.fechaCreacionLead == 'Sin Registrar'
                        ? 'grey'
                        : 'blue'
                    " />
                  {{ props.row.fechaCreacionLead }}
                </q-td>
                <q-td key="lead" :props="props" :class="
                    $q.dark.isActive
                      ? 'text-white'
                      : props.row.fechaCreacionLead == 'Sin Registrar'
                      ? 'text-grey'
                      : 'text-black'
                  ">
                  <q-icon name="event" class="q-pr-xs" :color="
                      props.row.fechaCreacionLead == 'Sin Registrar'
                        ? 'grey'
                        : 'blue'
                    " />
                  {{ props.row.fecha_cierre }}
                </q-td>
                <q-td key="lead" :props="props">
                  {{
                  props.row.monto.toLocaleString('en-ES', {
                  minimumFractionDigits: 2,
                  })
                  }} {{ props.row.moneda }}
                </q-td>
                <q-td key="lead" :props="props" :class="
                    $q.dark.isActive
                      ? 'text-white'
                      : props.row.asignado == 'Sin Registrar'
                      ? 'text-grey'
                      : 'text-black'
                  ">
                  <q-icon name="person" class="q-pr-xs" :color="
                      props.row.asignado == 'Sin Registrar' ? 'grey' : 'blue'
                    " />{{ props.row.asignado }}
                </q-td>

                <q-td key="descripcion" :props="props">
                  {{ props.row.descripcion }}
                </q-td>
                <q-td key="lead" :props="props">
                  <q-btn size="12px" flat dense round icon="more_vert" @click="(event:Event)=>event.stopPropagation()">
                    <q-menu>
                      <q-list style="min-width: 100px" dense>
                        <q-item clickable v-close-popup>
                          <q-item-section @click="
                              openAlertDeletedRelationLeadAccount(props.row)
                            ">Quitar</q-item-section>
                        </q-item>
                        <q-separator />
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </template>
        <template v-else>
          <q-card style="height: 60vh; width: 100%" flat class="my-card column flex-center">
            <img src="list-empty.png" alt="lista vacia" style="width: 220px; height: 200px" />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5">No se encontraron reservas relacionadas...</small>
            </div>
          </q-card>
        </template>
      </div>
    </q-card-section>
    <q-inner-loading :showing="relacarga" label="Relacionando una cotización.." label-class="text-teal"
      label-style="font-size: 1.1em" />
  </q-card>

  <q-card v-else style="height: 60vh; width: 100%">
    <q-skeleton height="100px" square class="bg-primary text-white" />
    <q-card-section>
      <q-skeleton type="QBtn" width="20%" class="text-subtitle1" />
    </q-card-section>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left" style="width: 150px">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in 7" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="50px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="35px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="65px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="25px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <LeadDialog ref="leadDialogRef" @formSave="reloadLeadAccount" />
  <RelacionadoLed account_id="" ref="relacionadoLeadRef" @selectItem="selectRelaLead" />
  <AlertComponent v-model="alert" icon="request_quote" icon-color="teal" icon-size="70px"
    title="Relacionar la cotización" btnColor="teal" btnText="Si, relacionar" @confirm="saveRelationLeadAccount"
    @denegate="alert = false">
    <template #body>
      <span class="text-center col-12">¿ Desea relacionar le Lead ? </span>

      <span class="text-center text-teal col-12">
        {{ infoLead.nombre }}
      </span>
    </template>
  </AlertComponent>
  <AlertComponent v-model="alertDelet" icon="request_quote" icon-color="teal" icon-size="70px"
    title="Relacionar la cotización" btnColor="teal" btnText="Si, quitar relacion" @confirm="deletedRelationLeadAccount"
    @denegate="alert = false">
    <template #body>
      <span class="text-center col-12">¿ Desea eliminar la relación del Lead ?
      </span>

      <span class="text-center text-teal col-12">
        {{ infoLead.nombre }}
      </span>
    </template>
  </AlertComponent>
</template>
<style lang="scss" scoped>
#mapid {
  width: 700px;
  height: 600px;
}
.q-table--no-wrap th,
.q-table--no-wrap td {
  white-space: revert;
}
</style>