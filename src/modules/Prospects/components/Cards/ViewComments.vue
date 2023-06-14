<template>
   <div>
    <q-card flat>
      <div class="row">
        <div class="col">
          <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="user.userCRM.iddivision"
            :label="'Div.' +user.userCRM.iddivision" :value="commentslistAux2" />
          <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="todas" label="Todas"
            :value="commentslistAux2" />
        </div>
        <div class="item-end">
          <q-icon color="blue" name="info_outline" size="sm" class="q-mt-sm">
            <q-tooltip class="bg-primary" anchor="center left" self="center right" :offset="[10, 10]">
              Descripción: {{props.descCRM3}}
            </q-tooltip>
          </q-icon>
        </div>
      </div>

      <q-card-section style="max-height: 70vh">
        <q-input autogrow outlined bottom-slots v-model="text" placeholder="Escriba su comentario" :dense="dense"
          v-if="idProspect !== '0'" color="primary">
          <template v-slot:append>
            <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
          </template>
          <template v-slot:before>
            <q-avatar v-if="`${HANSACRM3_URL}/upload/users/${idusuario}` ==  ''">
              <img :src="`${HANSACRM3_URL}/upload/users/${idusuario}`" />
            </q-avatar>
            <q-avatar v-else>
              <q-avatar color="primary" text-color="white" icon="person" />
            </q-avatar>
          </template>
          <template v-slot:after v-if="loadComment === false">
            <q-btn round :flat="!text ? true : false" dense icon="near_me" @keyup.enter="addComments(text)"
              @click="addComments(text)" :color="text ? 'primary' : 'secondary'" :disable="text ? false : true" />
          </template>
          <template v-slot:after v-else>
            <q-circular-progress indeterminate size="sm" color="primary" class="q-ma-md" />
          </template>
        </q-input>
        <q-list>
          <template v-for="(reg, index) in commentslistAux2" :key="index">
            <q-item v-if="$q.screen.xs ? false : true">
              <q-item-section top avatar v-if="`${HANSACRM3_URL}/upload/users/${reg.idcreado_por}` ==  ''">
                <q-avatar>
                  <img :src="`${HANSACRM3_URL}/upload/users/${reg.idcreado_por}`" />
                </q-avatar>

              </q-item-section>
              <q-item-section top avatar v-else>

                <q-avatar color="grey" text-color="white" icon="person" />
              </q-item-section>
              <q-item-section v-if="reg.flag === 'read'">
                <q-item-label caption class="text-grey">{{ reg.creado_por + ' ' }}
                  <span :class="$q.dark.isActive?  'text-white': 'text-primary'">> {{ reg.division}}</span>
                </q-item-label>
                <q-item-label caption class="text-grey-6">{{ reg.fecha_creacion + ' ' }}

                </q-item-label>

                <q-item-label caption :class="$q.dark.isActive?  'text-white': 'text-black'"
                  style="white-space: pre-wrap">

                  <q-icon name="fiber_manual_record" color="blue" /> {{ reg.descripcion }}

                </q-item-label>
              </q-item-section>
              <q-item-section v-else>
                <q-input outlined color="primary" autogrow :dense="dense" v-model="reg.descripcion" />
              </q-item-section>
              <q-item-section side top v-if="reg.flag === 'read'">
                <q-item-label caption>
                  <q-btn flat round :color="$q.dark.isActive?  'orange': 'primary'" size="xs" icon="edit"
                    @click="updateSelected(index, reg.id)" v-if="reg.idcreado_por == idusuario" />
                  <q-btn flat round :color="$q.dark.isActive?  'orange': 'primary'" size="xs" icon="more_vert"
                    v-if="reg.idcreado_por == idusuario">
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item clickable @click="updateSelected(index, reg.id)" v-close-popup>
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="deleteSelected(index, reg.id)">
                          <q-item-section>Eliminar</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-label>
              </q-item-section>
              <q-item-section side top v-else class="q-pd-sm">
                <q-btn size="xs" round :color="$q.dark.isActive?  'orange': 'primary'" icon="done"
                  @click="UpdateComments(reg.descripcion, reg.id)" />
                <q-btn outline size="xs" round :color="$q.dark.isActive?  'orange': 'primary'" icon="close"
                  @click="updateCancel(index, reg.id)" />
              </q-item-section>
            </q-item>
            <q-item v-else>
              <q-item-section v-if="reg.flag === 'read'">
                <q-item-label lines="5" caption class="text-grey">{{ reg.creado_por + ' ' }}
                </q-item-label>
                <q-item-label lines="5" caption class="text-grey">{{ reg.division + ' ' }}
                </q-item-label>
                <q-item-label lines="5" caption>{{ ' ' + reg.fecha_creacion }}
                  <q-btn flat round :color="$q.dark.isActive?  'orange': 'primary'" size="xs" icon="edit"
                    @click="updateSelected(index, reg.id)" v-if="reg.idcreado_por == idusuario" />
                  <q-btn flat round :color="$q.dark.isActive?  'orange': 'primary'" size="xs" icon="more_vert"
                    v-if="reg.idcreado_por == idusuario">
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item clickable @click="updateSelected(index, reg.id)" v-close-popup>
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="deleteSelected(index, reg.id)">
                          <q-item-section>Eliminar</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-label>
                <q-input outlined autogrow :dense="dense" readonly v-model="reg.descripcion" />
              </q-item-section>
              <q-item-section v-else>
                <q-input outlined color="primary" autogrow :dense="dense" v-model="reg.descripcion" />
              </q-item-section>
              <q-item-section side top v-if="reg.flag != 'read'" class="q-pd-sm">
                <q-btn size="xs" round :color="$q.dark.isActive?  'orange': 'primary'" icon="done"
                  @click="UpdateComments(reg.descripcion, reg.id)" />
                <q-btn outline size="xs" round :color="$q.dark.isActive?  'orange': 'primary'" icon="close"
                  @click="updateCancel(index, reg.id)" />
              </q-item-section>
            </q-item>
            <q-separator spaced />
          </template>
        </q-list>
      </q-card-section>
    </q-card>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm">Esta seguro de eliminar el comentario?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Si, estoy seguro" color="primary" @click="deleteComments(idDelete)" v-close-popup />
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <!-- <pre>{{commentslist}}</pre> -->
</template>
<script lang="ts">
  import { ref, onMounted,computed } from 'vue';
  import { AccountStore } from '../../../Accounts/store/AccountStore';
  import { api } from 'src/boot/axios';
  import { userStore } from 'src/modules/Users/store/UserStore';
  import { HANSACRM3_URL } from 'src/conections/api_conectors';
  
  export default {};
</script>
<script lang="ts" setup>
 const user = userStore();
 
  const { getAccountComments } = AccountStore();
  const commentSend = ref({
    comment: {
      bean_module: 'Prospects',
      bean_id: '000786B9-BA41-4810-AD71-0AF6EEF25F11',
      visualizacion_c: 'interno',
      description: '',
      relevance: 'medium',
      created_by: '',
      assigned_user_id: '',
    },
   
  });
  const commentUpdateSend = ref({
    comment: {
      bean_module: 'Prospects',
      bean_id: '000786B9-BA41-4810-AD71-0AF6EEF25F11',
      visualizacion_c: 'interno',
      description: '',
      relevance: 'medium',
      modified_user_id: '',
    },
  });

  const props = defineProps < {
    id: string;
    descCRM3: string;
  } > ();
  const text = ref('');
  const dense = ref(true);
  const loadComment = ref(false);
  const idDelete = ref('');
  const commentslist = ref([] as { [key: string]: string }[]);
  const commentslistAux = ref([] as { [key: string]: string }[]);
  const confirm= ref(false);
  const idProspect = ref(props.id);
  const idusuario = user.userCRM.id;
  const shape = ref(user.userCRM.iddivision);
  onMounted(async () => {
    commentslist.value = await getAccountComments(idProspect.value);
    commentslistAux.value = await getAccountComments(idProspect.value);
  });
  const addComments = async (val: string) => {
    loadComment.value=true;
    
    commentSend.value.comment.description = val;
    commentSend.value.comment.bean_id = idProspect.value;
    commentSend.value.comment.created_by = idusuario;
    commentSend.value.comment.assigned_user_id = idusuario;
    
    text.value = '';
    const response = await api.post(
      `${process.env.CRM4_LB_GLOBAL}/comments-new`,
      commentSend.value
    );
    
    console.log(commentSend.value);
    commentslist.value = await getAccountComments(idProspect.value);
    loadComment.value=false;
    commentslistAux.value = await getAccountComments(idProspect.value);
    
  };
  const updateSelected = (index:number, id:string) => {
    commentslistAux2.value[index].flag='edit';
  };
  const updateCancel = (index:number, id:string) => {
    commentslistAux2.value[index].flag='read';
    commentslist.value[index].descripcion=commentslistAux.value[index].descripcion;
  };
  const UpdateComments = async (val: string,id:string) => {
      commentUpdateSend.value.comment.description = val;
      commentUpdateSend.value.comment.bean_id = idProspect.value;
      commentUpdateSend.value.comment.modified_user_id = idusuario;
      const response = await api.patch(
        `${process.env.CRM4_LB_GLOBAL}/comment-update/${id}`,
        commentUpdateSend.value
      );
      commentslist.value = await getAccountComments(idProspect.value);
      commentslistAux.value = await getAccountComments(idProspect.value);
  };
  const deleteSelected = (index:number, id:string) => {
        confirm.value = true;
        idDelete.value =  id;
  };
  const deleteComments = async (id:string) => {
      const response = await api.delete(
        `${process.env.CRM4_LB_GLOBAL}/comment-delete/${id}/${idusuario}`
      );
      commentslist.value = await getAccountComments(idProspect.value);
      commentslistAux.value = await getAccountComments(idProspect.value);
  };

  const commentslistAux2 = computed(() => {
    if (shape.value == 'todas') {
      return commentslist.value;
    } else {
      return commentslist.value.filter(
        (objeto) =>
          objeto.iddivision.toLowerCase().indexOf(shape.value.toLowerCase()) > -1
      );
    }
  });
</script>