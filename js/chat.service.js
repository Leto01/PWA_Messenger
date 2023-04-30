const BASE_URL = 'https://www2.hs-esslingen.de/~melcher/map/chat/api/'
const query = "request=test"
const token = "s";

export async function login (userid, password) {
    const body = JSON.stringify({
        request: 'login',
        userid: userid,
        password: password
      });
    return await fetch(BASE_URL, body);
}

export async function logout (token) {
    const body = JSON.stringify({
        request: 'logout',
        token: token
      });
    return await fetch(BASE_URL, body);
}

export async function register (id, pw, nickname, fullname) {
    const body = JSON.stringify({
        request: 'register',
        userid: id,
        password: pw,
        nickname: nickname,
        fullname: fullname
      });
    return await fetch(BASE_URL, body);
}

export async function deregister (token) {
    //TODO
    const body = JSON.stringify({
        request: 'deregister',
        token: token
      });
    return await fetch(BASE_URL, POST);
}

export async function sendmessage (msg, token) {
    const body = JSON.stringify({
        request: 'sendmessage',
        token: token,
        text: msg
      });
    return await fetch(BASE_URL, body);
}

export async function fetchmessage (token) {
    const body = JSON.stringify({
        request: 'fetchmessages',
        token: token
      });
    return await fetch(BASE_URL, body);
}