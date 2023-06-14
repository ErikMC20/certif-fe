<script setup lang="ts">
import { useAsyncState } from '@vueuse/core';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { axios_GLOBAL, axios_LB_04 } from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import { getListUsers } from 'src/services/AssignedUserService';
import { ref } from 'vue';
import {
  Vue3CommentsComponent,
  Vue3ListCommentsComponent,
} from 'vue3-jd-comments';

const props = defineProps<{
  moduleId: string;
  module: string;
  platform?: string;
  descriptionCrm3?: string;
}>();

const { userCRM } = userStore();

const usersList = ref([]);
const commentsList = ref([]);

const { execute, isReady } = useAsyncState(async () => {
  const users = (await getListUsers(
    userCRM.iddivision,
    userCRM.idamercado
  )) as any;
  const { data } = await axios_GLOBAL.get(
    `/related-comments-get/${props.moduleId}`
  );

  usersList.value = users.map((el: { [key: string]: string }) => {
    return {
      id: el.id,
      email: el.email,
      name: el.user_name,
    };
  });

  commentsList.value = data.comments.map((el: any) => {
    return {
      avatar: `${HANSACRM3_URL}/upload/users/${el.idcreado_por}`,
      comment: el.descripcion,
      created_by: el.creado_por,
      created_by_id: el.idcreado_por,
      created_date: el.fecha_creacion,
      files: [],
      id: el.id,
      likes: [],
      reply_id: '',
      reply: false,
      seconds: el.seconds,
    };
  });
}, undefined);

const addComments = async (data: any) => {
  try {
    console.log(data);
    const dataSend = {
      comment: {
        bean_module: props.module,
        description: data.comment,
        visualizacion_c: 'interno',
        relevance: 'medium',
        bean_id: props.moduleId,
        created_by: userCRM.id,
        assigned_user_id: userCRM.id,
      },
    };

    await axios_GLOBAL.post('/comments-new', dataSend);
    if (data.emails.length > 0) {
      const emails = data.emails.map((el: string) => `&lt;${el}&gt;`);
      await enviarEmail(emails);
    }
  } catch (error) {
  } finally {
    execute();
  }
};

const enviarEmail = async (emails: string[]) => {
  const body = `
      <p>
        El usuario ${userCRM.nombres} ${userCRM.apellidos} <${userCRM.email}> te ha mencionado en un comentario.
      </p>
      <p>
        <br/>
        <span style="font-size:medium;font-family:'arial black', 'avant garde';color:#000080;">
          <strong>HANSA CRM</strong>
        </span>
        <div>  ${userCRM.nombres} ${userCRM.apellidos}</div>
        <span>
          <strong>${userCRM.division}</strong>
        </span>
        <span style="color:#999999;">
          <strong>CONFIDENCIALIDAD</strong><br />
          La información contenida en este mail es confidencial y de propiedad intelectual de HANSA Ltda. Si usted ha recibido este e-mail por error, le pedimos lo informe al remitente y proceda a la destrucción de su contenido.
        </span>
      </p>

    `;

  const formEmail = {
    id_userLoged: userCRM.id,
    id_emailTemplate: '',
    name_module: props.module,
    id_module: props.moduleId,
    emailSubject: 'Mención en comentario',
    emailBody: body,
    altemailBody: '',
    from_email: [`CRM Proyectos DEV &lt;${userCRM.email}&gt;`],
    emailto: emails,
    emailCc: [],
    emailBcc: [],
    attachment: [],
  };
  await axios_LB_04.post('/send-mails', formEmail);
};
</script>
<template>
  <div v-if="isReady">
    <Vue3CommentsComponent :users="usersList" @save-comment="addComments" />
    <Vue3ListCommentsComponent
      :comments="commentsList"
      :avatar-path="`${HANSACRM3_URL}/upload/users/avatardefault.png`"
    />
  </div>
</template>

<style lang="scss">
@import 'vue3-jd-comments/dist/style.css';
</style>
