const BASE_URL = 'https://www2.hs-esslingen.de/~melcher/map/chat/api/?'
const query = "request=test"
const POST = {method: "POST"};
const token = "s";

export async function register (userid, password, nickname, fullname) {
    //TODO
    query = `userid=${userid}&password=${password}`; 
    return await fetch(BASE_URL + query, POST);
}

export async function login (userid, password) {
    query = `userid=${userid}&password=${password}`; 
    return await fetch(BASE_URL + query, POST);
}

export async function logout () {
    query = `token=${token}`; 
    return await fetch(BASE_URL + query, POST);
}

export async function deregister () {
    //TODO
    query = `userid=${userid}&password=${password}`; 
    return await fetch(BASE_URL + query, POST);
}

export async function sendmessage (text) {
    //TODO
    query = `userid=${userid}&password=${password}`; 
    return await fetch(BASE_URL + query, POST);
}

export async function fetchmessage (userid, password) {
    //TODO
    query = `userid=${userid}&password=${password}`; 
    return await fetch(BASE_URL + query);
}