import { defineStore } from 'pinia';

import { Loading } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
import { computed, ref } from 'vue';
import { createCompany, getOneCompany, updateCompany } from '../services/useCompanyService';
import { Company } from '../utils/types';

const { userCRM } = userStore();

export const useCompaniesStore = defineStore('companies-store',()=> {
    //states
    const loading = ref(false);
    const payload = ref({
      id: '',
      name: '',
      razon_social_c:'',
      direccion_c: '',
      email1:'',
      resolucion_ministerial_c:'',
      identificacion_fiscal_c:'',
      phone_office:'',
      phone_alternate:'',
      website: '',
      ownership:'',
      user_id_c:userCRM.id,
    })

    //getters
    const cardInfo = computed(()=> {
      return {
        name: payload.value.name,
        razon_social_c : payload.value.razon_social_c,
        resolucion_ministerial_c: payload.value.resolucion_ministerial_c,
        identificacion_fiscal_c: payload.value.identificacion_fiscal_c,
        user_id_c: payload.value.user_id_c
      }
    })

    const cardContact = computed(()=> {
      return {
        website: payload.value.website,
        email1: payload.value.email1,
        phone_office: payload.value.phone_office,
        phone_alternate: payload.value.phone_alternate,
      }
    })

    //actions
    const onCreateCompany = async(dataCompany: Company, dataDocuments:any[]) => {
      console.log('create');
      try {
        Loading.show({
          message:'Guardando informacion'
        });
        const response = await createCompany(
          dataCompany
        );
        return response;
      } catch (error) {
        console.log(error);
        throw new Error('No se puede guardar el tipo de producto');
      } finally {
        Loading.hide();
      }
    }

    const onUpdateCompany = async(id:string , data:any) => {
      try {
        Loading.show({
          message:'Modificando informacion'
        });
        console.log(id);
        console.log(data);
        
        const response = await updateCompany(id,
          data
        );
        return response;
      } catch (error) {
        console.log(error);
        throw new Error('No se puede guardar el tipo de producto');
      } finally {
        Loading.hide();
      }
    }


    const onGetCompany = async(id:string) => {
      console.log('get');
      try {
        loading.value = true
        const response = await getOneCompany(id);
        payload.value = response;
        console.log(response)
        return response;
      } catch (error) {
        console.log(error);
        throw new Error('No se puede guardar el tipo de producto');
      } finally {
        loading.value = false
      }
    }

    const clearData = () => {
      payload.value = {
        id: '',
        name: '',
        razon_social_c:'',
        direccion_c: '',
        email1:'',
        resolucion_ministerial_c:'',
        identificacion_fiscal_c:'',
        phone_office:'',
        phone_alternate:'',
        website: '',
        ownership:'',
        user_id_c:userCRM.id,
        }
    }

    return {
      //states
      payload,
      //getter
      cardInfo,
      cardContact,
      //actions
      onCreateCompany,
      onUpdateCompany,
      onGetCompany,
      clearData
    }


});


