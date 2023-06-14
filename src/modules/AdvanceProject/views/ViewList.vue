<script setup lang="ts">
import { TableSkeleton } from 'src/components';
import { useAssignmentTableStore } from '../store/useAssignmentTableStore';
import AssignmentDialog from '../components/Dialogs/AdvanceProjectDialog.vue';

const props = defineProps<{
  moduleId: string;
}>();

const aTable = useAssignmentTableStore();

const { getListProjects, setPagination } = useAssignmentTableStore();

const assignmentDialogRef = ref<InstanceType<typeof AssignmentDialog> | null>(
  null
);
const isReady = ref(true);

const openDialog = () => {
  assignmentDialogRef.value?.openDialog();
  // projectDialogRef.value?.openDialogProject(undefined, title);
};

const openItemSelected = (id?: string) => {
  assignmentDialogRef.value?.openDialog();
  // projectDialogRef.value?.openDialogProject(id);
};

const onRequestTable = async (val: { pagination: any; filter: any }) => {
  await setPagination(val.pagination);
  await getListProjects(val);
};
</script>
<template>
  <div></div>
</template>

<style scoped></style>
