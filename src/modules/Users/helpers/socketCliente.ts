import io from 'socket.io-client';
export const conectarSocket = async ():Promise<void> => {
  const socket = io(`${process.env.CRM4_BN_01}`,{
    'extraHeaders' : {
        'x-token': localStorage.getItem('token') || ''
    }
  });

  socket.on('connect', () => {
    console.log('Sockets online');
  });

  socket.on('disconnect', () => {
    console.log('Sockets offline');
  });

  socket.on('usuarios-activos', (payload) => {
    console.log(payload);
  })
  
  socket.on('usuario-offline', (payload) =>{
    console.log(`El usuario: ${payload.nombres} ${payload.apellidos} se fue`);
  })
  
  // socket.on('mensajeprivado', (payload) =>{
  //   console.log(`te envio un mensaje ${payload.saludo}`);
  // })
}