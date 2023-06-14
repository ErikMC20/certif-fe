<template>
<!-- class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center" -->
    <div class="q-pa-md" >
      <div class="q-col-gutter-md row items-start">
        <div class="col-8 fit row wrap justify-center items-start content-start" >
          <q-img src="../../../assets/page-unde-construction.jpg"></q-img>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'DashboardIndex',
  setup() {
    return {
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#919191',
        width: '7px',
        opacity: '0.75'
      },
      slide: ref(1),
      fullscreen: ref(false)
    };
  }
});
</script>
