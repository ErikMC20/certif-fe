import { CreationBodyProspect, ProspectInfoModel } from '../../utils/types';
import { ProspectService } from '../../services/ProspectsService';
import {
  PhoneModel,
  DirectionComponentModel,
} from '../../../../components/types/index';
import {
  LegacyPhoneModel,
  AccountDataDraft,
} from '../../../Accounts/utils/types/index';
import { EmailModel } from '../../../../components/types/index';
import {
  ContactGeneralModel,
  DetailContactModel,
} from 'src/modules/Contacts/utils/types/index';
import {
  DirectionContactModel,
  CommentContactModel,
} from '../../../Contacts/utils/types/index';
import {
  AccountModel,
  DetailAccountModel,
} from '../../../Accounts/utils/types/index';
import { userStore } from 'src/modules/Users/store/UserStore';
import { axios_LB_05 } from 'src/conections/axiosCRM';

const { userCRM } = userStore();

const { readProspect } = ProspectService();
export function useProspect() {
  const createFormDraft = (data: CreationBodyProspect): ProspectInfoModel => {
    return {
      infoData: {
        salutation: data?.attributes.salutation,
        first_name: data?.attributes.first_name,
        last_name: data?.attributes.last_name,
        title: data?.attributes.title,
        ci_c: data?.attributes.ci_c,
        primary_address_country: data?.attributes.primary_address_country,
        primary_address_state_list_c:
          data?.attributes.primary_address_state_list_c,
        primary_address_city: data?.attributes.primary_address_city,
        description: data?.attributes.description,
        assigned_user_id: data?.attributes.assigned_user_id,
        status: data?.attributes.status,
        created_by_name: data?.attributes.created_by_name,
        modified_by_name: data?.attributes.modified_by_name,
        //date_entered: data?.data.attributes.date_entered,
        date_modified: data?.attributes.date_modified,
        lead_source: data?.attributes.lead_source || '',
      },
      mainPhone: {
        code: data?.attributes.phone_mobile_cd_c || '',
        phone: data?.attributes.phone_mobile || '',
        whatsapp: data?.attributes.phone_mobile_wp_c || '',
      },
      officePhone: {
        code: data?.attributes.phone_work_cd_c || '',
        phone: data?.attributes.phone_work || '',
        whatsapp: data?.attributes.phone_work_wp_c || '',
      },
      emails: data?.attributes_emails.items || [],
      phones: data?.attributes_phones.items || [],
      directionData: {
        address_street_generated_c:
          data?.attributes.address_street_generated_c || '',
        latitude: data?.attributes.jjwg_maps_lat_c || 0,
        longitude: data?.attributes.jjwg_maps_lng_c || 0,
      },
      assignedUser: data?.attributes.assigned_user_id,
      comment: data?.attributes_comment.description,
    };
  };
  const convertToContactFormat = async (
    id: string
  ): Promise<ContactGeneralModel> => {
    const response = await readProspect(id);
    const detailContact: DetailContactModel = {
      assigned_user_id: response.data.attributes.assigned_user_id,
      first_name: response.data.attributes.first_name,
      last_name: response.data.attributes.last_name,
      ci_c: '',
      alt_address_state_list_c:
        response.data.attributes.alt_address_state_list_c,
      alt_address_state: response.data.attributes.alt_address_state,
      primary_address_country: response.data.attributes.primary_address_country,
      primary_address_city: response.data.attributes.primary_address_city,
      estado_civil_c: '',
      genero_c: '',
      industry_c: 'N0',
      principal_c: 0,
      primary_address_state_list_c:
        response.data.attributes.primary_address_state_list_c,
      subindustry_c: 'N0_N05',
    };
    const directionContact: DirectionContactModel = {
      address_street_generated_c:
        response.data.attributes.address_street_generated_c,
      jjwg_maps_lat_c: response.data.attributes.jjwg_maps_lat_c,
      jjwg_maps_lng_c: response.data.attributes.jjwg_maps_lng_c,
      jjwg_maps_address_c: response.data.attributes.jjwg_maps_address_c,
    };
    const contactEmails: EmailModel[] = response.data_emails.attributes_emails;
    const contactPhones: PhoneModel[] = response.data_phones.attributes_phones;
    const comments: CommentContactModel = {
      module: 'Contacts',
      description: response.data.attributes.description,
      relevance: '',
      visualizacion_c: 'interno',
      modulecoments: 'HANPC_Comentarios',
      id_user: userCRM.id,
    };

    return {
      info_contact: {
        detail_contact: detailContact,
        direction_contact: directionContact,
      },
      phone_email_contact: {
        emails: contactEmails,
        phones: contactPhones,
      },
      comments: comments,
    };
  };
  const convertToAccountFormat = async (
    id: string,
    accountType: AccountModel
  ): Promise<AccountDataDraft> => {
    const response = await readProspect(id);
    const accountTypeLocal: AccountModel = accountType;
    const infoDataLocal: DetailAccountModel = {
      account_type: 'Customer',
      names_c: response.data.attributes.first_name,
      lastname_c: response.data.attributes.last_name,
      billing_address_city:
        response?.data.attributes.primary_address_city || '',
      billing_address_country:
        response?.data.attributes.primary_address_country || '',
      billing_address_state:
        response?.data.attributes.primary_address_state || '',
      billing_address_state_list_c:
        response?.data.attributes.primary_address_state_list_c || '',
      shipping_address_state:
        response?.data.attributes.primary_address_state || '',
      shipping_address_state_list_c:
        response?.data.attributes.primary_address_state_list_c || '',
      industry: 'N0',
      name: response?.data.attributes.name || '',
      tipo_documento_c: accountTypeLocal === 'Empresa' ? '03' : '01',
      nit_ci_c: '',
      regimen_tributario_c: '01',
      subindustry_c: 'N0_N05',
      tipocuenta_c: accountTypeLocal,
    };
    const mainPhone: LegacyPhoneModel = {
      code: response?.data.attributes.phone_mobile_cd_c || '+591',
      phone: response?.data.attributes.phone_mobile || '',
      whatsapp: response?.data.attributes.phone_mobile_wp_c || '',
    };
    const officePhone: LegacyPhoneModel = {
      code: response?.data.attributes.phone_work_cd_c || '+591',
      phone: response?.data.attributes.phone_work || '',
      whatsapp: response?.data.attributes.phone_work_wp_c || '0',
    };
    const phonesModel: PhoneModel[] =
      response?.data_phones.attributes_phones.map((phone) => ({
        inherited: true,
        ...phone,
      })) || [];
    const emailsModel: EmailModel[] =
      response?.data_emails.attributes_emails.map((email) => ({
        inherited: true,
        ...email,
      })) || [];

    const direction: DirectionComponentModel = {
      address_street_generated_c:
        response?.data.attributes.address_street_generated_c || '',
      latitude: response?.data.attributes.jjwg_maps_lat_c || 0,
      longitude: response?.data.attributes.jjwg_maps_lng_c || 0,
    };

    const directionCRM3 =
      response?.data.attributes.primary_address_street || '';
    const assignedUserId = response?.data.attributes.assigned_user_id || '';

    return {
      infoDataLocal,
      mainPhone,
      officePhone,
      phonesModel,
      emailsModel,
      direction,
      directionCRM3,
      assignedUserId,
      moduleOrigin: 'leads',
      idModuleOrigin: id,
    };
  };
  const formattedStatus = async (selectedStatus: string) => {
    const { data } = await axios_LB_05.get('/lang-es-lead-status-dom-lists');
    console.log('your status', data);
    return (
      data?.find(
        (status: { label: string; value: string }) =>
          status.value === selectedStatus
      ).label || 'Sin Estado'
    );
  };
  return {
    convertToAccountFormat,
    convertToContactFormat,
    createFormDraft,
    formattedStatus,
  };
}
