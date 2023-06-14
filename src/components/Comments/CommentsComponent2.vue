<script lang="ts">
import { ref, computed } from 'vue';
import { QEditor } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import humanize from 'humanize-duration';

import { Notification, setDefaultAvatar } from 'src/composables';
import { AssignedUserModel } from '../types';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import { getListUsers } from '../../services/AssignedUserService';
import { axios_GLOBAL, axios_LB_04 } from 'src/conections/axiosCRM';
</script>
<script setup lang="ts">
interface Comment {
  creado_por: string;
  descripcion: string;
  fecha_creacion: string;
  flag: string;
  id: string;
  idcreado_por: string;
  seconds: number;
}

const humanizeFormat = humanize.humanizer({
  largest: 2,
  language: 'shortEn',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'dias',
      h: () => 'hr',
      m: () => 'min',
      s: () => 's',
      ms: () => 'ms',
    },
  },
});

const props = defineProps<{
  moduleId: string;
  module: string;
  platform?: string;
  descriptionCrm3?: string;
}>();

const user = userStore();
const crm3 = HANSACRM3_URL;

//vars
const comment = ref<string>('');
const search = ref<string>('');
const showPopup = ref(false);
const commentsList = ref<Comment[]>([]);
const commentMentions = ref<string[]>([]);
const usersList = ref<AssignedUserModel[]>([]);

//refs
const editorRef = ref();
const inputSearchRef = ref();

const { execute } = useAsyncState(async () => {
  const { data } = await axios_GLOBAL.get(
    `/related-comments-get/${props.moduleId}`
  );
  usersList.value = await getListUsers(
    user.userCRM.iddivision,
    user.userCRM.idamercado
  );
  commentsList.value = data.comments;
}, undefined);

const addComments = async () => {
  try {
    const dataSend = {
      comment: {
        bean_module: props.module,
        description: comment.value,
        visualizacion_c: 'interno',
        relevance: 'medium',
        bean_id: props.moduleId,
        created_by: user.userCRM.id,
        assigned_user_id: user.userCRM.id,
      },
    };

    await axios_GLOBAL.post('/comments-new', dataSend);
    await enviarEmail();
  } catch (error) {
  } finally {
    comment.value = '';
    execute();
  }
};

const enviarEmail = async () => {
  const body = `<p></p>
      <p>El usuario ${user.userCRM.nombres} ${user.userCRM.apellidos} <${user.userCRM.email}>, te ha mencionado en un comentario.  </p>
      <p>
        <br/>
        <span style="font-size:medium;font-family:'arial black', 'avant garde';color:#000080;">
          <strong>HANSA CRM</strong>
        </span>
        <div>  ${user.userCRM.nombres} ${user.userCRM.apellidos}</div>
        <span>
          <strong>${user.userCRM.division}</strong>
        </span>
        <span style="color:#999999;">
          <strong>CONFIDENCIALIDAD</strong><br />
          La información contenida en este mail es confidencial y de propiedad intelectual de HANSA Ltda. Si usted ha recibido este e-mail por error, le pedimos lo informe al remitente y proceda a la destrucción de su contenido.
        </span>
      </p>
    `;

  const formEmail = {
    id_userLoged: user.userCRM.id,
    id_emailTemplate: '',
    name_module: props.module,
    id_module: props.moduleId,
    emailSubject: 'Mención en comentario',
    emailBody: body,
    altemailBody: '',
    from_email: [`CRM Proyectos DEV &lt;${user.userCRM.email}&gt;`],
    emailto: ['fabio &lt;jrafael@hansa.com.bo&gt;'],
    emailCc: [],
    emailBcc: [],
    attachment: [],
  };
  await axios_LB_04.post('/send-mails', formEmail);
};

const newMention = (username: string, email?: string) => {
  search.value = '';
  showPopup.value = false;

  if (!!!email) {
    Notification(
      'negative',
      'warning',
      `<small>El usuario <strong>${username}</strong> no tiene correo.</small>`
    );
    return;
  }
  //agregar comentario
  commentMentions.value.push(`${username} &lt;${email}&gt;`);

  editorRef.value.caret.restore();

  //showPopup.value = false;
  console.log(editorRef.value, commentMentions.value);
  editorRef.value?.focus();

  editorRef.value?.runCmd(
    'insertHTML',
    ` <span class="editor_token row inline items-center" contenteditable="false"> <span>${
      '@' + username.toLowerCase()
    }</span></span>&nbsp;`
  );
};

const checkKeys = (value: string) => {
  //  console.log(editorRef.value);
  if (value.charAt(value.length - 1) == '@') {
    editorRef.value?.focus();
    showPopup.value = true;
  }
};

//computed props
const userListComputed = computed(() => {
  if (search.value.length < 3) return;
  return usersList.value.filter(
    (el) =>
      el.email?.toLowerCase().indexOf(search.value.toLowerCase()) > -1 ||
      el.user_name?.toLowerCase().indexOf(search.value.toLowerCase()) > -1
  );
});

const newList = computed(() => {
  const list = commentsList.value.map((el: Comment) => {
    return {
      ...el,
      newdate: humanizeFormat(el.seconds * 1000),
    };
  });
  return list;
});
</script>

<template>
  <div>
    <q-editor
      key="1"
      v-model="comment"
      @update:model-value="checkKeys"
      ref="editorRef"
      :toolbar="[['bold', 'italic', 'underline'], ['token']]"
      min-height="4rem"
      placeholder="Escribe tu comentario"
      class="custom-editor q-mb-md"
    >
      <template #token>
        <div class="flex items-center">
          <q-btn
            color="primary"
            icon="info"
            dense
            flat
            v-if="descriptionCrm3 != ''"
          >
            <q-tooltip>
              {{ descriptionCrm3 }}
            </q-tooltip>
          </q-btn>
          <q-btn
            color="blue-9"
            icon="alternate_email"
            dense
            flat
            round
            size="sm"
          >
            <q-tooltip>Menciones</q-tooltip>
            <q-popup-proxy style="width: 250px" v-model="showPopup">
              <div class="q-pa-sm">
                <q-input
                  ref="inputSearchRef"
                  v-model="search"
                  type="text"
                  placeholder="Buscar usuario"
                  dense
                  class="q-mb-sm"
                >
                  <template #prepend>
                    <q-icon name="search" size="xs" v-if="search == ''" />
                    <q-icon
                      name="close"
                      size="xs"
                      class="cursor-pointer"
                      @click="() => (search = '')"
                      v-else
                    />
                  </template>
                </q-input>

                <q-list dense>
                  <q-item
                    clickable
                    v-ripple
                    v-for="item in userListComputed"
                    :key="item.id"
                    dense
                    @click="newMention(item.user_name, item.email)"
                    @keypress.enter="newMention(item.user_name, item.email)"
                  >
                    <q-item-section side>
                      <q-avatar size="25px">
                        <img
                          :src="`${crm3}${item.avatar}`"
                          @error="setDefaultAvatar"
                        />
                        <q-icon
                          name="circle"
                          color="red"
                          size="10px"
                          style="position: absolute; bottom: 0; right: -3px"
                          v-if="
                            item.employee_status == 'Terminated' ||
                            item.employee_status == 'ContractEnd' ||
                            item.employee_status == 'Volunted'
                          "
                        />
                        <q-icon
                          name="circle"
                          color="secondary"
                          size="10px"
                          style="position: absolute; bottom: 0; right: -3px"
                          v-if="item.employee_status == 'Vacation'"
                        />
                        <q-icon
                          name="circle"
                          color="green"
                          size="10px"
                          style="position: absolute; bottom: 0; right: -3px"
                          v-if="item.employee_status == 'Active'"
                        />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <small> {{ item.user_name }} {{ item.email }} </small>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-popup-proxy>
          </q-btn>

          <q-btn
            color="blue-9"
            icon="send"
            label="Enviar"
            dense
            size="sm"
            rounded
            class="q-px-sm"
            :disabled="comment == ''"
            @click="addComments"
          />
        </div>
      </template>
    </q-editor>

    <q-virtual-scroll
      style="max-height: 500px"
      :items="newList"
      v-slot="{ item, index }"
    >
      <q-item :key="index" class="q-px-sm q-py-md">
        <q-item-section avatar top style="padding: 0px; min-width: 40px">
          <q-avatar size="30px" class="shadow-1 q-mt-xs">
            <img
              :src="`${HANSACRM3_URL}/upload/users/${item.idcreado_por}`"
              @error="setDefaultAvatar"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-caption q-py-xs q-mb-xs">
            <span class="text-bold">
              {{ item.creado_por }}
            </span>

            <span class="text-grey-6"
              >&nbsp; • hace
              {{ item.newdate }}
            </span>
          </q-item-label>
          <q-item-label lines="10" class="q-pt-md caja">
            <span v-html="item.descripcion"></span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-virtual-scroll>
  </div>
</template>

<style lang="scss">
.custom-editor.q-editor {
  display: flex !important;
  border-radius: 10px;
  flex-direction: column !important;
  :focus {
    // border: 1px solid #2caded;
    border-radius: 10px 10px 0px 0px;
    transition: 0.2s box-shadow;
    box-shadow: 0 0 5px 2px #07acff4f;
  }
  .q-editor__toolbars-container {
    order: 1 !important;
    .q-editor__toolbar.row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.editor_token {
  background: #7aafd836;
  color: #4e90bd;
  padding: 3px 3px 3px 3px;
  border-radius: 20px;
}

.caja {
  border: 1.4px solid #cccccc8f;
  padding: 1em;
  font-size: 0.9em;
  border-radius: 6px;
  color: #5f5f5f;
}
.red {
  box-shadow: 0 0 2px 2px #07acff4f;
}
</style>
