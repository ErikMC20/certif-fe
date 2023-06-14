import { ref, onMounted } from 'vue';
const emits = defineEmits(['submitForm']);
const props = defineProps({
  templateData: {
    type: Object,
    default: () => ({
      id: 0,
      description: '',
      division: '',
      documents: [],
      module: '',
      name: '',
      subject: '',
      surveys: [],
      variables: '',
      type: '',
      createdBy: '',
      userAssigned: '',
      created: '',
      editor: `<div style="text-align: center; background-color: #003c9c; color: white; height: 200px;">
&nbsp; &nbsp; <font size="7"><b>Hello Hansa</b>!
</font></div>`,
    }),
  },
  optionDivisions: {
    type: Array,
    default: () => [],
  },
  optionsSurvey: {
    type: Array,
    default: () => [],
  },
  optionsModule: {
    type: Array,
    default: () => [],
  },
  optionsType: {
    type: Array,
    default: () => [],
  },
});

const currentTemplateData = ref(props.templateData);

onMounted(() => {
  currentTemplateData.value = props.templateData;
});

const submitting = () => {
  emits('submitForm', currentTemplateData);
};

const test = () => {
  console.log('Hello component');
};
