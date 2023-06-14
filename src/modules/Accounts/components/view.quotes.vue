<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input
            bottom-slots
            dense
            v-model="filter"
            placeholder="Buscar por nombre, estado y asignado"
          >
            <template v-slot:hint>
              <span class="text-primary"
                >{{
                  filterdocRelation.length == 1
                    ? filterdocRelation.length + ' Cotización encontrada'
                    : filterdocRelation.length + ' Cotizaciones encontradas'
                }}
              </span>
            </template>
            <template v-slot:append>
              <q-icon name="search" v-if="!filter" />
              <q-icon
                name="clear"
                v-else
                @click="filter = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end q-gutter-sm">
            <slot name="buttons">
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                target="_blank"
                @click="createNewQuotes(props.idAccount)"
                label="Nueva cotizacion"
                size="md"
              />
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="openFilterQuotesv2"
                label="buscar y agregar"
                size="md"
              />
              <!-- <q-btn color="primary" icon="add" class="mobile-only" /> -->
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="filterdocRelation.length > 0">
          <q-list v-if="userCRM.iddivision == 'todas'">
            <template
              v-for="({ cod_div, label }, index) in listAMercado"
              :key="cod_div"
            >
              <!-- <template v-for="row,index in listAMercado" :key="index"> -->
              <q-expansion-item
                :label="label"
                :caption="filterdocRelation.filter((v:any) => v.iddivision === cod_div).length+' Cotizaciones'"
                header-class="text-blue"
                popup
                v-if="filterdocRelation.filter((v:any) => v.iddivision === cod_div).length > 0"
              >
                <template
                  v-for="{ cod_amercado, label } in listAMercado[index]
                    .amercado"
                  :key="cod_amercado"
                >
                  <q-expansion-item
                    :label="'Area de mercado: ' + label"
                    :caption="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length+' Cotizaciones'"
                    header-class="text-red"
                    v-if="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length > 0"
                  >
                    <template v-if="!$q.screen.xs ? true : false">
                      <q-table
                        :rows="filterdocRelation"
                        :columns="columns"
                        row-key="name"
                        :pagination="pagination"
                        hide-bottom
                      >
                        <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th auto-width />
                            <q-th
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                              class="text-weight-medium"
                            >
                              {{ col.label }}
                            </q-th>
                          </q-tr>
                        </template>
                        <template v-slot:body="props">
                          <q-tr
                            :props="props"
                            v-if="cod_amercado === props.row.idamercado"
                            @click="() => openDialogAquotes(props.row.id)"
                          >
                            <q-td auto-width>
                              <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;"> -->
                              <q-btn
                                size="sm"
                                round
                                :color="
                                  props.row.estado == 'Borrador'
                                    ? 'orange'
                                    : props.row.estado == 'Confirmado'
                                    ? 'green'
                                    : 'red'
                                "
                                :icon="
                                  props.row.estado == 'Confirmado'
                                    ? 'check'
                                    : props.row.estado == 'Borrador'
                                    ? 'work_history'
                                    : 'trending_down'
                                "
                              >
                              </q-btn>
                              <!-- </a> -->
                            </q-td>
                            <q-td key="name" :props="props" class="text-blue">
                              {{ props.row.numero }}
                            </q-td>
                            <q-td key="name" :props="props">
                              <q-item-label lines="5" class="text-primary">{{
                                props.row.name
                              }}</q-item-label>
                              <span
                                :class="
                                  props.row.estado == 'Borrador'
                                    ? 'text-orange'
                                    : props.row.estado == 'Confirmado'
                                    ? 'text-green'
                                    : 'text-red'
                                "
                              >
                                {{ props.row.estado }}
                              </span>
                            </q-td>
                            <q-td key="name" :props="props" class="text-grey">
                              {{ props.row.faseval }}
                            </q-td>
                            <q-td
                              key="name"
                              :props="props"
                              :class="
                                $q.dark.isActive
                                  ? 'text-white'
                                  : props.row.fecha_creacion == 'Sin Registrar'
                                  ? 'text-grey'
                                  : 'text-black'
                              "
                            >
                              <q-icon
                                name="event"
                                class="q-pr-xs"
                                :color="
                                  props.row.fecha_creacion == 'Sin Registrar'
                                    ? 'grey'
                                    : 'blue'
                                "
                              />
                              {{ props.row.fecha_creacion }}
                            </q-td>
                            <q-td
                              key="name"
                              :props="props"
                              :class="
                                $q.dark.isActive
                                  ? 'text-white'
                                  : props.row.fecha_expiracion ==
                                    'Sin Registrar'
                                  ? 'text-grey'
                                  : 'text-black'
                              "
                            >
                              <q-icon
                                name="event"
                                class="q-pr-xs"
                                :color="
                                  props.row.fecha_expiracion == 'Sin Registrar'
                                    ? 'grey'
                                    : 'blue'
                                "
                              />
                              {{ props.row.fecha_expiracion }}
                            </q-td>
                            <q-td
                              key="name"
                              :props="props"
                              :class="
                                $q.dark.isActive
                                  ? 'text-white'
                                  : props.row.asignado == 'Sin Registrar'
                                  ? 'text-grey'
                                  : 'text-black'
                              "
                            >
                              <q-icon
                                name="person"
                                class="q-pr-xs"
                                :color="
                                  props.row.asignado == 'Sin Registrar'
                                    ? 'grey'
                                    : 'blue'
                                "
                              />
                              {{ props.row.asignado }}
                            </q-td>
                            <q-td key="name" :props="props">
                              <q-chip color="teal" size="sm" text-color="white">
                                {{
                                  props.row.monto.toLocaleString('en-ES', {
                                    minimumFractionDigits: 2,
                                  })
                                }}
                                {{ props.row.moneda }}
                              </q-chip>
                            </q-td>
                            <q-td key="name" :props="props">
                              <q-btn
                                size="12px"
                                flat
                                dense
                                round
                                icon="more_vert"
                              >
                                <q-menu>
                                  <q-list style="min-width: 100px" dense>
                                    <q-item
                                      clickable
                                      v-close-popup
                                      @click="seeQoutesfunction(props.row)"
                                    >
                                      <q-item-section
                                        >ver Cotización</q-item-section
                                      >
                                    </q-item>
                                    <q-item
                                      clickable
                                      v-close-popup
                                      @click="
                                        sendLayoutQuotesToEmail(props.row)
                                      "
                                    >
                                      <q-item-section
                                        >Enviar Por Correo</q-item-section
                                      >
                                    </q-item>
                                    <q-separator />
                                  </q-list>
                                </q-menu>
                              </q-btn>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </template>
                    <template v-else>
                      <q-list bordered class="rounded-borders">
                        <template
                          v-for="(row2, index) in filterdocRelation"
                          :key="index"
                        >
                          <q-item v-if="cod_amercado === row2.idamercado">
                            <q-item-section avatar>
                              <a
                                :href="link + row2.id"
                                target="_blank"
                                style="text-decoration: none"
                              >
                                <q-btn
                                  size="sm"
                                  round
                                  :color="
                                    row2.estado == 'En Tratamiento'
                                      ? 'orange'
                                      : row2.estado == 'Ganado'
                                      ? 'green'
                                      : 'red'
                                  "
                                  :icon="
                                    row2.estado == 'Ganado'
                                      ? 'check'
                                      : row2.estado == 'En Tratamiento'
                                      ? 'work_history'
                                      : 'trending_down'
                                  "
                                >
                                </q-btn>
                              </a>
                            </q-item-section>
                            <q-item-section>
                              <a
                                :href="link + row2.id"
                                target="_blank"
                                style="text-decoration: none"
                              >
                                <q-item-label lines="5" class="text-primary">{{
                                  row2.name
                                }}</q-item-label>
                              </a>
                              <span
                                :class="
                                  row2.estado == 'En Tratamiento'
                                    ? 'text-orange'
                                    : row2.estado == 'Ganado'
                                    ? 'text-green'
                                    : 'text-red'
                                "
                                >{{ row2.estado }}</span
                              >
                              <q-item-label
                                caption
                                lines="3"
                                v-show="!$q.screen.xs ? false : true"
                              >
                                <span class="text-weight-regular text-primary"
                                  >Fecha Cierre:</span
                                >
                              </q-item-label>
                              <q-item-label
                                caption
                                lines="3"
                                v-show="!$q.screen.xs ? false : true"
                              >
                                <span class="text-black">
                                  {{ row2.fecha_cierre }}</span
                                >
                              </q-item-label>
                              <q-item-label
                                caption
                                lines="3"
                                v-show="!$q.screen.xs ? false : true"
                              >
                                <span class="text-weight-regular text-primary"
                                  >Monto:</span
                                >
                              </q-item-label>
                              <q-item-label
                                caption
                                lines="3"
                                v-show="!$q.screen.xs ? false : true"
                              >
                                <span class="text-black">
                                  {{
                                    row2.monto.toLocaleString('en-ES', {
                                      minimumFractionDigits: 2,
                                    })
                                  }}
                                  {{ row2.moneda }}</span
                                >
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-separator
                            inset="item"
                            v-if="cod_amercado === row2.idamercado"
                          />
                        </template>
                      </q-list>
                    </template>
                    <q-separator />
                  </q-expansion-item>
                </template>

                <q-separator />
              </q-expansion-item>
            </template>
          </q-list>

          <q-list v-else>
            <template
              v-for="{ cod_amercado, label } in listAMercado"
              :key="cod_amercado"
            >
              <q-expansion-item
                :label="label"
                :caption="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length+' Cotizaciones'"
                header-class="text-blue"
                popup
                v-if="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length > 0"
              >
                <template v-if="!$q.screen.xs ? true : false">
                  <q-table
                    :rows="filterdocRelation"
                    :columns="columns"
                    row-key="name"
                    :pagination="pagination"
                    hide-bottom
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th auto-width />
                        <q-th
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                          class="text-weight-medium"
                        >
                          {{ col.label }}
                        </q-th>
                      </q-tr>
                    </template>
                    <template v-slot:body="props">
                      <q-tr
                        :props="props"
                        v-if="cod_amercado === props.row.idamercado"
                      >
                        <q-td auto-width>
                          <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;">   -->
                          <q-btn
                            size="sm"
                            round
                            :color="
                              props.row.estado == 'Borrador'
                                ? 'orange'
                                : props.row.estado == 'Confirmado'
                                ? 'green'
                                : 'red'
                            "
                            :icon="
                              props.row.estado == 'Confirmado'
                                ? 'check'
                                : props.row.estado == 'Borrador'
                                ? 'work_history'
                                : 'trending_down'
                            "
                          >
                          </q-btn>
                          <!-- </a>                  -->
                        </q-td>
                        <q-td
                          key="name"
                          :props="props"
                          class="text-blue cursor-pointer"
                          @click="() => openDialogAquotes(props.row.id)"
                        >
                          {{ props.row.numero }}
                        </q-td>
                        <q-td
                          key="name"
                          :props="props"
                          class="text-blue cursor-pointer"
                          @click="() => openDialogAquotes(props.row.id)"
                        >
                          <q-item-label lines="5" class="text-primary">{{
                            props.row.name
                          }}</q-item-label>
                          <span
                            :class="
                              props.row.estado == 'Borrador'
                                ? 'text-orange'
                                : props.row.estado == 'Confirmado'
                                ? 'text-green'
                                : 'text-red'
                            "
                          >
                            {{ props.row.estado }}
                          </span>
                        </q-td>
                        <q-td key="name" :props="props" class="text-grey">
                          <q-select
                            v-model="props.row.estado"
                            :options="opciones_estado"
                            outlined
                            rounded
                            dense
                            options-dense
                            option-value="valueE"
                            option-label="label"
                            transition-show="flip-up"
                            transition-hide="flip-down"
                            color="primary"
                            emit-value
                            map-options
                            size="xs"
                            @update:model-value="
                              openAlert(
                                props.row.id,
                                props.row.estado,
                                props.row.name
                              )
                            "
                          >
                          </q-select>
                        </q-td>
                        <q-td
                          key="name"
                          :props="props"
                          :class="
                            $q.dark.isActive
                              ? 'text-white'
                              : props.row.fecha_creacion == 'Sin Registrar'
                              ? 'text-grey'
                              : 'text-black'
                          "
                        >
                          <q-icon
                            name="event"
                            class="q-pr-xs"
                            :color="
                              props.row.fecha_creacion == 'Sin Registrar'
                                ? 'grey'
                                : 'blue'
                            "
                          />
                          {{ props.row.fecha_creacion }}
                        </q-td>
                        <q-td
                          key="name"
                          :props="props"
                          :class="
                            $q.dark.isActive
                              ? 'text-white'
                              : props.row.fecha_expiracion == 'Sin Registrar'
                              ? 'text-grey'
                              : 'text-black'
                          "
                        >
                          <q-icon
                            name="event"
                            class="q-pr-xs"
                            :color="
                              props.row.fecha_expiracion == 'Sin Registrar'
                                ? 'grey'
                                : 'blue'
                            "
                          />
                          {{ props.row.fecha_expiracion }}
                        </q-td>
                        <q-td
                          key="name"
                          :props="props"
                          :class="
                            $q.dark.isActive
                              ? 'text-white'
                              : props.row.asignado == 'Sin Registrar'
                              ? 'text-grey'
                              : 'text-black'
                          "
                        >
                          <q-icon
                            name="person"
                            class="q-pr-xs"
                            :color="
                              props.row.asignado == 'Sin Registrar'
                                ? 'grey'
                                : 'blue'
                            "
                          />
                          {{ props.row.asignado }}
                        </q-td>
                        <q-td key="name" :props="props">
                          <q-chip color="teal" size="sm" text-color="white">
                            {{
                              props.row.monto.toLocaleString('en-ES', {
                                minimumFractionDigits: 2,
                              })
                            }}
                            {{ props.row.moneda }}
                          </q-chip>
                        </q-td>
                        <q-td key="name" :props="props">
                          <q-btn size="12px" flat dense round icon="more_vert">
                            <q-menu>
                              <q-list style="min-width: 100px" dense>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="seeQoutesfunction(props.row)"
                                >
                                  <q-item-section
                                    >ver Cotización</q-item-section
                                  >
                                </q-item>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="sendLayoutQuotesToEmail(props.row)"
                                >
                                  <q-item-section
                                    >Enviar Por Correo</q-item-section
                                  >
                                </q-item>
                                <q-separator />
                              </q-list>
                            </q-menu>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </template>
                <template v-else>
                  <q-list bordered class="rounded-borders">
                    <template
                      v-for="(row2, index) in filterdocRelation"
                      :key="index"
                    >
                      <q-item v-if="cod_amercado === row2.idamercado">
                        <q-item-section avatar>
                          <a
                            :href="link + row2.id"
                            target="_blank"
                            style="text-decoration: none"
                          >
                            <q-btn
                              size="sm"
                              round
                              :color="
                                row2.estado == 'Borrador'
                                  ? 'orange'
                                  : row2.estado == 'Confirmado'
                                  ? 'green'
                                  : 'red'
                              "
                              :icon="
                                row2.estado == 'Confirmado'
                                  ? 'check'
                                  : row2.estado == 'Borrador'
                                  ? 'work_history'
                                  : 'trending_down'
                              "
                            >
                            </q-btn
                          ></a>
                        </q-item-section>
                        <q-item-section>
                          <a
                            :href="link + row2.id"
                            target="_blank"
                            style="text-decoration: none"
                          >
                            <q-item-label lines="5" class="text-primary">{{
                              row2.name
                            }}</q-item-label>
                          </a>
                          <span
                            :class="
                              row2.estado == 'Borrador'
                                ? 'text-orange'
                                : row2.estado == 'Confirmado'
                                ? 'text-green'
                                : 'text-red'
                            "
                            >{{ row2.estado }}
                          </span>
                          <q-item-label
                            caption
                            lines="3"
                            v-show="!$q.screen.xs ? false : true"
                          >
                            <span class="text-weight-regular text-primary"
                              >Fecha Cierre:</span
                            >
                          </q-item-label>
                          <q-item-label
                            caption
                            lines="3"
                            v-show="!$q.screen.xs ? false : true"
                          >
                            <span class="text-black">
                              {{ row2.fecha_expiracion }}</span
                            >
                          </q-item-label>
                          <q-item-label
                            caption
                            lines="3"
                            v-show="!$q.screen.xs ? false : true"
                          >
                            <span class="text-weight-regular text-primary"
                              >Monto:</span
                            >
                          </q-item-label>
                          <q-item-label
                            caption
                            lines="3"
                            v-show="!$q.screen.xs ? false : true"
                          >
                            <span class="text-black">
                              {{
                                row2.monto.toLocaleString('en-ES', {
                                  minimumFractionDigits: 2,
                                })
                              }}
                              {{ row2.moneda }}</span
                            >
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator
                        inset="item"
                        v-if="cod_amercado === row2.idamercado"
                      />
                    </template>
                  </q-list>
                </template>

                <q-separator />
              </q-expansion-item>
            </template>
          </q-list>
        </template>
        <template v-else>
          <q-card
            style="height: 60vh; width: 100%"
            flat
            class="my-card column flex-center"
          >
            <img
              src="list-empty.png"
              alt="lista vacia"
              style="width: 220px; height: 200px"
            />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5"
                >No se encontraron cotizaciones relacionadas...</small
              >
            </div>
          </q-card>
        </template>
      </div>
      <!-- <pre>{{filterdocRelation}}</pre> -->
    </q-card-section>
    <q-inner-loading
      :showing="relacarga"
      label="Relacionando una cotización.."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>

  <q-card v-else style="height: 60vh; width: 100%">
    <q-skeleton height="100px" square class="bg-primary text-white" />
    <q-card-section>
      <q-skeleton type="QBtn" width="20%" class="text-subtitle1" />
    </q-card-section>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left" style="width: 150px">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in 7" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="50px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="35px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="65px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="25px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>
  <GeneralDialog ref="quotesDialogRef" @reloadQuotes="reloadQuotesOpp" />
  <RelacionadoQuotes
    account_id=""
    ref="relacionadoQuotesRef"
    @selectItem="selectRelaQuotesv2"
  />
  <AlertComponent
    v-model="alert"
    icon="request_quote"
    icon-color="primary"
    icon-size="70px"
    title="Relacionar la cotización"
    btnColor="primary"
    btnText="Si, relacionar"
    @confirm="saveRelationQuotesv2"
    @denegate="alert = false"
  >
    <template #body>
      <span class="text-center col-12"
        >¿ Desea relacionar la cotización ?
      </span>

      <span class="text-center text-primary col-12">
        {{ infoQuotes.nombre }}
      </span>
    </template>
  </AlertComponent>
  <AlertComponent
    v-model="dialogConfirm"
    icon="request_quote"
    icon-color="teal"
    icon-size="70px"
    title="Actualizar etapa"
    btnColor="teal"
    btnText="Si, actualizar etapa"
    @confirm="stageConfirm"
    @denegate="stageCancel"
  >
    <template #body>
      <span class="text-center col-12"
        >¿ Desesa cambiar la etapa de cotización ?
      </span>

      <span class="text-center text-teal col-12">
        {{ confirm.nombre }}
      </span>
    </template>
  </AlertComponent>

  <LayoutQuotes :id="''" ref="layoutQuotesRef"></LayoutQuotes>
  <SendEmailQuotes
    :guests="[]"
    module="AOS_Quotes"
    :correos="datagest"
    ref="SendEmailQuotesRef"
    :idModule="idModuleQuotes"
  />

  <AlertComponent
    v-model="alertReplaceQuotes"
    icon="report"
    icon-color="warning"
    icon-size="70px"
    title="La cotizacion ya cuenta con una cuenta"
    btnColor="primary"
    btnText="Si, relacionar"
    @confirm="saveRelationQuotesv2"
    @denegate="alert = false"
  >
    <template #body>
      <span class="text-center text-primary col-12">
        La cotizacion
        <span class="under">{{ infoQuotes.nombre }}</span>
        ya tiene con una cuenta asociada
      </span>
      <span class="text-center col-12"
        >¿ Desea relacionar la cotización ?
      </span>
      <span class="text-center col-12"
        >Esto quitara la relación con la otra cuenta
      </span>
    </template>
  </AlertComponent>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ViewQuotes',
});
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDivAreaMercado } from 'src/composables/useLanguage';
import { AccountStore } from '../../Accounts/store/AccountStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import GeneralDialog from 'src/modules/Quotes/components/Dialogs/GeneralDialog.vue';
import RelacionadoQuotes from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoQuotes.vue';
import { useQuotesStore } from 'src/modules/Quotes/store/QuotesStore';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { QuotesTableStore } from 'src/modules/Quotes/store/QuotesTableStore';
import LayoutQuotes from 'src/modules/Quotes/components/Dialogs/LayoutQuotes.vue';
import SendEmailQuotes from 'src/modules/Quotes/components/Dialogs/SendEmaiQuotes/SendEmailQuotes.vue';
import Notification from 'src/composables/notify';
const { userCRM } = userStore();
const { getAccountsQuotes } = AccountStore();
const props = defineProps<{
  idAccount: string;
  nameAccount: string;
}>();
const filter = ref('');
const listAMercado = ref([]);
const ActiveSqeleton = ref(false);
const documentRelation = ref([] as { [key: string]: string }[]);
const quotesStore = useQuotesStore();
const confirm = ref({
  id: '',
  stage: '' as any,
  nombre: '',
});
const dialogConfirm = ref(false);
const quotesDialogRef = ref<InstanceType<typeof GeneralDialog> | null>(null);
const relacionadoQuotesRef = ref<InstanceType<typeof RelacionadoQuotes> | null>(
  null
);
const layoutQuotesRef = ref<InstanceType<typeof LayoutQuotes> | null>(null);
const SendEmailQuotesRef = ref<InstanceType<typeof SendEmailQuotes> | null>(
  null
);
const dataOfSubPanelforQuotes = <any>ref();
const tablequotesStore = QuotesTableStore();
const { updateStageQuotesList } = tablequotesStore;
const opciones_estado = [
  { label: 'Borrador', valueE: 'Draft' },
  { label: 'Negociación', valueE: 'Negotiation' },
  { label: 'Confirmado', valueE: 'Confirmed' },
  { label: 'Rechazada', valueE: 'Not_Approved' },
  { label: 'Anulado', valueE: 'Canceled' },
];

onMounted(async () => {
  if (userCRM.iddivision == '') {
    userCRM.iddivision = 'todas';
  }
  documentRelation.value = await getAccountsQuotes(
    props.idAccount,
    userCRM.iddivision
  );
  ActiveSqeleton.value = true;
  listAMercado.value = await useDivAreaMercado(userCRM.iddivision);
  // console.log(listAMercado.value);
  //console.log(documentRelation.value.filter((v:any) => v.idamercado === '03_01').length)
});

const openwindows = (id: string) => {
  //console.log(id);
  const url = link + id;
  window.open(url, '_blank');
};

const openAlert = (idE: string, estadoE: string, nomStage: string) => {
  confirm.value = {
    id: idE,
    stage: estadoE,
    nombre: nomStage,
  };
  dialogConfirm.value = true;
};
const stageConfirm = async () => {
  relacarga.value = true;
  await updateStageQuotesList(confirm.value.id, confirm.value.stage);
  dialogConfirm.value = false;
  await reloadQuotesOpp();
  relacarga.value = false;
};
const stageCancel = async () => {
  dialogConfirm.value = false;
  await reloadQuotesOpp();
};

const createNewQuotes = async (idprospect: string) => {
  dataOfSubPanelforQuotes.value = {
    nameModule: 'Accounts',
    datInfocarQuotes: {
      name: props.nameAccount,
      iddivision: '',
      idamercado: '',
      region: '',
      idgrupocliente: '',
    },
    prospectid: '',
    prospectname: '',
    leadid: '',
    leadname: '',
    accountId: props.idAccount,
    accountName: props.nameAccount,
    contactId: '',
    contactName: '',
  };
  await quotesDialogRef.value?.openDialogQuotesTabModuleSubPanels(
    '',
    dataOfSubPanelforQuotes.value,
    'Nueva Cotización'
  );
};

const openDialogAquotes = async (id?: string) => {
  await quotesDialogRef.value?.openDialogQuotesTab(id ? id : '');
};

const reloadQuotesOpp = async () => {
  documentRelation.value = await getAccountsQuotes(
    props.idAccount,
    userCRM.iddivision
  );
};
// quotes filter =============================================================================>
const relacarga = ref(false);
const alert = ref(false);
const infoQuotes = ref();
const alertReplaceQuotes = ref(false);
const selectRelaQuotesv2 = async (item: any) => {
  if (!!item.billing_account_id) {
    alertReplaceQuotes.value = true;
  }
  infoQuotes.value = item;
  alert.value = true;
};
const saveRelationQuotesv2 = async () => {
  relacarga.value = true;
  alert.value = false;
  relacionadoQuotesRef.value?.onClose();
  await quotesStore.relaModuleQuotesStore(
    'Accounts',
    props.idAccount,
    'AOS_Quotes',
    infoQuotes.value.id
  );
  await reloadQuotesOpp();
  relacarga.value = false;
};
const openFilterQuotesv2 = async () => {
  alert.value = false;
  await relacionadoQuotesRef.value?.openDialog();
};
// ==========================================================================================>
const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.estado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.asignado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});

const seeQoutesfunction = async (item: any) => {
  await layoutQuotesRef.value?.openDialogSubPanels(
    item.id,
    item.iddivision,
    item.idamercado
  );
};

const datagest = ref();
const conver64Data = ref();
const idModuleQuotes = ref('');
const sendLayoutQuotesToEmail = async (item: any) => {
  idModuleQuotes.value = item.id;
  datagest.value = await quotesStore.getemailsTosendLayoutStore(
    item.billing_account_id,
    item.billing_contact_id
  );

  if (!!item.idamercado) {
    const hasEmail = datagest.value.some((item: any) => item.email !== '');
    if (!hasEmail) {
      Notification(
        'warning',
        'exclamation',
        '<strong> Notificación! </strong> <br/> La cuenta o el contacto asociado a la cotización no cuentan con un correo.'
      );
    }
    conver64Data.value = '';
    SendEmailQuotesRef.value?.openDialog(
      datagest.value,
      item.name,
      conver64Data.value,
      item.id,
      item.idamercado,
      item.iddivision
    );
  } else {
    Notification(
      'warning',
      'exclamation',
      '<strong> Notificación! </strong> <br/> La cotización no cuenta con un área de mercado.'
    );
  }
};

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 2000,
});

const columns: {
  name: string;
  align: string;
  label: string;
  field: string;
  sortable?: boolean;
}[] = [
  {
    name: 'numero',
    align: 'left',
    label: '#',
    field: 'numero',
    sortable: true,
  },
  {
    name: 'name',
    align: 'left',
    label: 'Nombre',
    field: 'name',
    sortable: true,
  },
  {
    name: 'etapa',
    align: 'left',
    label: 'Etapa Cotización',
    field: 'etapa',
    sortable: true,
  },
  {
    name: 'fecha_creacion',
    align: 'left',
    label: 'Fecha de creación',
    field: 'fecha_creacion',
    sortable: true,
  },
  {
    name: 'fecha_expiracion',
    align: 'left',
    label: 'Valida hasta',
    field: 'fecha_expiracion',
    sortable: true,
  },
  {
    name: 'asignado',
    align: 'left',
    label: 'Asignado a',
    field: 'asignado',
    sortable: true,
  },
  {
    name: 'monto',
    align: 'left',
    label: 'Monto',
    field: 'monto',
    sortable: true,
  },
];
const link =
  HANSACRM3_URL + '/index.php?module=AOS_Quotes&action=DetailView&record=';
const linkCreated =
  HANSACRM3_URL +
  '/index.php?module=AOS_Quotes&action=EditView&account_id=' +
  props.idAccount +
  '&account_name=' +
  props.nameAccount;
</script>
<style lang="scss" scoped>
#mapid {
  width: 700px;
  height: 600px;
}

.q-table--no-wrap th,
.q-table--no-wrap td {
  white-space: revert;
}
.under {
  text-decoration: underline;
}
</style>
