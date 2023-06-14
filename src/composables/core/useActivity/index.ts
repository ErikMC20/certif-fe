import { ref } from 'vue';
export function useActivity() {
  const hours = ref([] as string[]);

  const generateHours = () => {
    for (let index = 6; index <= 23; index++) {
      let minutos = 0;
      for (let index2 = 0; index2 < 4; index2++) {
        if (index2 <= 0) {
          if (index > 9) {
            hours.value.push(index + ':00');
          } else {
            hours.value.push('0' + index + ':00');
          }
        } else {
          minutos = minutos + 15;
          if (index > 9) {
            hours.value.push(index + ':' + minutos);
          } else {
            hours.value.push('0' + index + ':' + minutos);
          }
        }
      }
    }
  };

  (() => {
    generateHours();
  })();

  return {
    hours,
  };
}
