<script setup lang="ts">
import { ref, onMounted } from 'vue';
const emits = defineEmits(['submitForm']);

const props = defineProps({
  DataEmail: {
    type: Object,
    default: () => ({
      id: 0,
      editor: `<table class="MsoNormalTable" style="width: 100%; border-collapse: collapse;" border="0" cellspacing="0"
  cellpadding="0">
  <tbody>
    <tr>
      <td style="width: 10%; background: #003c79; padding: 0cm;" width="10%"> </td>
      <td
        style="width: 70%; background: #003c79; padding-bottom: 15pt; padding-top: 22.5pt; padding-left: 22.5pt; padding-right: 22.5pt;"
        width="60%">
        <p><span style="font-size: 27pt; font-family: 'Segoe UI Light', 'sans-serif'; color: #ffffff;"></span></p>
      </td>
      <td style="background: #003c79; padding: 0cm;"> </td>
      <div>
        <img src="../../../../../../images/hansa.png" align="center">
      </div>
    </tr>
    <tr>
      <td style="width: 10%; background: #FFFFFF; padding: 0cm;" width="10%"> </td>
      <td style="width: 60%; background: #FFFFFF; padding: 22.5pt;" width="60%">
        <table class="MsoNormalTable" style="width: 100%; border-collapse: collapse;" border="0" cellspacing="0"
          cellpadding="0">
          <tbody>
            <tr>
              <td style="width: 120.25pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="163">
                <strong>Asunto</strong>
              </td>
              <td style="width: 5pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="5">:</td>
              <td style="padding-left: .75pt; padding-right: .75pt;" valign="top">
                <div style="margin-bottom: 0pt;"></div>
              </td>
            </tr>
            <tr>
              <td style="width: 120.25pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="163">
                <strong>Asistentes</strong>
              </td>
              <td style="width: 5pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="5">:</td>
              <td style="padding-left: .75pt; padding-right: .75pt;" valign="top">
                <div style="margin-bottom: 0pt;"><strong><br /></strong></div>
              </td>
              <td>
                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                  <div class="image">
                    <img src="img/aaa.jpg" class="img-circle elevation-2" alt="User Image">
                  </div>
                  <div class="info">
                    <a href="#" class="d-block">Asistente1</a>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 120.25pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="163">
                <strong>Lugar de Reunion</strong>
              </td>
              <td style="width: 5pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="5">:</td>
              <td style="padding-left: .75pt; padding-right: .75pt;" valign="top">
                <div style="margin-bottom: 0pt;"><a href="#" class="d-block">Link de Reunion</a></div>
              </td>
            </tr>
            <tr>


              <td style="width: 120.25pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="163">
                <p><strong>Link de Reunion</strong></p>
              </td>
              <td style="width: 5pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="5">:</td>
              <td style="padding-left: .75pt; padding-right: .75pt;" valign="top">
                <div style="margin-bottom: 0pt;"></div>
              </td>
            </tr>
            <tr>
              <td style="width: 120.25pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="163">
                <p><strong><strong><strong>Fecha de Emision</strong></strong></strong></p>
              </td>
              <td style="width: 5pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="5">:</td>
              <td style="padding-left: .75pt; padding-right: .75pt;" valign="top">
                <div style="margin-bottom: 0pt;"></div>
              </td>
            </tr>

            <tr>
              <td class="bg_white email-section">
                <div class="heading-section" style="text-align: center; padding: 0 30px;">
                  <h3>Reunión</h3>
                  <p>Asunto de la reunion</p>
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td valign="top" width="33.333%" style="padding-top: 20px;" class="services">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td class="icon">
                            <img src="images/" alt=""
                              style="width: 60px; max-width: 600px; height: auto; margin: auto; display: block;">
                          </td>
                        </tr>
                        <tr>
                          <td class="text-services">
                            <h5>Fecha de Inicio</h5>
                            <p>Fecha de inicio de la reunión</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="top" width="33.333%" style="padding-top: 20px; background: rgba(0,0,0,.08);"
                      class="services">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td class="icon">
                            <img src="images/001-diet.png" alt=""
                              style="width: 60px; max-width: 600px; height: auto; margin: auto; display: block;">
                          </td>
                        </tr>
                        <tr>
                          <td class="text-services">
                            <h5>Hora Inicio</h5>
                            <p>Hora de inicio de la reunión</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="top" width="33.333%" style="padding-top: 20px;" class="services">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td class="icon">
                            <img src="images/003-recipe-book.png" alt=""
                              style="width: 60px; max-width: 600px; height: auto; margin: auto; display: block;">
                          </td>
                        </tr>
                        <tr>
                          <td class="text-services">
                            <h5>Hora Fin</h5>
                            <p>Hora de finalización</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
              <td style="width: 5pt; padding-left: .75pt; padding-right: .75pt;" valign="top" width="5">:</td>
              <td valign="middle" width="50%">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td class="text-services" style="text-align: left; padding-left:25px;">
                      <div class="heading-section">
                        <h2>Asistentes</h2>
                        <p>Asistentes para la reunion.</p>
                        <p><a href="#" class="btn btn-primary">ver asistentes</a></p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
      <td style="background: #FFFFFF; padding: 0cm;"> </td>
    </tr>
    <tr>
      <td
        style="width: 10%; background: #003c79; padding-bottom: 15pt; padding-top: 22.5pt; padding-left: 1cm; padding-right: 1cm;"
        colspan="3" width="10%">
        <p class="MsoNormal"><span style="font-size: 18pt; font-family: Arial; color: #ffffff;"><strong><span
                style="color: #ffffff;">HANSA CRM</span></strong></span></p>
      </td>
    </tr>
  </tbody>
</table>`,
    }),
  },
});

// const CargarEmail = async () => {
//   try {
//     const a = 'aa';
//     const res = await fetch(a);
//     const datos = await res.json();

//     return datos;
//   } catch (err) {
//     console.log(err);
//   }
// };

const currentTemplateData = ref(props.DataEmail);

onMounted(() => {
  currentTemplateData.value = props.DataEmail;
});

const submitting = () => {
  emits('submitForm', currentTemplateData);
};

const test = () => {
  console.log('Probando componente');
};

defineExpose({
  test,
  submitting,
});
</script>

<template>
  <q-form class="q-pa-md row q-col-gutter-md" @submit.prevent="submitting">
    <div class="col-12 col-md-5">
      <q-card class="q-pa-xs">
        <div class="q-px-sm q-py-sm text-bold text-subtitle1">
          <q-icon name="description" class="q-mr-sm" />
          Configuracion
        </div>
        <q-card-section class="card-template-section">
          <div>
            <q-checkbox v-model="right" label="Envio Automatico" />
          </div>
          <div>
            <q-checkbox v-model="right" label="Recordoa" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-7">
      <q-card class="q-pa-xs">
        <div class="q-px-sm q-py-sm text-bold text-subtitle1">
          <q-icon name="send" class="q-mr-sm" />
          Email
        </div>
        <q-card-section horizontal class="card-template-section">
          <q-card-section class="col-md-2">
            <!-- <div
              style="width: 200px; height: 70px"
              class="bg-purple text-white rounded-borders row flex-center q-mt-md col-12"
            >
              Enviar
            </div> -->
            <q-btn
              color="primary"
              size="XL"
              icon-right="send"
              title="Enviar correo"
              label="ENVIAR"
            />
          </q-card-section>
          <q-card-section class="row q-col-gutter-sm">
            <q-label class="col-md-2">Para:</q-label>
            <q-input
              outlined
              dense
              v-model="text"
              type="text"
              label="Para..."
              class="col-10"
            />
            <q-label class="col-md-2">CC:</q-label>
            <q-input
              outlined
              dense
              v-model="text"
              label="Con copia..."
              size="xs"
              class="col-10"
            >
              <template v-slot:append>
                <q-btn dense flat icon="add" label="Añadir" /> </template
            ></q-input>
            <q-item-section class="col-md-2">CCO:</q-item-section>
            <q-input
              outlined
              dense
              v-model="text"
              label="Con copia oculta..."
              size="xs"
              class="col-10"
            >
              <template v-slot:append>
                <q-btn dense flat icon="add" label="Añadir" /> </template
            ></q-input>

            <q-item-section class="col-md-2">Asunto:</q-item-section>
            <q-input outlined dense v-model="text" label="..." class="col-10" />

            <q-label class="col-md-2">Plantillas:</q-label>
            <q-select
              v-model="currentTemplateData.modules"
              type="text"
              outlined
              dense
              label="Módulo"
              class="col-10"
            />
            <q-file
              v-model="currentTemplateData.documents"
              label="Adjuntar Local"
              outlined
              use-chips
              multiple
              dense
              class="col-6"
            />
            <q-file
              v-model="currentTemplateData.documents"
              label="Adjuntar Sistema"
              outlined
              use-chips
              multiple
              dense
              class="col-6"
            />
            <div>
              <q-checkbox v-model="right" label="CC para mi" />
            </div>
          </q-card-section>
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <q-editor
            v-model="currentTemplateData.editor"
            :dense="$q.screen.lt.md"
            :toolbar="[
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify'],
                },
              ],
              [
                'bold',
                'italic',
                'strike',
                'underline',
                'subscript',
                'superscript',
              ],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7',
                  ],
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana',
                  ],
                },
                'removeFormat',
              ],
              ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

              ['undo', 'redo'],
              ['print', 'fullscreen'],
            ]"
            :fonts="{
              arial: 'Arial',
              arial_black: 'Arial Black',
              comic_sans: 'Comic Sans MS',
              courier_new: 'Courier New',
              impact: 'Impact',
              lucida_grande: 'Lucida Grande',
              times_new_roman: 'Times New Roman',
              verdana: 'Verdana',
            }"
          />
        </q-card-section>
        <q-separator />
      </q-card>
    </div>
  </q-form>
</template>
