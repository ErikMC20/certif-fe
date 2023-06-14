import { axios_GLOBAL, axios_LB_04 } from 'src/conections/axiosCRM';
import {
  MeetingInfoModel,
  DataResponse,
  DataData,
} from '../components/types/index';
import {
  GuestsRecordResponse,
  SearchUser,
  RecordOptionsModel,
} from '../components/types/index';
import {
  RecordsModule,
  MeetingModel,
  RecordInfoModel,
} from '../components/types/index';
import { userStore } from 'src/modules/Users/store/UserStore';
import { pascalCase } from 'pascal-case';
import moment from 'moment';
import { ModuleActivity } from '../components/types/index';
import { getRecordModuleInfo } from 'src/services/GlobalService';

const userCRM = userStore();

export async function getRecordsByModule(
  moduleName: string,
  rowsPerPage: string
) {
  try {
    const { data } = await axios_GLOBAL.get<RecordsModule>(
      `/get-list-module-2/${moduleName}/name/${rowsPerPage}/10/name`
    );
    return data.data.data.map((value) => ({
      id: value.id,
      ...value.attributes,
    }));
  } catch (error) {
    throw error;
  }
}

export async function createMeetingService(body: MeetingModel) {
  try {
    body.attributes_comment = {
      ...body.attributes_comment,
      bean_module: 'Meetings',
      created_by: userCRM.userCRM.id,
      visualizacion_c: 'interno',
      relevance: 'medium',
    };
    body.meeting.attributes.date_start = moment(
      body.meeting.attributes.date_start,
      'DD/MM/YYYY HH:mm'
    )
      .add(4, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');
    console.log('this is your body', body);
    await axios_LB_04.post('/create-meeting', body);
  } catch (error) {
    throw error;
  }
}

export async function updateMeetingService(body: MeetingModel) {
  try {
    body.meeting.attributes.date_start = moment(
      body.meeting.attributes.date_start,
      'DD/MM/YYYY HH:mm'
    )
      .add(4, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');
    body.meeting.attributes.modified_user_id = userCRM.userCRM.id;
    body.meeting.attributes.contacts = '';
    // return;
    await axios_LB_04.patch('/update-Meeting', body);
  } catch (error) {
    throw error;
  }
}

export async function updateMeetingAttributesService(
  idTask: string,
  body: object
) {
  try {
    console.log('updating something');
    const requestBody = {
      type: 'Meetings',
      id: idTask,
      attributes: { ...body },
    };
    await axios_GLOBAL.patch('/module-update', requestBody);
  } catch (error) {
    throw error;
  }
}

export async function getRecordInfo(
  moduleName: ModuleActivity,
  idModule: string,
  fields: string[] = []
): Promise<{ [key: string]: string | number }> {
  const fieldsRecord = fields.length > 1 ? fields : ['name'];
  try {
    const { data } = await axios_GLOBAL.get<RecordInfoModel>(
      `/get-fields-module/${moduleName}/${idModule}/${fieldsRecord.join(',')}`
    );
    console.log(data);
    return { id: data.data.data.id, ...data.data.data.attributes };
  } catch (error) {
    throw error;
  }
}

export async function getUserAsInvitee(id: string) {
  try {
    const user = await getRecordModuleInfo('Users', id, {
      allData: false,
      fields: ['name', 'email1'],
    });
    console.log('your new user', user);
    return {
      id,
      fullname: (user.name as string) || '',
      email_address: (user.email1 as string) || '',
      module: 'users',
    };
  } catch (error) {
    throw error;
  }
}

export async function getRecordsByValue(
  value: string,
  options: RecordOptionsModel = {}
): Promise<SearchUser[]> {
  const {
    module = '',
    user_iddivision = '',
    user_idamercado = '',
    user_idgrupocliente = '',
  } = options;
  const formattedModule = module.charAt(0).toUpperCase() + module.slice(1);
  const bodyOptions = {
    value,
    module: formattedModule,
    user_iddivision,
    user_idamercado,
    user_idgrupocliente,
  };
  try {
    const { data } = await axios_LB_04.patch<GuestsRecordResponse>(
      '/search-user-mitings/1/100/desc/{val}',
      bodyOptions
    );
    return data.search_users;
  } catch (error) {
    throw error;
  }
}

export async function getMeetingInfo(id: string): Promise<DataResponse> {
  try {
    const { data } = await axios_LB_04.get<MeetingInfoModel>(
      `/get-Meeting/${id}`
    );

    // formatting data
    if (data.data.meeting.attributes.date_start) {
      data.data.meeting.attributes.date_start = moment(
        data.data.meeting.attributes.date_start
      ).format('DD/MM/YYYY HH:mm');
    }
    return data.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteMeeting(id: string) {
  try {
    await axios_LB_04.delete(`/delet-meetings/${id}/${userCRM.userCRM.id}`);
  } catch (error) {
    throw error;
  }
}
