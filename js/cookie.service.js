export function setNewCookie(key, value, expireInDays) {
  var d = "";
  const date = new Date();
  if(expireInDays){
  date.setTime(date.getTime() + (expireInDays * 24*60*60*1000));
  d = "expires=" + date.toUTCString();}
  document.cookie = `${key}=${value}` + (expireInDays ? ";" + d + ";path=/" : "");
}

export function setSessionCookie(key, value){
  setNewCookie(key, value);
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
