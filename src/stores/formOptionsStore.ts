import { defineStore } from 'pinia';
import AccountService from 'src/modules/Accounts/services/AccountService';
import { PaisListModel, SalutationModel } from '../components/types/index';

import { ProspectService } from '../modules/Prospects/services/ProspectsService';
import { useLeadsService } from 'src/modules/Leads/services/LeadsService';

export const useFormOptionsStore = defineStore('counter', {
  state: () => ({
    industriesSubindustries: [],
    directions: [],
    civilStatuses: [],
    genders: [],
    phoneByCountry: [],
    divisionsSales: [],
    leadSource: [],
    countries: [] as PaisListModel[],
    buyProcess: [],
    taxRegimes: [],
    relations: [],
    salutations: [] as SalutationModel[],
    statusProspect: [],
    mailTypes: [],
    accountType: [],
    documentType: [],
    phoneType: [],
    domType: [],
    gainStateLead: [],
    originLead: [],
    priority: [],
    clientGroup: [] as { _id: string; label: string; value: string }[],
    leadCurrency: [] as { id: string; name: string; symbol: string }[],
  }),

  getters: {
    accountOptions(state) {
      return {
        documentsList: state.documentType,
        accountType: state.accountType,
        taxRegime: state.taxRegimes,
        industry: state.industriesSubindustries,
        countries: state.countries,
        codesCountry: state.phoneByCountry,
        directions: state.directions,
      };
    },
    prospectOptions(state) {
      return {
        salutations: state.salutations,
        countries: state.countries,
        status: state.statusProspect,
        leadSource: state.leadSource,
      };
    },
    leadsOptions(state) {
      return {
        divisions: state.divisionsSales,
        regions: state.countries,
        gainStates: state.gainStateLead,
        originLead: state.originLead,
        priority: state.priority,
        clientGroup: state.clientGroup,
        leadCurrency: state.leadCurrency,
      };
    },
  },
  actions: {
    async getAccountLanguage() {
      const [
        documentsList,
        accountType,
        taxRegime,
        industry,
        countries,
        codesCountry,
        directions,
      ] = await AccountService.readOptionsLanguage();
      this.documentType = documentsList.data;
      this.accountType = accountType.data;
      this.taxRegimes = taxRegime.data;
      this.industriesSubindustries = industry.data;
      this.countries = countries.data;
      this.phoneByCountry = codesCountry.data;
      this.directions = directions.data;
    },
    async getProspectOptions() {
      const [salutationList, paisList, statusList, leadSource] =
        await ProspectService().getOptionsLanguage();
      this.salutations = salutationList.data;
      this.countries = paisList.data;
      this.statusProspect = statusList.data;
      this.leadSource = leadSource.data;
    },
    async getLeadsOptions() {
      const [
        divisions,
        countries,
        gainStateLead,
        originLead,
        priority,
        clientGroup,
        leadCurrency,
      ] = await useLeadsService().getOptionsLanguage();
      this.divisionsSales = divisions.data;
      this.countries = countries.data;
      this.gainStateLead = gainStateLead.data;
      this.originLead = originLead.data;
      this.priority = priority.data;
      this.clientGroup = clientGroup.data;
      this.leadCurrency = leadCurrency.data.currencies;
    },
  },
});
