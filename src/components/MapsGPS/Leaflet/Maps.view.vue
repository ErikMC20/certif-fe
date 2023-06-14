<template>
  <!-- <q-card class="my-card">
    <q-card-section id="mapleaft" style="height: 400px; min-width: 350px">
    </q-card-section>
  </q-card> -->
  <div id="mapleaft" style="height: 400px; min-width: 400px"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeMount, ref } from 'vue';
import { api } from 'boot/axios';
import L from 'leaflet';
import './leaflet.scss';
import { useGeolocation } from '@vueuse/core';
const { coords } = useGeolocation();

export default defineComponent({
  name: 'MapComponentLeaflet',
  emits: ['insert'],
  props: {
    lat: {
      type: Number,
      required: false,
      default: 0,
    },
    lng: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  setup(props, { emit }) {
    //*DATA MAPA
    const latitudeM = ref(0);
    const longitudeM = ref(0);
    const isSupported = 'navigator' in window && 'geolocation' in navigator;
    //const map = ref()

    //* INSTANCIAMOS EL MAPA EN EL DIV
    const map = '';
    onMounted(() => {
      setTimeout(() => {
        const viewMap = (lat: number, lng: number) => {
          let map = L.map('mapleaft').setView([lat, lng], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          var marker = L.marker([lat, lng], {
            draggable: true,
            title: 'Mi ubicación actual',
            opacity: 0.75,
          })
            .addTo(map)
            .bindPopup('<p1><b>Mi ubicación actual.</p1>')
            .openPopup();

          //*PERMITE ARRASTRAR CAPTURAR EL PUNTO
          marker.on(
            'dragend',
            async (e: {
              target: {
                target: string;
                getLatLng(): { lat: number; lng: number };
                setLatLng(value: L, option?: { [key: string]: string }): string;
                setPopupContent(value: string): void;
                update(): void;
                openPopup(): void;
              };
            }) => {
              var marker = e.target;
              var position = marker.getLatLng();
              marker.setLatLng(new L.LatLng(position.lat, position.lng), {
                draggable: 'true',
              });
              map.panTo(new L.LatLng(position.lat, position.lng));

              marker.setPopupContent(
                'GPS coordinates: ' +
                  position.lat +
                  ', ' +
                  position.lng +
                  '<br />Searching for the address...'
              );
              marker.update();
              marker.openPopup();
              const result = await api.get(
                `${process.env.STREETMAP}/reverse?format=json&addressdetails=0&zoom=18&lat=${position.lat}&lon=${position.lng}`
              );
              const { display_name } = result.data;
              marker.setPopupContent(display_name);
              marker.update();

              //*INSERTAMOS LA DATA DE LAT y LNG
              latitudeM.value = position.lat;
              longitudeM.value = position.lng;
              emit('insert', {
                direction: display_name,
                latitude: latitudeM.value,
                longitude: longitudeM.value,
              });
            }
          );

          //* PARA LLEVAR EL MAPA HASTA MIS COORDENADAS
          if (map) {
            map.flyTo([lat, lng], 13);
          }

          //*CAPTURA LA LATITUD Y LONGITUD DEL MAPA
          let mapClickCount = 0;
          map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
            mapClickCount = 1;
            //*INSERTAMOS LA DATA DE LAT y LNG
            latitudeM.value = e.latlng.lat;
            longitudeM.value = e.latlng.lng;
            setTimeout(async () => {
              if (mapClickCount === 1) {
                map.removeLayer(marker);
                marker = L.marker(e.latlng, {
                  draggable: true,
                  title: 'Mi ubicación actual',
                  opacity: 0.75,
                }).addTo(map);
                marker.on(
                  'dragend',
                  async (e: {
                    target: {
                      target: string;
                      getLatLng(): { lat: number; lng: number };
                      setLatLng(
                        value: L,
                        option?: { [key: string]: string }
                      ): string;
                      setPopupContent(value: string): void;
                      update(): void;
                      openPopup(): void;
                    };
                  }) => {
                    var marker = e.target;
                    var position = marker.getLatLng();
                    marker.setLatLng(new L.LatLng(position.lat, position.lng), {
                      draggable: 'true',
                    });
                    map.panTo(new L.LatLng(position.lat, position.lng));

                    marker.setLatLng(position);
                    marker.setPopupContent(
                      'GPS coordinates: ' +
                        position.lat +
                        ', ' +
                        position.lng +
                        '<br />Searching for the address...'
                    );
                    marker.update();
                    marker.openPopup();
                    map.panTo(position);
                    const result = await api.get(
                      `${process.env.STREETMAP}/reverse?format=json&addressdetails=0&zoom=18&lat=${position.lat}&lon=${position.lng}`
                    );
                    const { display_name } = result.data;
                    marker.setPopupContent(display_name);
                    marker.update();

                    //*INSERTAMOS LA DATA DE LAT y LNG
                    latitudeM.value = position.lat;
                    longitudeM.value = position.lng;
                    emit('insert', {
                      direction: display_name,
                      latitude: latitudeM.value,
                      longitude: longitudeM.value,
                    });
                  }
                );
                mapClickCount = 0;
                marker.bindPopup(e.latlng.lat, e.latlng.lng);

                //*BUSCA EL NOMBRE DE LA LOCALIZACION OSEA LA DIRECCION
                marker.setLatLng(e.latlng);
                marker.setPopupContent(
                  'GPS coordinates: ' +
                    e.latlng.lat +
                    ', ' +
                    e.latlng.lng +
                    '<br />Searching for the address...'
                );
                marker.update();
                marker.openPopup();
                map.panTo(e.latlng);
                const result = await api.get(
                  `${process.env.STREETMAP}/reverse?format=json&addressdetails=0&zoom=18&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
                );
                const { display_name } = result.data;
                console.log(
                  display_name.split(',').at(-1),
                  display_name.split(',').at(-2),
                  display_name.split(',').at(-3),
                  display_name.split(',').at(-4)
                );
                marker.setPopupContent(display_name);
                marker.update();

                //*INSERTAMOS LA DATA DE LAT y LNG
                latitudeM.value = e.latlng.lat;
                longitudeM.value = e.latlng.lng;
                //this.$emit("enviarMensaje", this.mensajeChat);
                emit('insert', {
                  direction: display_name,
                  latitude: latitudeM.value,
                  longitude: longitudeM.value,
                });
              }
            }, 250);
          });
        };

        if (isSupported) {
          latitudeM.value = props.lat != 0 ? props.lat : coords.value.latitude;
          longitudeM.value =
            props.lng != 0 ? props.lng : coords.value.longitude;
          viewMap(latitudeM.value, longitudeM.value);
          //viewMap(coords.value.latitude, coords.value.longitude);
        }
      }, 250);
    });

    //*DEMOSTANDO EL MAPA
    onBeforeMount(() => {
      if (map) {
        //map.remove();
        latitudeM.value = 0;
        longitudeM.value = 0;
      }
    });

    return {
      //*DATA
      latitudeM,
      longitudeM,
      isSupported,
    };
  },
});
</script>
