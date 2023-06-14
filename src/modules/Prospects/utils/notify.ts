import { Notify } from 'quasar';
/**
 *
 * @param type 'positive','negative','info',etc
 * @param icon 'warning','person',etc
 * @param message 'Hello Wolrd <strong> You </strong>'
 * @param time '1000' default 4000 ms
 */
const Notification = (
  type: string,
  icon: string,
  message: string,
  time = 4000 as number
) => {
  Notify.create({
    message: message,
    icon: icon,
    type: type,
    html: true,
    //position: 'bottom-right',
    timeout: time,
  });
};

export default Notification;
//'Ocurrió un error al cargar los datos <br/> <small> La petición no se realizó correctamente. <small/>'/
