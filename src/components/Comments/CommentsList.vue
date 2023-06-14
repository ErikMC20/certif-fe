<script lang="ts">
import { axios_GLOBAL } from 'src/conections/axiosCRM';
import { HANSACRM3_URL } from '../../conections/api_conectors';
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { useCommentsStore } from '../../stores/useCommentsStore';
import { userStore } from '../../modules/Users/store/UserStore';

export default {};
</script>
<script lang="ts" setup>
const user = userStore();

const { getBeanComments } = useCommentsStore();
const commentSend = ref({
  comment: {
    bean_module: '',
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
    bean_module: '',
    bean_id: '000786B9-BA41-4810-AD71-0AF6EEF25F11',
    visualizacion_c: 'interno',
    description: '',
    relevance: 'medium',
    modified_user_id: '',
  },
});

const props = defineProps<{
  id: string;
  descCRM3: string;
  modulo: string;
}>();
const text = ref('');
const dense = ref(true);
const loadComment = ref(false);
const idDelete = ref('');
const commentslist = ref([] as { [key: string]: string }[]);
const commentslistAux = ref([] as { [key: string]: string }[]);
const confirm = ref(false);
const idReg = ref(props.id);
const nameModule = ref(props.modulo);
const idusuario = user.userCRM.id;
//const shape = ref(user.userCRM.iddivision);

const { execute } = useAsyncState(async () => {
  const data = await getBeanComments(idReg.value);
  commentslist.value = data;
  commentslistAux.value = data;
}, undefined);

const addComments = async (val: string) => {
  loadComment.value = true;

  commentSend.value.comment.bean_module = nameModule.value;
  commentSend.value.comment.description = val;
  commentSend.value.comment.bean_id = idReg.value;
  commentSend.value.comment.created_by = idusuario;
  commentSend.value.comment.assigned_user_id = idusuario;

  text.value = '';
  await axios_GLOBAL.post('/comments-new', commentSend.value);

  execute();
  loadComment.value = false;
};

const updateSelected = (index: number, id: string) => {
  commentslistAux.value[index].flag = 'edit';
};

const updateCancel = (index: number, id: string) => {
  commentslistAux.value[index].flag = 'read';
  commentslist.value[index].descripcion =
    commentslistAux.value[index].descripcion;
};

const UpdateComments = async (val: string, id: string) => {
  commentUpdateSend.value.comment.bean_module = nameModule.value;
  commentUpdateSend.value.comment.description = val;
  commentUpdateSend.value.comment.bean_id = idReg.value;
  commentUpdateSend.value.comment.modified_user_id = idusuario;
  await axios_GLOBAL.patch(`/comment-update/${id}`, commentUpdateSend.value);
  execute();
};

const deleteSelected = (index: number, id: string) => {
  confirm.value = true;
  idDelete.value = id;
};
const deleteComments = async (id: string) => {
  await axios_GLOBAL.delete(`/comment-delete/${id}/${idusuario}`);
  execute();
};

// const convertData = (date: string) => {
//   moment.locale('es');
//   return moment(date, 'DD/MM/YYYY 00:00:00').fromNow();
// };

// const commentslistAux2 = computed(() => {
//   if (shape.value == 'todas') {
//     return commentslist.value;
//   } else {
//     return commentslist.value.filter(
//       (objeto) =>
//         objeto.iddivision.toLowerCase().indexOf(shape.value.toLowerCase()) > -1
//     );
//   }
// });
</script>
<template>
  <div>
    <q-card flat>
      <q-card-section style="max-height: 60vh">
        <q-input
          autogrow
          outlined
          bottom-slots
          v-model="text"
          placeholder="Escriba su comentario"
          :dense="dense"
          v-if="idReg !== '0'"
          color="primary"
        >
          <template v-slot:append>
            <q-icon
              v-if="text !== ''"
              name="close"
              @click="text = ''"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:before>
            <q-avatar v-if="`${HANSACRM3_URL}/upload/users/${idusuario}` == ''">
              <img :src="`${HANSACRM3_URL}/upload/users/${idusuario}`" />
            </q-avatar>
            <q-avatar v-else>
              <q-avatar color="primary" text-color="white" icon="person" />
            </q-avatar>
          </template>
          <template v-slot:after v-if="loadComment === false">
            <q-btn
              round
              :flat="!text ? true : false"
              dense
              icon="near_me"
              @keyup.enter="addComments(text)"
              @click="addComments(text)"
              :color="text ? 'primary' : 'secondary'"
              :disable="text ? false : true"
            />
          </template>
          <template v-slot:after v-else>
            <q-circular-progress
              indeterminate
              size="sm"
              color="primary"
              class="q-ma-md"
            />
          </template>
        </q-input>
        <q-list>
          <template v-for="(reg, index) in commentslist" :key="index">
            <q-item v-if="$q.screen.xs ? false : true">
              <q-item-section
                top
                avatar
                v-if="`${HANSACRM3_URL}/upload/users/${reg.idcreado_por}` == ''"
              >
                <q-avatar>
                  <img
                    :src="`${HANSACRM3_URL}/upload/users/${reg.idcreado_por}`"
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section top avatar v-else>
                <q-avatar color="grey" text-color="white" icon="person" />
              </q-item-section>
              <q-item-section v-if="reg.flag === 'read'">
                <q-item-label caption class="text-grey-9"
                  >{{ reg.creado_por + ' ' }}
                  <span
                    :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
                    >> {{ reg.division }}</span
                  >
                </q-item-label>
                <q-item-label caption class="text-grey-6"
                  >{{ reg.fecha_creacion }}
                  <!-- {{ reg.fecha_creacion }} -->
                </q-item-label>

                <q-item-label
                  caption
                  :class="$q.dark.isActive ? 'text-white' : 'text-black'"
                  style="white-space: pre-wrap"
                >
                  <q-icon name="fiber_manual_record" color="blue" />
                  {{ reg.descripcion }}
                </q-item-label>
              </q-item-section>
              <q-item-section v-else>
                <q-input
                  outlined
                  color="primary"
                  autogrow
                  :dense="dense"
                  v-model="reg.descripcion"
                />
              </q-item-section>
              <q-item-section side top v-if="reg.flag === 'read'">
                <q-item-label caption>
                  <q-btn
                    flat
                    round
                    :color="$q.dark.isActive ? 'orange' : 'primary'"
                    size="xs"
                    icon="edit"
                    @click="updateSelected(index, reg.id)"
                    v-if="reg.idcreado_por == idusuario"
                  />
                  <q-btn
                    flat
                    round
                    :color="$q.dark.isActive ? 'orange' : 'primary'"
                    size="xs"
                    icon="more_vert"
                    v-if="reg.idcreado_por == idusuario"
                  >
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item
                          clickable
                          @click="updateSelected(index, reg.id)"
                          v-close-popup
                        >
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click="deleteSelected(index, reg.id)"
                        >
                          <q-item-section>Eliminar</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-label>
              </q-item-section>
              <q-item-section side top v-else class="q-pd-sm">
                <q-btn
                  size="xs"
                  round
                  :color="$q.dark.isActive ? 'orange' : 'primary'"
                  icon="done"
                  @click="UpdateComments(reg.descripcion, reg.id)"
                />
                <q-btn
                  outline
                  size="xs"
                  round
                  :color="$q.dark.isActive ? 'orange' : 'primary'"
                  icon="close"
                  @click="updateCancel(index, reg.id)"
                />
              </q-item-section>
            </q-item>
            <q-item v-else>
              <q-item-section v-if="reg.flag === 'read'">
                <q-item-label lines="5" caption class="text-grey"
                  >{{ reg.creado_por + ' ' }}
                </q-item-label>
                <q-item-label lines="5" caption class="text-grey"
                  >{{ reg.division + ' ' }}
                </q-item-label>
                <q-item-label lines="5" caption
                  >{{ ' ' + reg.fecha_creacion }}
                  <q-btn
                    flat
                    round
                    :color="$q.dark.isActive ? 'orange' : 'primary'"
                    size="xs"
                    icon="edit"
                    @click="updateSelected(index, reg.id)"
                    v-if="reg.idcreado_por == idusuario"
                  />
                  <q-btn
                    flat
                    round
                    :color="$q.dark.isActive ? 'orange' : 'primary'"
                    size="xs"
                    icon="more_vert"
                    v-if="reg.idcreado_por == idusuario"
                  >
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item
                          clickable
                          @click="updateSelected(index, reg.id)"
                          v-close-popup
                        >
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click="deleteSelected(index, reg.id)"
                        >
                          <q-item-section>Eliminar</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-label>
                <q-input
                  outlined
                  autogrow
                  :dense="dense"
                  readonly
                  v-model="reg.descripcion"
                />
              </q-item-section>
              <q-item-section v-else>
                <q-input
                  outlined
                  color="primary"
                  autogrow
                  :dense="dense"
                  v-model="reg.descripcion"
                />
              </q-item-section>
              <q-item-section
                side
                top
                v-if="reg.flag != 'read'"
                class="q-pd-sm"
              >
                <q-btn
                  size="xs"
                  round
                  :color="$q.dark.isActive ? 'orange' : 'primary'"
                  icon="done"
                  @click="UpdateComments(reg.descripcion, reg.id)"
                />
                <q-btn
                  outline
                  size="xs"
                  round
                  :color="$q.dark.isActive ? 'orange' : 'primary'"
                  icon="close"
                  @click="updateCancel(index, reg.id)"
                />
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
          <q-btn
            label="Si, estoy seguro"
            color="primary"
            @click="deleteComments(idDelete)"
            v-close-popup
          />
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <!-- <pre>{{commentslist}}</pre> -->
</template>
