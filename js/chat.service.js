const BASE_URL = "https://www2.hs-esslingen.de/~melcher/map/chat/api/index.php";
const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: ""
};

const makeFetch = async (body) => {
    requestOptions.body = JSON.stringify(body);
    return await fetch(BASE_URL, requestOptions);
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

export async function deregister(token) {
  //TODO
  const body ={
    request: "deregister",
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

export async function fetchmessage(token) {
  const body = {
    request: "fetchmessages",
    token: token,
  };
  return await makeFetch(body);
}