import { Notify } from 'quasar';
/**
 *
 * @param type 'positive','negative','info'
 * @param icon 'warning','person',etc
 * @param message 'Hello Wolrd or <strong> Hello World </strong>'
 * @param time '1000' default 4000 ms
 * @param position 'bottom-right'
 */
const Notification = (
  type: string,
  icon: string,
  message: string,
  time = 4000 as number,
  position?: 'top-left' | 'bottom-right'
) => {
  Notify.create({
    message: message,
    icon: icon,
    type: type,
    html: true,
    position: position || 'bottom-right',
    timeout: time,
  });
};

export default Notification;
//'Ocurrió un error al cargar los datos <br/> <small> La petición no se realizó correctamente. <small/>'/
