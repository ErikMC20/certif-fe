import { boot } from 'quasar/wrappers';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import AssignedUser from 'src/components/AssignedUsers/AssignedUser.vue';
import CIRepeatedDialog from 'src/components/MainDialog/CIRepeatedDialog.vue';
import ContactCardComponent from 'src/components/MainCard/ContactCard.vue';
import DialogComponent from 'src/components/MainDialog/DialogComponent.vue';
import DirectionCardComponent from 'src/components/MainCard/DirectionCard.vue';
import TableComponent from 'src/components/MainTable/TableComponent.vue';
import TableDialogCIComponent from 'src/components/MainDialog/TableDialogCI.vue';
import TableDialogComponent from 'src/components/MainDialog/TableDialog.vue';
import ViewCardComponent from 'src/components/MainCard/ViewCard.vue';

import SelectAccountInput from 'src/components/MainInputs/AccountSelectInput.vue';
import SelectCampaignInput from 'src/components/MainInputs/CampaignSelectInput.vue';
import DateRangeComponent from 'src/components/DateRange/DateRangeComponent.vue';

export default boot(async ({ app }) => {
  app.component('alert-component', AlertComponent);
  app.component('assigned-user-component', AssignedUser);
  app.component('ci-repeated-dialog-component', CIRepeatedDialog);
  app.component('contact-card-component', ContactCardComponent);
  app.component('dialog-component', DialogComponent);
  app.component('direction-card-component', DirectionCardComponent);
  app.component('table-component', TableComponent);
  app.component('table-dialog-ci-component', TableDialogCIComponent);
  app.component('table-dialog-component', TableDialogComponent);
  app.component('view-card-component', ViewCardComponent);
  app.component('select-account-input', SelectAccountInput);
  app.component('select-campaign-input', SelectCampaignInput);
  app.component('date-range-component', DateRangeComponent);
});
