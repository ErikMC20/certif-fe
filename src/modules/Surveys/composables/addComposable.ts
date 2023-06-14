import { api } from 'src/boot/axios';
import { ref } from 'vue';
export const addComposable = () => {
  //** variables */
  // const titulo = ref('');
  // const division = ref('');
  // const modulo = ref('');
  // const a_mercado = ref('');
  // const grupo_cliente = ref('');
  // const descripcion = ref('');
  // const fecha_inicio = ref('');
  // const fecha_fin = ref('');
  // const logo = ref([]);
  // const contador = ref(1);
  // const ur_redireccion = ref('http://');
  // const progreso = ref(false);

  const form = ref({
    titulo: '',
    division: '',
    modulo: '',
    a_mercado: '',
    grupo_cliente: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    logo: [],
    contador: 1,
    ur_redireccion: '',
    progreso: false,
  });
  const getForm = async () => {
    const { data } = await api.get(
      '/src/modules/Surveys/composables/API_form.json'
    );
    return data.group_a;
  };

  const encuesta = ref({
    pagina_bienvenida: false,
    contenido_bienvenida:
      '<div class="bg-primary text-white font-arial q-pa-md" style="height:60vh;"> <div style="editable:none"> <h1 class="q-ma-none text-bold" style="border-bottom: 1px solid #efefef">HANSA</h1> </div> <div style="min-height:40vh;" class="q-pa-md"> <div> <p>Editar aqui...</p> </div> </div> <div style="border-top: 1px solid #efefef"></div>hola mundo</div>',
    pagina_gracias: false,
    contenido_gracias:
      '<div class="bg-primary text-white font-arial q-pa-md" style="height:60vh;"> <div style="editable:none"> <h1 class="q-ma-none text-bold" style="border-bottom: 1px solid #efefef">HANSA</h1> </div> <div style="min-height:40vh;" class="q-pa-md"> <div> <p>Editar aqui...</p> </div> </div> <div style="border-top: 1px solid #efefef"></div>hola mundo</div>',
  });

  return {
    getForm,
    form,
    encuesta,
  };
};
