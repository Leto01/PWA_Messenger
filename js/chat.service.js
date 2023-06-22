const BASE_URL = "https://www2.hs-esslingen.de/~melcher/map/chat/api/index.php";
const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: ""
};

const makeFetch = async (body) => {
    requestOptions.body = JSON.stringify(body);
    return fetch(BASE_URL, requestOptions);
}

export async function login(userid, password) {
  const body = {
    request: "login",
    userid: userid,
    password: password,
  };
  return await makeFetch(body);
}

export async function logout(token) {
  const body = JSON.stringify({
    request: "logout",
    token: token,
  });
  return await makeFetch(body);
}

export async function register(id, pw, nickname, fullname) {
  const body ={
    request: "register",
    userid: id,
    password: pw,
    nickname: nickname,
    fullname: fullname,
  };
  return await makeFetch(body);
}

export async function deregister(uid, token) {
  const body ={
    request: "deregister",
    userid: uid,
    token: token,
  };
  return await makeFetch(body);
}

export async function sendmessage(msg, token) {
  const body = {
    request: "sendmessage",
    token: token,
    text: msg,
  };
  return await makeFetch(body);
}

export async function sendPicture(msg, img, token){
  const body = {
    request: "sendmessage",
    token: token,
    text: msg,
    photo: img
  }
  return await makeFetch(body);
}

export async function fetchmessage(token) {
  const body = {
    request: "fetchmessages",
    token: token,
  };
  return makeFetch(body);
}

export async function fetchPhoto(photoId, token){
  const body = {
    request: "fetchphoto",
    token: token,
    photoid: photoId 
  }
  requestOptions.body = JSON.stringify(body);
  const customHeaderForBlob = {...requestOptions
  };

  return fetch(BASE_URL, customHeaderForBlob);
}