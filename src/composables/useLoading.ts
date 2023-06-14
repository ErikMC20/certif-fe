/*
 * @params message
 * @params boxClass
 * @params spinnerColor
 * @params backgroundColor
 * @params spinner
 */
import {
  Loading,
  QSpinnerBars,
  QSpinnerFacebook,
  QSpinnerGears,
  QSpinnerPuff,
} from 'quasar';
import { base } from 'src/modules/Projects/utils/types';

const selectSpinner = (spinner: string) => {
  const spinners = [
    { name: 'gears', element: QSpinnerGears },
    { name: 'puff', element: QSpinnerPuff },
    { name: 'facebook', element: QSpinnerFacebook },
    { name: 'bars', element: QSpinnerBars },
  ];
  return '';
};

//TODO loagind global functions
export const showLoading = (spinner: string) => {
  console.log('por hacer');
};

export const hideLoading = () => {
  Loading.hide();
};
