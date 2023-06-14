import decode from 'jwt-decode';

export const compareToken = (iduser:string, token:string) =>{
    const { data } : { data:{id:string} }= decode(token);
    const { id   } : { id:string } = data;
    if(id === iduser){
        return true;
    }else{
        return false;
    }
}
