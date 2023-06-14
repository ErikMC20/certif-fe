import { ref } from 'vue'
import { coords } from './models'; //*definition of types TS
export function useGeolocation() {
    const coords = ref<coords>({ latitude: 0, longitude: 0 })
    const isSupported = 'navigator' in window && 'geolocation' in navigator

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
      
    function success(pos: { coords: any; }) {
    const crd = pos.coords;
    
    console.log('Your current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('More or less ' + crd.accuracy + ' meters.');
    };
    
    function error(err: any) {
        console.error(err);
    };
    
    navigator.geolocation.getCurrentPosition(success, error, options);


    // const data = navigator.geolocation.getCurrentPosition(
    //     position => (coords.value = position.coords),
    //     ( err ) =>{
    //         console.log(err);
    //         console.log('No Capture la posición GPS');
    //     }
    // )
    // console.log('aqui');
    // console.log(data);
    

    // let watcher: number | null = null
    // onMounted(() => {
    //     if (isSupported)
    //     console.log(isSupported);
    //     console.log('si');
    //         watcher = navigator.geolocation.watchPosition(
    //             position => (coords.value = position.coords)
    //         )
    //         console.log(watcher);
    // })
    // onUnmounted(() => {
    //     if (watcher) navigator.geolocation.clearWatch(watcher)
    // })

    return { coords, isSupported }
}