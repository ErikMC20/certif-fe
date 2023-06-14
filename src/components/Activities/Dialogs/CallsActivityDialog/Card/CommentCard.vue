<script lang="ts" setup>
import { ref } from 'vue';
// import moment from 'moment';
// import { useActivityStore } from 'src/stores/ActivityStore';
import CommentsList from '../../../../Comments/CommentsList.vue';

// const props = defineProps<{
//   id: string;
// }>();

// const id = ref(props.id);
const data = ref({
  usercreador: '',
  comentario: '',
});

// const usuarios = [
//   {
//     label: 'Alberto Quispe',
//     value: 'Alberto Quispe',
//   },
//   {
//     label: 'Berto Villa',
//     value: 'Berto Villa',
//   },
// ];
const CommentsListRef = ref<InstanceType<typeof CommentsList> | null>(null);

const exposeData = () => {
  return data.value;
};
defineExpose({
  exposeData,
});
</script>
<template>
  <q-card class="my-card">
    <q-card-section class="">
      <q-icon name="question_answer" size="sm" color="primary" />
      <span> Comentarios </span>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <div>
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <!-- <q-input
              v-model="data.comentario"
              type="textarea"
              label="Comentario"
              outlined
              color="primary"
              dense
            >
              <template #before>
                <q-icon name="question_answer" />
              </template>
            </q-input> -->
            <CommentsList
              ref="CommentsListRef"
              module="Leads"
              id=""
              name_module=""
            ></CommentsList>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped></style>
