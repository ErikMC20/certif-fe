<script lang="ts">
  import { ref, computed, toRefs, onMounted } from 'vue';
  import { userStore } from 'src/modules/Users/store/UserStore';
  import { SearchUser } from '../../types/index';
  import GuestsDialog from '../Dialogs/MeetActivityDialog.vue/Dialogs/GuestsDialog.vue';
  import { api } from '../../../boot/axios';
  import { Loading, QSpinnerPuff } from 'quasar';
  import { getRecordsByValue, } from 'src/services/MeetingsServices';
  import { useMeetingActivity } from 'src/composables/core';
</script>

<script lang="ts" setup>
  const { userCRM } = userStore();
  const open = ref(false);
  const usuarioLogueado = ref(userCRM.nombres+' '+userCRM.apellidos);
  const correoUsuarioLoagueado = ref(userCRM.email);
  const division = ref('');
  // const division = ref(userCRM.division.substr(2,20)  || '');
  const idUsuarioLogueado = ref(userCRM.id);
  //const cargo = ref(userCRM.rol);
  const asunto = ref();
  const templates = ref([] as { [key: string]: string }[]);
  const editor = ref(`<p></p>
      <p> </p>
      <p>Atento a sus comentarios<br/><br/><span style="font-size:medium;font-family:'arial black', 'avant garde';color:#000080;"><strong>HANSA CRM</strong></span><br/><span>`+ usuarioLogueado.value + '</span><br /><span><strong>'+ division.value + `</strong></span><br />
      <span style="color:#999999;"><strong>CONFIDENCIALIDAD</strong></span><br /><span style="color:#999999;">La información contenida en este mail es confidencial y de propiedad intelectual de HANSA Ltda. Si usted ha recibido este e-mail por error, le pedimos lo informe al remitente y proceda a la destrucción de su contenido.</span></p>
    `);

  const cc = ref(false);
  const cco = ref(false);
  const archivo = ref(false);
  const seleccionar_plantilla = ref(false);
  const filter = ref('');
  const link = ref('Firma usuario (03)')
  const props = withDefaults(
    defineProps < {
      guests: SearchUser[];
      idModule?: string;
      module?: string;
    } > (),
    {
      idModule: '',
    }
  );
  const paraa = ref([]);
  const ccc = ref([]);
  const ccco = ref([]);
  const origen = ref([]);
  const addGuestDialog = ref(false);
  const addGuestDialog2 = ref(false);
  const addGuestDialog3 = ref(false);
  const guestsSelected = ref(props.guests ? props.guests : ([] as SearchUser[]));
  const guestsSelectedCC = ref([] as SearchUser[]);
  const guestsSelectedCO = ref([] as SearchUser[]);
  const emits = defineEmits < { (event: 'formSaved'): void }> ();
  const { idModule } = toRefs(props);
  const isLoading = ref(false);
  const inputOptions = ref([] as SearchUser[]);
  const { formatModuleName } = useMeetingActivity();
  const formEmail = ref({
    id_userLoged: 'b2cde448-e634-eb75-4d92-5baa9b1fd12d',
    id_emailTemplate: '',
    name_module: props.module,
    id_module: '203c9219-108c-b65b-b672-638a7efcfe79',
    emailSubject: 'ejemplo',
    emailBody: 'este es en formato plano',
    altemailBody: '',
    from_email: [
      'Hansa CRM DEV &lt;crm_dev@hansa.com.bo&gt;'
    ],
    emailto: ['fabio &lt;fzacari@hansa.com.bo&gt;',],
    emailCc: [],
    emailBcc: [],
    attachment: [ 
    ]
  })

  const base = ref('');

  onMounted(async () => {
    gettemplate('1');
  });

  const showCloseDialog = () => {
    open.value = false;
  };

  const clicPlantilla = () => {
    archivo.value = false;
    seleccionar_plantilla.value = !seleccionar_plantilla.value;
  };

  const clicArchivo = () => {
    archivo.value = !archivo.value;
    seleccionar_plantilla.value = false;
  };

  const filterData = async (val: string, update: (cb: () => void) => void) => {
    if (!val) {
      isLoading.value = false;
      return;
    }
    try {
      isLoading.value = true;
      const data = await getRecordsByValue(val);
      update(() => {
        inputOptions.value = [...data];
      });
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  };

  const enviarEmail = async () => {
    Loading.show({
      spinner: QSpinnerPuff,
      message: 'Enviando correo',
    })
    for (let i = 0; i < guestsSelected.value.length; i++) {
      let clave = guestsSelected.value[i].email_address;
      paraa.value.push(clave);
      // console.log(clave);
    }
    console.log(editor.value);
    for (let i = 0; i < guestsSelectedCC.value.length; i++) {
      let clavecc = guestsSelectedCC.value[i].email_address;
      ccc.value.push(clavecc);
      // console.log(clavecc);
    }
    for (let i = 0; i < guestsSelectedCO.value.length; i++) {
      let claveco = guestsSelectedCO.value[i].email_address;
      ccco.value.push(claveco);
    }

    formEmail.value.id_userLoged = idUsuarioLogueado.value;
    origen.value.push(usuarioLogueado.value+' '+'&lt;'+correoUsuarioLoagueado.value+'&gt;');
    formEmail.value.from_email = origen.value;
    formEmail.value.emailto = paraa.value;
    formEmail.value.emailCc = ccc.value;
    formEmail.value.emailBcc = ccco.value;
    formEmail.value.id_module = idModule.value;
    formEmail.value.emailSubject = asunto.value;
    formEmail.value.emailBody = editor.value;
    const response = await api.post(
      `${process.env.CRM4_LB_04}/send-mails`,
      formEmail.value
    );
    Loading.hide();
    paraa.value = [];
    ccc.value = [];
    ccco.value = [];
    guestsSelectedCC.value = [];
    guestsSelectedCO.value = [];
    
    emits('formSaved');
    open.value = false;

  }

  const openAdvancedSearch = () => {
    addGuestDialog.value = true;
  };

  const openAdvancedSearch2 = () => {
    addGuestDialog2.value = true;
  };

  const openAdvancedSearch3 = () => {
    addGuestDialog3.value = true;
  };

  const gettemplate = async (id: string) => {
    const response = await api.get(
      `${process.env.CRM4_LB_04}/emails_get_templates/${id}`
    );
    templates.value = response.data.data;
  };

  const cambiaTemplate = async (index: number) => {
    link.value = filterReg.value[index].name;
    editor.value = filterReg.value[index].body_html;
    let t1 = filterReg.value[index].body_html.replace('$usuarioLogueado', usuarioLogueado.value);
    editor.value = t1;
  };

  const filterReg = computed(() => {
    return templates.value.filter(
      (objeto) => objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
    );
  })

  defineExpose({
    open,
  });

</script>
<template>
  <dialog-component :size-dialog="seleccionar_plantilla==true || archivo==true  ? 'dialog-lg':'dialog-md'" v-model="open" :footerDisabled="false" :headerDisabled="false"
    :iconDialog="''" :persistent="false">
    <template #header>
      <div class="bg-primary-3 text-black ">
        <q-toolbar class="bg-primary q-pa-lg">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="email" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-white text-h5">Enviar correo</q-item-label>
                <q-item-label class="text-grey-4 text-caption" lines="1">Es rapido y sencillo
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <q-btn dense flat color="white" :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </template>
    <template #body>
      <div class="row q-col-gutter-xs">
        <div :class="seleccionar_plantilla==true || archivo==true ? 'col-12 col-md-8':'col-12 col-md-12'">
          <!-- {{formEmail}} -->
          <div class="q-pa-md">
            <q-card class="col-12 q-pa-md" style="min-height: 82vh">
              <div class="row items-center q-mb-sm ">
                <div class="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-1 column items-center q-mb-sm">De:</div>
                <div class="col-xl-11 col-lg-11 col-md-11 col-sm-12 col-xs-12  q-mb-sm ">
                  <q-avatar color="primary" text-color="white" size="sm">
                    {{usuarioLogueado.charAt(0).toUpperCase()}}
                  </q-avatar>
                  <span class="q-ml-sm">{{usuarioLogueado}} ({{correoUsuarioLoagueado}})</span>
                </div>
              </div>
              <q-separator />
              <q-space />

              <div class="row items-center q-mt-md">
                <div class="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-1 column items-center q-mb-sm">Para:</div>
                <div class="col-xl-11 col-lg-11 col-md-11 col-sm-12 col-xs-12  q-mb-sm ">
                  <q-select dense outlined v-model="guestsSelected" multiple use-input use-chips map-options no-option
                    emit-value class="col-10" :loading="isLoading" option-label="fullname"
                    :option-value="(val:SearchUser) => (val)" input-debounce="400" :options="inputOptions"
                    @focus="isLoading = false" @filter="filterData">
                    <template #after>
                      <q-btn flat color="primary" icon="groups" @click="openAdvancedSearch()" class="col-2" />
                    </template>
                    <template v-slot:selected-item="scope">
                      <q-chip removable dense @remove="scope.removeAtIndex(scope.index)" :tabindex="scope.tabindex"
                        color="primary" text-color="white" class="q-ma-xs" square>
                        <span class="text-caption">{{ scope.opt.fullname || scope.opt.email_address }} ({{
                          scope.opt.email_address }})</span>
                      </q-chip>
                    </template>
                    <template #loading>
                      <div></div>
                    </template>
                    <template #option="slotProps">
                      <q-item clickable v-bind="slotProps.itemProps">
                        <q-item-section center avatar>
                          <q-avatar size="md" color="primary" text-color="blue" icon="person" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ slotProps.opt.fullname }}</q-item-label>
                          <q-item-label caption lines="2">{{ formatModuleName(slotProps.opt.module) }}</q-item-label>
                          <q-item-label caption lines="2">{{ slotProps.opt.email_address }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator inset />
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No se han encontrado resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <div class="row items-center " v-if="cc==true">
                <div class="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-1 column items-center q-mb-sm">CC:</div>
                <div class="col-xl-11 col-lg-11 col-md-11 col-sm-12 col-xs-12  q-mb-sm ">
                  <q-select dense outlined v-model="guestsSelectedCC" multiple use-input use-chips map-options no-option
                    emit-value class="col-10" :loading="isLoading" option-label="fullname"
                    :option-value="(val:SearchUser) => (val)" input-debounce="400" :options="inputOptions"
                    @focus="isLoading = false" @filter="filterData">
                    <template #after>
                      <q-btn flat color="primary" icon="groups" @click="openAdvancedSearch2()" class="col-2" />
                    </template>
                    <template v-slot:selected-item="scope">
                      <q-chip removable dense @remove="scope.removeAtIndex(scope.index)" :tabindex="scope.tabindex"
                        color="primary" text-color="white" class="q-ma-xs" square>
                        <span class="text-caption">{{ scope.opt.fullname || scope.opt.email_address }} ({{
                          scope.opt.email_address }})</span>
                      </q-chip>
                    </template>
                    <template #loading>
                      <div></div>
                    </template>
                    <template #option="slotProps">
                      <q-item clickable v-bind="slotProps.itemProps">
                        <q-item-section center avatar>
                          <q-avatar size="md" color="primary" text-color="blue" icon="person" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ slotProps.opt.fullname }}</q-item-label>
                          <q-item-label caption lines="2">{{ formatModuleName(slotProps.opt.module) }}</q-item-label>
                          <q-item-label caption lines="2">{{ slotProps.opt.email_address }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator inset />
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No se han encontrado resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <div class="row items-center " v-if="cco==true">
                <div class="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-1 column items-center q-mb-sm">CCO:</div>
                <div class="col-xl-11 col-lg-11 col-md-11 col-sm-12 col-xs-12  q-mb-sm ">
                  <q-select dense outlined v-model="guestsSelectedCO" multiple use-input use-chips map-options no-option
                    emit-value class="col-10" :loading="isLoading" option-label="fullname"
                    :option-value="(val:SearchUser) => (val)" input-debounce="400" :options="inputOptions"
                    @focus="isLoading = false" @filter="filterData">
                    <template #after>
                      <q-btn flat color="primary" icon="groups" @click="openAdvancedSearch3()" class="col-2" />
                    </template>
                    <template v-slot:selected-item="scope">
                      <q-chip removable dense @remove="scope.removeAtIndex(scope.index)" :tabindex="scope.tabindex"
                        color="primary" text-color="white" class="q-ma-xs" square>
                        <span class="text-caption">{{ scope.opt.fullname || scope.opt.email_address }} ({{
                          scope.opt.email_address }})</span>
                      </q-chip>
                    </template>
                    <template #loading>
                      <div></div>
                    </template>
                    <template #option="slotProps">
                      <q-item clickable v-bind="slotProps.itemProps">
                        <q-item-section center avatar>
                          <q-avatar size="md" color="primary" text-color="blue" icon="person" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ slotProps.opt.fullname }}</q-item-label>
                          <q-item-label caption lines="2">{{ formatModuleName(slotProps.opt.module) }}</q-item-label>
                          <q-item-label caption lines="2">{{ slotProps.opt.email_address }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator inset />
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No se han encontrado resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <div class="row items-center ">
                <div class="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-1 column items-center q-mb-sm">Asunto:</div>
                <div class="col-xl-11 col-lg-11 col-md-11 col-sm-12 col-xs-12   ">
                  <q-input outlined v-model="asunto" dense />
                </div>
              </div>
              <div class="row justify-end">
                <div>
                  <q-btn flat :class="cc==false ? 'text-grey':'text-blue'" label="CC" @click="cc =! cc" />
                  <q-btn flat :class="cco==false ? 'text-grey':'text-blue'" label="CCO" @click="cco =! cco" />
                </div>
              </div>
              <q-card class="my-card" bordered>
                <q-card-section>
                  <div class="row">
                    <div class="col-12">
                      <!-- <q-btn size="sm" flat :class="archivo==false ? 'text-grey':'text-blue'" icon="attach_file"
                        label="Adjuntar Archivo" @click="clicArchivo" /> -->
                      <q-btn size="sm" flat :class="seleccionar_plantilla==false ? 'text-grey':'text-blue'"
                        icon="description" label="Plantillas" @click="clicPlantilla" />
                    </div>
                  </div>
                  
                </q-card-section>
              </q-card>
              <div class="row items-center ">
                <div v-if="$q.screen.xs ? false : true">
                  <!-- <q-editor v-model="editor" /> -->
                  <q-editor v-model="editor" :dense="$q.screen.lt.md" :toolbar="[
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
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
              'size-7'
            ]
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
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo'],
        ['viewsource']
      ]" :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
        }" />
                </div>
                <div class="col-12" v-else>
                  <q-editor v-model="editor" />
                </div>
              </div>
            </q-card>
            <!-- {{templates}} -->
          </div>
        </div>
        <div class="col-12 col-md-4" v-if="seleccionar_plantilla==true || archivo==true">
          <!-- {{formEmail}} -->
          <div class="q-pa-md">
            <q-card class="col-12 " style="min-height: 82vh">
            <q-card-section>
                  <div class="row" v-if="archivo==true">
                    <div class="col-12">
                      <div class="q-pa-md row items-start q-gutter-md">
                        <q-card class="my-card bg-gre-2">
                          <q-uploader url="http://localhost:4444/upload" label="Adjuntos" multiple v-model="base">
                            <template v-slot:list="scope">
                              <q-list separator>
                                <q-item v-for="file in scope.files" :key="file.__key">
                                  <q-item-section>
                                    <q-item-label class="full-width ellipsis">
                                      {{ file.name }}
                                    </q-item-label>

                                    <q-item-label caption>
                                      Status: {{ file.__status }}
                                    </q-item-label>

                                    <q-item-label caption>
                                      {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                                    </q-item-label>
                                  </q-item-section>

                                  <q-item-section v-if="file.__img" thumbnail class="gt-xs">
                                    <img :src="file.__img.src">
                                  </q-item-section>

                                  <q-item-section top side>
                                    <q-btn class="gt-xs" size="12px" flat dense round icon="delete"
                                      @click="scope.removeFile(file)" />
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </template>
                          </q-uploader>
                        </q-card>
                      </div>
                    </div>
                  </div>
                  <div class="row" v-if="seleccionar_plantilla==true">
                    <div class="col-12">
                      <q-card class="my-card" flat>
                        <div class="row">
                          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <q-input dense v-model="filter" placeholder="Buscar plantilla...">
                              <template v-slot:append>
                                <q-icon name="search" v-if="!filter" />
                                <q-icon name="clear" v-else @click="filter = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                          </div>
                        </div><q-scroll-area  style="height: 76vh;">
                        <q-list dense >                          
                          <template v-for="(templatesEmails,index) in filterReg" :key="index">                          
                              <q-item  class="q-my-sm" clickable
                            :active="link == templatesEmails.name" @click="cambiaTemplate(index)"
                            active-class="my-menu-link">
                            <q-item-section avatar>
                              <q-icon name="wysiwyg" color="primary" />
                            </q-item-section>
                            <q-item-section>                              
                            <q-item-label :class="link == templatesEmails.name ? 'text-white':'text-primary'">{{ templatesEmails.name.replace(/_/g,' ') }}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-separator  inset   />                                                        
                          </template>                       
                        </q-list>
                      </q-scroll-area>
                      </q-card>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            <!-- {{templates}} -->
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <q-btn color="primary" class="q-mr-md" @click="enviarEmail"
        :disable="guestsSelected.length>0 ? false:true">Enviar</q-btn>
      <q-btn color="negative" @click="showCloseDialog">Cancelar</q-btn>
    </template>
  </dialog-component>
  <GuestsDialog v-model="addGuestDialog" v-model:selected="guestsSelected" :tabs-filtered="['contacts','users']"
    detail="Destinatarios" />
  <GuestsDialog v-model="addGuestDialog2" v-model:selected="guestsSelectedCC" :tabs-filtered="['contacts','users']"
    detail="Destinatarios con copia" />
  <GuestsDialog v-model="addGuestDialog3" v-model:selected="guestsSelectedCO" :tabs-filtered="['contacts','users']"
    detail="Destinatarios con copia oculta" />
</template>
<style lang="sass" scope>
.my-menu-link
  color: orange
</style>