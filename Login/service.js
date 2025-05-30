function apiUser(path, method = "GET", body = null) {
    const url = "http://localhost:8080/api/users/" + path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }
    
    return fetch(url, options);
}

export async function login(loginRequest){
    try{


        let response= await apiUser(`login`,"POST",loginRequest)


        let data= await response.json();


        return {
            status: response.status,
            success:true,
            body: data

       };

   }catch(err){

       return { success: false, message: err };
   }
}

export async function register(userRequest){
    try{


        let response= await apiUser(`register`,"POST",userRequest);
        let data= await response.json();


        return {
            status: response.status,
            body: data

       };

   }catch(err){

       return { success: false, message: err };
   }
}