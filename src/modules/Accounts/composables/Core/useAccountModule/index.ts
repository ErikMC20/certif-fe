import { LegacyPhoneModel } from '../../../utils/types/index';
import { EmailModel, PhoneModel } from '../../../../../components/types/index';
import { ContactGeneralModel } from '../../../../Contacts/utils/types/index';
import { ref } from 'vue';

type DataContactOptions = {
  inheritCi?: boolean;
};

export function useAccountModule() {
  const contactCreationData = ref({} as ContactGeneralModel);
  const dataToContact = (
    data: object,
    idAccount: string,
    mainPhone: LegacyPhoneModel,
    officePhone: LegacyPhoneModel,
    options: DataContactOptions = {}
  ) => {
    const { inheritCi = false } = options;
    const contactData = {
      info_contact: {
        detail_contact: {
          ci_c: inheritCi
            ? data?.info_account.detail_account.nit_ci_c
            : data?.info_account.detail_account.tipocuenta_c === 'Privada'
            ? data?.info_account.detail_account.nit_ci_c
            : '',
          primary_address_city:
            data?.info_account.detail_account.billing_address_city,
          primary_address_country:
            data?.info_account.detail_account.billing_address_country,
          primary_address_state_list_c:
            data?.info_account.detail_account.billing_address_state_list_c,
          industry_c: data?.info_account.detail_account.industry,
          subindustry_c: data?.info_account.detail_account.subindustry_c,
          first_name: data?.info_account.detail_account.names_c,
          last_name: data?.info_account.detail_account.lastname_c,
          account_id: idAccount,
          assigned_user_id: data?.info_account.detail_account.assigned_user_id,
          principal_c: 1,
          estado_civil_c: '',
          genero_c: '',
          inherited: true,
          inherited_module: 'accounts',
          is_parents_c: 0,
          //...data?.info_account.detail_account,
        },
        direction_contact: {
          ...data?.info_account.direction_account,
        },
      },
      phone_email_contact: {
        phone_mobile: mainPhone.phone,
        phone_mobile_wp_c: mainPhone.whatsapp,
        phone_mobile_cd_c: mainPhone.code,
        phone_work: officePhone.phone,
        phone_work_wp_c: officePhone.whatsapp,
        phone_work_cd_c: officePhone.code,
        emails: data?.phone_email_account?.emails.map((val: EmailModel) => ({
          ...val,
          primary_item: val.primary_item === '1' ? true : false,
          inherited: true,
        })),
        phones: data?.phone_email_account?.phones.map((val: PhoneModel) => ({
          ...val,
          inherited: true,
        })),
      },
      // assigned_users: {},
      comments: {
        ...data?.comments,
      },
      // related_contact: {},
    };
    contactCreationData.value = contactData;
    console.log(contactData, contactCreationData);
    return contactData;
  };

  return {
    contactCreationData,
    dataToContact,
  };
}
