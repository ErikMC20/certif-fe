import { CRM4_LB_01, HANSACRM3_URL } from 'src/conections/api_conectors';
import { Loading, Notify } from 'quasar';
import { api } from 'src/boot/axios';

export default {
  async createContact(body: object) {
    try {
      Loading.show();
      const response = await api.post(`${CRM4_LB_01}/contact-new/`, body);
      Notify.create({
        type: 'positive',
        message: 'Creacion de Contacto',
        caption: 'Se ha creado un nuevo contacto',
      });
      return response.data.resp;
    } catch (error) {
      if (error instanceof Error) {
        Notify.create({
          type: 'negative',
          message: 'Ha ocurrido un error al crear el dato.',
          caption: `${error.message}`,
        });
      }
    } finally {
      Loading.hide();
    }
  },
  async readContact(id: string) {
    const response = await api.get(`${CRM4_LB_01}/contact-get-all/${id}`);
    console.log(response);
    return response.data.resp;
  },
  readImageUser(idUsuario: string) {
    return `${HANSACRM3_URL}/upload/users/${idUsuario}`;
  },
  async updateContact(id: string, body: object) {
    try {
      Loading.show();
      console.log(body);
      await api.patch(`${CRM4_LB_01}/contact-update/${id}`, body);
      const response = await api.get(`${CRM4_LB_01}/contact-get-all/${id}`);
      Notify.create({
        type: 'positive',
        message: 'Se ha actualizado el contacto correctamente',
      });
      return response.data.resp;
    } catch (error) {
      if (error instanceof Error) {
        Notify.create({
          type: 'negative',
          message: 'Ha ocurrido un error al crear el dato.',
          caption: `${error.message}`,
        });
      }
    } finally {
      Loading.hide();
    }
  },
  deleteContact(id: string) {
    console.log('deleting', id);
  },
};
