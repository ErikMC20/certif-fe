<template>
  <div>
    <q-markup-table v-if="loading && $q.platform.is.desktop">
      <thead>
        <tr>
          <th class="text-left">
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
        <tr v-for="n in 12" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <template v-if="(loading && $q.screen.sm) || $q.screen.xs">
      <div class="row">
        <div
          class="col-xs-12 col-sm-6 col-md-6 col-lg-6"
          v-for="n in 10"
          :key="n"
        >
          <q-card class="q-ma-sm">
            <q-item>
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="QInput" class="q-mb-md" />
                  <q-skeleton type="QInput" class="q-mb-md" />
                  <q-skeleton type="QInput" class="q-mb-md" />
                  <q-skeleton type="QInput" class="q-mb-md" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps(['loading']);
</script>
