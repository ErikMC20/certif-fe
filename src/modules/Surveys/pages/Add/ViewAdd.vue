<template>
  <div class="row items-start content-center">
    <div
      class="col-lg-5 col-md-6 col-sm-12 q-py-md q-pr-sm q-pl-md items-center content-center"
    >
      <q-card class="my-card q-mb-md" bordered flat>
        <q-card-section class="row">
          <div class="q-pa-sm flex text-bold text-uppercase">
            <q-icon
              name="article"
              color="primary"
              size="20px"
              class="q-pr-xs"
            ></q-icon>
            INFORMACIÓN BÁSICA DE LA ENCUESTA
          </div>
          <div class="col-12 q-pa-sm">
            <q-input outlined v-model="form.titulo" label-slot clearable dense>
              <template v-slot:label> Titulo de la encuesta: </template>
            </q-input>
          </div>
          <div class="col-6 q-pa-sm">
            <SelectForm
              v-model="form.division"
              :options="options"
              label="División"
            />
          </div>
          <div class="col-6 q-pa-sm">
            <SelectForm
              v-model="form.modulo"
              :options="options"
              label="Módulos"
            />
          </div>
          <div class="col-6 q-pa-sm">
            <SelectForm
              v-model="form.a_mercado"
              :options="options"
              label="Área de mercado"
            />
          </div>
          <div class="col-6 q-pa-sm">
            <SelectForm
              v-model="form.grupo_cliente"
              :options="options"
              label="Grupo cliente"
            />
          </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card" bordered flat>
        <q-card-section class="row">
          <div class="q-pa-sm flex text-bold text-uppercase">
            <q-icon
              name="article"
              color="primary"
              size="20px"
              class="q-pr-xs"
            ></q-icon>
            INFORMACIÓN adicional de la encuesta
          </div>

          <div class="row col-12">
            <DatepickerForm v-model="form.fecha_inicio" />
            <q-input
              outlined
              v-model="form.fecha_fin"
              mask="date"
              :rules="['date']"
              dense
              class="col-lg-6 col-md-6 col-sm-12 q-pa-sm"
              label="Fecha fin"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover>
                    <q-date v-model="form.fecha_fin">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row col-12">
            <q-file
              outlined
              bottom-slots
              v-model="form.logo"
              label="Logo:"
              dense
              class="col-lg-6 col-md-6 col-sm-12 q-pa-sm"
            >
              <template v-slot:append>
                <q-icon
                  name="cloud_upload"
                  @click.stop="form.logo = []"
                  class="cursor-pointer"
                />
              </template>
            </q-file>
            <q-input
              outlined
              v-model="form.contador"
              label="Contador de reenvios"
              type="number"
              min="1"
              dense
              class="col-lg-6 col-md-6 col-sm-12 q-pa-sm"
            />
          </div>
          <div class="col-12 q-pa-sm">
            <q-input
              outlined
              v-model="form.ur_redireccion"
              label-slot
              clearable
              dense
              placeholder="http://www.hansa.com.bo/galeria"
            >
              <template v-slot:label> URL de redireccion: </template>
            </q-input>
          </div>
          <div class="col-12 q-pa-xs">
            <q-checkbox
              v-model="form.progreso"
              label="Habilitar contador de progreso"
            />
          </div>
        </q-card-section>
      </q-card>
      <pre>
        {{ form }}

        {{ date }}
      </pre>
    </div>
    <div class="col-lg-7 col-md-6 col-sm-12 q-py-md q-px-sm">
      <q-card class="my-card" bordered flat>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="mails" label="Página de Bienvenida" />
          <q-tab name="alarms" label="Página de preguntas" />
          <q-tab name="movies" label="Página de agradecimiento" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mails" class="q-pa-sm">
            <div class="block text-uppercase text-right">
              <q-checkbox
                v-model="encuesta.pagina_bienvenida"
                label="Habilitar página de bienvenida"
              />
            </div>
            <q-editor
              v-model="encuesta.contenido_bienvenida"
              content-class=""
              :disable="!encuesta.pagina_bienvenida"
              toolbar-text-color="grey-8"
              min-height="60vh"
              style="border-radius: 0px !important"
              toolbar-toggle-color="grey-white"
              toolbar-bg="white"
              :toolbar="[
                ['bold', 'italic', 'underline'],
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: ['p', 'h3', 'h4', 'h5', 'h6', 'code']
                  },
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                  }
                ],
                ['undo', 'redo']
              ]"
            />
          </q-tab-panel>

          <q-tab-panel name="alarms" class="q-pa-sm">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="movies" class="q-pa-sm">
            <div class="block text-uppercase text-right">
              <q-checkbox
                v-model="encuesta.pagina_gracias"
                label="Habilitar página de agradecimiento"
                class=""
              />
            </div>
            <q-editor
              v-model="encuesta.contenido_gracias"
              content-class=" "
              toolbar-text-color="grey-8"
              :disable="!encuesta.pagina_gracias"
              min-height="60vh"
              toolbar-toggle-color="grey-8"
              toolbar-bg="white"
              :toolbar="[
                ['bold', 'italic', 'underline'],
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: ['p', 'h3', 'h4', 'h5', 'h6', 'code']
                  },
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                  }
                ],
                ['undo', 'redo']
              ]"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { addComposable } from '../../composables/addComposable';
import { SelectForm, DatepickerForm } from '../../components';

const { form, encuesta } = addComposable();
const tab = ref('mails');
const options = ref(['item1', 'item2', ' item3', 'item4']);
const date = ref('');
// onMounted(async () => {
//   form.value = await getForm();
//   console.log(form.value);
//   formulario.value = form.value.map((object: any) => {
//     return (object.name = object.value ?? '');
//   });
//   console.log(formulario.value);
// });
</script>

<style lang="scss">
.q-editor__content {
  font-family: Arial, Helvetica, sans-serif !important;
}
</style>
