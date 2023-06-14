import io from 'socket.io-client';
export const conectarSocket = async ():Promise<void> => {
    //const socket = io(`${process.env.BACKEND_SOCKET_URL}`,{
    io(`${process.env.CRM4_BN_01}`,{
        'extraHeaders' : {
            'x-token': localStorage.getItem('token') || ''
        }
    });
}