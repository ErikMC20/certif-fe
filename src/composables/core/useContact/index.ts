import {
  PhoneModel,
  EmailModel,
  phonesUpdateModel,
  emailsUpdateModel,
} from '../../../components/types/index';

function createBodyContact(
  idUser: string,
  phones?: PhoneModel[],
  emails?: EmailModel[]
) {
  return {
    idUser: idUser || '',
    emails: emails || [],
    phones: phones || [],
  };
}

export function useContact(
  idUser: string,
  phones = {} as phonesUpdateModel,
  emails = {} as emailsUpdateModel
) {
  const updateBodyContact = createBodyContact(
    idUser,
    phones.currentPhones,
    emails.currentEmails
  );
  const deletedBodyContact = createBodyContact(
    idUser,
    phones.deletedPhones,
    emails.deletedEmails
  );
  const createdBodyContact = createBodyContact(
    idUser,
    phones.newPhones,
    emails.newEmails
  );

  return {
    updateBodyContact,
    deletedBodyContact,
    createdBodyContact,
  };
}
