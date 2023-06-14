<script lang="ts" src="./TableComponent.ts" />

<template>
  <q-btn
    color="primary"
    icon="post_add"
    label="Crear Nuevo"
    @click="dialogHandler"
    :style="'margin-bottom: 1rem;'"
  />
  <ejs-grid
    draggable="true"
    ref="grid"
    :dataSource="data"
    :allowPaging="true"
    :pageSettings="pageSettings"
    :allowSorting="true"
    :allowFiltering="true"
    :filterSettings="filterOptions"
    locale="es-ES"
  >
    <e-columns>
      <e-column type="checkbox" width="50"></e-column>
      <e-column
        field="OrderID"
        headerText="Order ID"
        textAlign="Right"
        width="90"
      ></e-column>
      <e-column
        field="CustomerID"
        headerText="Customer ID"
        width="120"
      ></e-column>
      <e-column
        field="Freight"
        headerText="Freight"
        textAlign="Right"
        format="C2"
        width="90"
      ></e-column>
      <e-column field="ShipCity" headerText="Ship City" width="150"></e-column>
    </e-columns>
    <template v-slot:rowTemplate="{ data }">
      <tr>
        <q-td key="checkbox" :props="props"
          ><q-checkbox v-model="input" :label="props.row.label"
        /></q-td>
        <td class="alt-td">{{ data.OrderID }}</td>
        <td class="my-value" @click="dd(data.OrderID)">
          {{ data.CustomerID }}
        </td>
        <td class="alt-td">{{ data.Freight }}</td>
        <td>{{ data.ShipCity }}</td>
      </tr>
    </template>
  </ejs-grid>

  <DialogComponent titleDialog="Crear Nueva Plantilla" v-model="open" />
</template>

<style lang="scss">
.e-pager .e-currentitem,
.e-pager .e-currentitem:hover {
  background: $primary !important;
}

.my-value {
  color: cyan;
}

.my-card {
  margin-left: 0rem;
}

@media (min-width: 600px) {
  .my-card {
    margin-left: 3.5rem;
  }
}
@media (min-width: 900px) {
  .my-card {
    margin-left: 16.2rem;
  }
}

td {
  padding: 1rem 1.5rem;
  border-style: solid;
  border-width: 0.1px 0px;
  border-color: #e2e2e2;
}

.alt-td {
  text-align: right;
}
</style>
