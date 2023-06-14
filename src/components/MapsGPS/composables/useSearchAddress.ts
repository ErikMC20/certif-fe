
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { computed } from 'vue';
const provider = new OpenStreetMapProvider();


export const userComposable = () => {

  // searchTerm: computed({
  //   get() {
  //     return debouncedValue.value;
  //   },
  //   set(val) {

  //     if ( debounceTimeout.value ) clearTimeout( debounceTimeout.value );
      
  //     debounceTimeout.value = setTimeout(async () => {
  //       debouncedValue.value = val;
  //       console.log('lo que escribi');
  //       console.log(val);
  //       const results = await provider.search({ query: val });
  //       console.log('resultado');
  //       console.log(results);
  //       //searchPlacesByTerm( val );
  //     }, 2000 );
  //   }
  // }),

  // const filterAddress = (val: string, update: (arg0: () => void) => void) => {
  //   setTimeout(() => {
  //     console.log('entre');
  //     update(() => {
  //       if (val === '') {
  //         options2.value = stringOptions;
  //       } else {
  //         const needle = val.toLowerCase();
  //         options2.value = stringOptions.filter(
  //           (v: string) => v.toLowerCase().indexOf(needle) > -1
  //         );
  //       }
  //     });
  //   }, 1500);
  // };
  // return {
      
  // };
};
  