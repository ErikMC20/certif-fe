import { defineStore } from 'pinia';
import { useBusinessesService } from '../services/BusinessesService';
import {
  FilterForm,
  OpportunitiesResponse,
  StatValue,
  ExpiredActivitiesResponse,
} from '../utils/types';
import { applyDrag } from '../components/KanbanExample/helpers';
import { useIdGenerator } from 'src/composables/General/generator';
import moment from 'moment';
import { SalesPhase, FilterFormat } from '../utils/types';

export interface SalePhase {
  id: string;
  label: string;
  value: string;
  props: Props;
  children: OpportunitiesResponse[];
  data: OpportunitiesResponse[];
}

export interface Props {
  color: string;
  rules?: string[];
}

const onlyGained = /(Ganado)+/g;

const {
  getBusinesses: getBusinessesService,
  getExpiredActivities: getExpiredActivitiesService,
  getDetailedOpportunities,
  getExpiredActivitiesDetailed: getExpiredActivitiesDetailedService
} = useBusinessesService();

export const useBusinessesStore = defineStore('businesses', {
  state: () => ({
    draft: {},
    opportunities: [] as OpportunitiesResponse[],
    quickFilter: {
      nameFilter: '',
      opportunityType: '',
      opportunityState: '',
      from: '',
      to: '',
    } as FilterForm,
    filter: {} as FilterFormat,
    salesPhase: [] as SalesPhase[],
    currentData: [] as SalePhase[],
    expiredActivities: [] as ExpiredActivitiesResponse[],
  }),

  getters: {
    currentColumns: (state): SalePhase[] => {
      const { generateLocalId } = useIdGenerator();
      return state.salesPhase.map((col) => ({
        id: generateLocalId(),
        label: col.label,
        value: col.value,
        props: col.prop as Props,
        children: [] as OpportunitiesResponse[],
        data: [] as OpportunitiesResponse[],
      }));
    },
    stats(): StatValue[] {
      return [
        {
          id: 1,
          icon: 'attach_money',
          title: 'Monto total',
          amount: this.validOpportunities
            .map((v) => v.monto)
            .reduce((p, c) => p + c, 0),
          isMoney: true,
          value: 'total_amount',
        },
        {
          id: 2,
          icon: 'attach_money',
          title: 'Monto ganado',
          amount: this.validOpportunities
            .map((o) => (onlyGained.exec(o.oppt_status) ? o.monto : 0))
            .reduce((p, c) => p + c, 0),
          isMoney: true,
          value: 'gained_money',
        },
        {
          id: 3,
          icon: 'list_alt',
          title: 'Tasa de conversion',
          amount: Math.round(
            (this.validOpportunities
              .map((o) => (onlyGained.exec(o.oppt_status) ? o.monto : 0))
              .reduce((p, c) => p + c, 0) /
              this.validOpportunities
                .map((v) => v.monto)
                .reduce((p, c) => p + c, 0)) *
              100
          ),
          isPercentage: true,
          value: 'conversion_rate',
        },
        {
          id: 4,
          icon: 'money_off',
          title: 'Monto Perdido',
          amount: 0,
          isMoney: true,
          value: 'amount_lost',
        },
        {
          id: 5,
          icon: 'list_alt',
          title: 'Total Actividades',
          amount: this.validOpportunities.reduce(
            (prev, curr) => prev + curr.activities,
            0
          ),
          value: 'total_activities',
        },
        {
          id: 6,
          icon: 'list_alt',
          title: 'Actividades Vencidas',
          amount: this.validOpportunities.reduce(
            (prev, curr) => prev + curr.expired_activities,
            0
          ),
          value: 'expired_activities',
        },
        {
          id: 7,
          icon: 'list_alt',
          title: 'Oportunidades Vencidas',
          amount: this.validOpportunities.filter((opp) =>
            moment(opp.fechaCierre).isBefore(moment())
          ).length,
          value: 'expired_opportunities',
        },
        {
          id: 8,
          icon: 'list_alt',
          title: 'Oportunidades sin actividad',
          amount: this.validOpportunities.reduce(
            (prev, curr) => prev + (curr.activities === 0 ? 1 : 0),
            0
          ),
          value: 'opportunities_without_activities',
        },
        {
          id: 9,
          icon: 'list_alt',
          title: 'Total Oportunidades',
          amount: this.validOpportunities.length,
          value: 'total_opportunities',
        },
      ];
    },
    validOpportunities(): OpportunitiesResponse[] {
      const value: OpportunitiesResponse[] = this.opportunities.filter((opp) =>
        this.currentColumns.map((c) => c.value).includes(opp.faseDeVenta)
      );
      return value;
    },
    validExpiredActivities(state): ExpiredActivitiesResponse[] {
      return state.expiredActivities.filter((activity) =>
        this.validOpportunities.map((oppt) => oppt.id).includes(activity.opp_id)
      );
    },
    expiredOpportunities(): OpportunitiesResponse[] {
      return this.validOpportunities.filter((oppt) =>
        moment(oppt.fechaCierre).isBefore(moment())
      );
    },
    opportunitiesWithoutActivities(): OpportunitiesResponse[] {
      const data = this.validOpportunities.filter(
        (opp) => opp.activities === 0
      );
      return data;
    },
  },
  actions: {
    assignBusinesses(opportunities: OpportunitiesResponse[]) {
      // console.log('your response', opportunities);
      this.opportunities = opportunities;
      this.currentData = this.currentColumns.map((col) => ({
        ...col,
        data: this.opportunities.filter(
          (oppt) => oppt.faseDeVenta === col.value
        ),
      }));
    },
    async getBusinesses(data: FilterForm) {
      const response = await getBusinessesService(data);
      this.assignBusinesses(response);
      return response;
    },
    async getBusinessesDetailed(data: FilterFormat) {
      const response = await getDetailedOpportunities(data);
      this.assignBusinesses(response);
      return response;
    },
    async getExpiredActivities(data: FilterForm) {
      const response = await getExpiredActivitiesService(data);
      this.expiredActivities = response;
      return response;
    },
    async getExpiredActivitiesDetailed(data: FilterFormat) {
      const response = await getExpiredActivitiesDetailedService(data)
      this.expiredActivities = response;
      return response;
    },
    async deleteOpportunity(id: string) {
      console.log(`Deleting... ${id}`);
    },
    async changeOpportunityState(
      id: string,
      value: string,
      state: 'Ganado' | 'Perdido'
    ) {
      if (state === 'Ganado') {
        console.log(`Gained As... ${value} ${id}`);
      } else if (state === 'Perdido') {
        console.log(`Lost as... ${value} ${id}`);
      }
    },
    async duplicateOpportunity(id: string) {
      console.log(`Duplicate as ${id}`);
    },
    async onCardDrop(columnId: string, dropResult: any) {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const sceneVal = [...this.currentData];
        const column = sceneVal.filter(
          (p: { id: string }) => p.id === columnId
        )[0];
        const itemIndex = sceneVal.indexOf(column);
        const newColumn = Object.assign({}, column);

        // check if element was ADDED in current column
        if (dropResult.removedIndex == null && dropResult.addedIndex >= 0) {
          // your action / api call
          dropResult.payload.loading = true;
          // simulate api call
          setTimeout(function () {
            dropResult.payload.loading = false;
          }, Math.random() * 5000 + 1000);
        }

        newColumn.data = applyDrag(newColumn.data, dropResult);
        sceneVal.splice(itemIndex, 1, newColumn);
        this.currentData = sceneVal;
      }
    },
  },
});
