<template>
  <div :class="$q.screen.xs ? 'q-px-md' : 'q-px-xl'">
    <h3>Lista de Plantillas</h3>
    <div class="row justify-between q-mb-xl">
      <div :class="{ 'q-mb-md': $q.screen.xs }">
        <q-input outlined dense v-model="filter" placeholder="Filtrar y Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div>
        <q-btn
          color="primary"
          icon="add"
          label="Crear Nuevo"
          @click="onEditTemplate('edit')"
        />
      </div>
    </div>
    <q-table
      :grid="$q.screen.xs"
      :rows="emailsTemplateData"
      :columns="emailsTemplateColumns"
      row-key="name"
      :filter="filter"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props" align="center">
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 0]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section @click="onEditTemplate('read', props.row)"
                    >Editar</q-item-section
                  >
                </q-item>
                <q-item clickable>
                  <q-item-section
                    @click="onDeleteTemplate(props.row.id.toString())"
                    >Eliminar</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:item="slotProps">
        <MobileTableVue
          :data="slotProps.row"
          @editTemplate="onEditTemplate"
          @deleteTemplate="onDeleteTemplate"
        />
      </template>
    </q-table>
  </div>
  <dialog-component
    titleDialog="Edicion de plantilla"
    v-model="open"
    :headerDisabled="false"
    :footerDisabled="dialogState !== 'edit'"
  >
    <template v-slot:header
      ><div class="q-px-md q-py-sm text-bold text-h6">
        <q-icon name="print" class="q-mr-sm" />
        {{ dialogTitle }}
      </div></template
    >
    <template v-slot:body>
      <div>
        <FormTemplateVue
          v-if="dialogState === 'edit'"
          :option-divisions="optionsDivision"
          :options-survey="optionsSurvey"
          :options-module="optionsModule"
          :options-type="optionsType"
          @submit-form="onSubmitting"
          ref="formRef"
        />
        <div v-else class="q-pa-md">
          <div class="row">
            <q-btn
              class="q-mr-md"
              color="primary"
              icon="edit"
              round
              @click="onChangeEditState"
              ><q-tooltip>Editar Template</q-tooltip></q-btn
            >

            <q-btn
              color="negative"
              icon="delete"
              round
              @click="onDeleteTemplate"
              ><q-tooltip>Eliminar Template</q-tooltip></q-btn
            >
          </div>
          <div class="row q-mt-md q-col-gutter-md">
            <div class="col-12 col-md-5">
              <q-card class="q-pa-xs">
                <div class="q-px-sm q-py-sm text-bold text-subtitle1">
                  <q-icon name="description" class="q-mr-sm" />
                  Datos de Plantilla
                </div>
                <q-card-section class="card-template-section">
                  <info-label-vue
                    v-for="info in infoLabels"
                    :key="info"
                    :title="info.title"
                    :valueRender="info.value"
                  />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-7">
              <q-card class="q-pa-xs">
                <div class="q-px-sm q-py-sm text-bold text-subtitle1">
                  <q-icon name="preview" class="q-mr-sm" />
                  Previsualizacion de Plantilla
                </div>
                <q-card-section
                  class="card-template-email-read"
                  v-html="editor"
                />
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="q-pa-sm row q-gutter-md">
        <q-btn
          color="primary"
          icon="save"
          label="Guardar"
          @click="onRequestSubmit"
        />
        <q-btn color="negative" icon="close" label="Cancelar" v-close-popup />
      </div>
    </template>
  </dialog-component>
  <DeleteDialogVue
    v-model="openDelete"
    :idTemplate="idToDelete"
    @deleteTemplate="onStartDelete"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import {
  emailsTemplateColumns,
  emailsTemplateData,
  templateInputs,
  templateDataComplete,
} from '../data/datasource';
import MobileTableVue from '../components/Table/MobileTable.vue';
import InfoLabelVue from '../components/InfoLabel.vue';
import DeleteDialogVue from '../components/Dialog/DeleteDialog.vue';
// import AnotherFormVue from '../components/Form/AnotherForm.vue';
// import FormTemplateVue from '../components/Form/FormTemplate.vue';
import FormTemplateVue from '../../../components/Emails/FormTemplateEmail.vue';

export default defineComponent({
  name: 'EmailsTemplate',
  components: {
    MobileTableVue,
    InfoLabelVue,
    DeleteDialogVue,
    FormTemplateVue,
  },
  setup() {
    const open = ref(false);
    const openDelete = ref(false);
    const dialogTitle = ref('Default Title');
    const currentSelected = ref<any>(null);
    const infoLabels = ref(
      ref(
        emailsTemplateColumns
          .filter((val) => val.val)
          .map((value) => ({
            title: value.label,
            value: currentSelected.value
              ? currentSelected.value[`${value.val}`]
              : 'nothing',
          }))
      )
    );
    const dialogState = ref('read');
    const idToDelete = ref<string>('');

    const templateData = ref({
      division: '',
      title: '',
      modules: '',
      name: '',
      type: '',
      description: '',
      subject: '',
      createdBy: '',
      userAssigned: '',
      created: '',
      documents: [],
      variables: '',
      surveys: [],
    });

    // Form fields
    const templateDivision = ref(null);
    const templateName = ref(null);
    const templateUserAssigned = ref(null);
    const templateDescription = ref(null);
    const templateSurveys = ref(null);
    const templateModule = ref(null);
    const templateType = ref(null);
    const templateSubject = ref(null);
    const templateVariable = ref(null);
    const templateDocument = ref(null);

    const formRef = ref<any>();

    // Form submitting action
    const onRequestSubmit = () => {
      console.log(formRef.value);
      formRef.value.test();
    };
    const onSubmitting = (payload: any) => {
      console.log(payload);
    };

    console.log(
      emailsTemplateColumns
        .filter((val) => val.val)
        .map((value) => ({
          title: value.label,
          value:
            value.val !== undefined ? currentSelected[value.val] : 'nothing',
        }))
    );

    return {
      filter: ref(''),
      idToDelete,
      // Form fields
      templateDivision,
      templateName,
      templateUserAssigned,
      templateDescription,
      templateSurveys,
      templateModule,
      templateType,
      templateSubject,
      templateVariable,
      templateDocument,
      templateInputs,
      infoLabels,
      optionsDivision: ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
      optionsSurvey: [
        'Encuesta de promocion',
        'Encuesta de nuevo cliente',
        'Encuesta de participacion',
      ],
      optionsModule: ['Todos', 'Cuentas', 'Recursos', 'Vistas', 'Transporte'],
      optionsType: [
        'Ninguna',
        'Campaña',
        'Emails',
        'Aprobacion',
        'Respuesta a aprobacion',
        'Confirmacion de reserva',
        'Nueva Reserva',
        'Reserva Rechazada',
      ],
      formRef,
      // End form fields
      // State of dialog
      dialogState,
      dialogTitle,
      emailsTemplateColumns,
      emailsTemplateData,
      open,
      openDelete,
      templateDataComplete,
      editor:
        ref(`<div style="text-align: center; background-color: #003c9c; color: white; height: 200px;">
&nbsp; &nbsp; <font size="7"><b>Do</b> something <b>interesting</b>!
</font></div>`),

      onClickSimple: (data = 'Nothing') => {
        console.log(data);
      },
      onEditTemplate: (state = 'read', data?: any) => {
        open.value = true;
        dialogTitle.value = data ? 'Editing a template' : 'Creating a template';
        dialogState.value = state === 'read' ? 'read' : 'edit';
        console.log('Hey this is your data', data);
        if (!data) return;
        currentSelected.value = data;
        infoLabels.value = emailsTemplateColumns
          .filter((val) => val.val)
          .map((value) => ({
            title: value.label,
            value: currentSelected.value[`${value.val}`],
          }));
        console.log(
          emailsTemplateColumns
            .filter((val) => val.val)
            .map((value) => ({
              title: value.label,
              value: currentSelected.value[`${value.val}`],
            }))
        );
      },
      onChangeEditState: () => {
        if (dialogState.value === 'edit') {
          dialogState.value = 'read';
        } else {
          dialogState.value = 'edit';
        }
        console.log('Current State: ', dialogState.value);
      },
      onDeleteTemplate: (id: string) => {
        openDelete.value = true;
        idToDelete.value = id;
      },
      onStartDelete: (id: string) => {
        console.log('Deleting this element', id);
      },
      onCloseDialog: () => {
        open.value = false;
      },
      onRequestSubmit,
      onSubmitting,
    };
  },
});
</script>

<style lang="scss">
.header-dialog {
  font-weight: 600;
  font-size: large;
}

.card-template-section {
  max-height: 75vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: rgb(243, 243, 243);
  }
  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(123, 123, 123, 0.3);
  }
}

.card-template-email-section {
  height: 75vh;
}

.card-template-email-read {
  height: 70vh;
}

.q-editor {
  height: 100%;
}

.q-editor__content {
  background-color: rgb(248, 248, 248);
  border: 1px solid #d9d9d9;
  border-radius: 0px 0px 5px 5px;
}
</style>
