import { axios_LB_01 } from 'src/conections/axiosCRM';

export interface ContactResponseModel {
  resp: RespContact;
}

export interface RespContact {
  status: number;
  statusText: string;
  info_contact: InfoContact;
  phone_email_contact: PhoneEmailContact;
}

export interface InfoContact {
  detail_contact: DetailContact;
  direction_contact: DirectionContact;
}

export interface DetailContact {
  id: string;
  primary_address_city: string;
  primary_address_country: string;
  primary_address_state_list_c: string;
  industry_c: string;
  birthdate: string;
  subindustry_c: string;
  salutation: string;
  name: string;
  full_name: string;
  first_name: string;
  last_name: string;
  ci_c: string;
  estado_civil_c: string;
  genero_c: string;
  description: string;
  principal_c: number;
  is_parents_c: boolean;
  title: string;
  created_by_name: string;
  modified_by_name: string;
  date_modified: string;
}

export interface DirectionContact {
  primary_address_street: string;
  address_street_generated_c: string;
  jjwg_maps_lat_c: number;
  jjwg_maps_lng_c: number;
  jjwg_maps_address_c: string;
}

export interface PhoneEmailContact {
  phone_work: string;
  phone_mobile: string;
  phone_work_wp_c: string;
  phone_work_cd_c: string;
  phone_mobile_wp_c: string;
  phone_mobile_cd_c: string;
  emails: Email[];
  phones: object[];
}

export interface Email {
  id: string;
  email_address: string;
  primary_item: boolean;
}

export const getContact = async (
  id: string,
  options: { assignContactFormat?: boolean } = {}
) => {
  const { assignContactFormat = false } = options;
  const response = await axios_LB_01.get<ContactResponseModel>(
    `/contact-get-all/${id}`
  );
  if (assignContactFormat)
    return {
      id,
      name: response.data.resp.info_contact.detail_contact.full_name,
      ci: response.data.resp.info_contact.detail_contact.ci_c,
    };
  return response;
};
