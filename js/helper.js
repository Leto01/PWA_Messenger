export function createElement(type, classname, doc) {
  var temp = document.createElement(type);
  if (classname) {
    var cnames = classname.split(" ");
    cnames.forEach((c) => {
      temp.classList.add(c);
    });
  }
  return temp;
}

export function appendChild(parent, child) {
  if (child) {
    child.forEach((n) => {
      parent.appendChild(n);
    });
  }
  return parent;
}

export function getEmptyContent(selector) {
  var c = document.querySelector(selector);
  c.innerHTML = "";
  return c;
}

export function makeInput(t, n, ph, minLen) {
  const input = createElement("input");
  ph ? (input.placeholder = ph) : undefined;
  t ? (input.type = t) : undefined;
  n ? (input.name = n) : undefined;
  //input.minlength = minLen;
  // input.required;
  // minLen ? input.setAttribute("minlength", minLen) : undefined;
  // input.setAttribute("required", "");
  return input;
}

export function createButton(className, name, textContent) {
  var b = createElement("button", className);
  b.name = name;
  b.innerText = textContent;
  return b;
}

export function createHeadder(children) {
  var header = createElement("header");
  appendChild(header, [children]);
  return header;
}

export const ENUM_SET = {
  COOKIE_SET: {
    token: "token",
    username: "userName",
    hash: "hash",
    state: "state",
    theme: "theme",
    userId: "uid"
  },
  THEMES:{
    dark: 0,
    light: 1
  },
  STATES: {
    Login: 1,
    Register: 2,
    Chat: 3,
    falsyToken: 456
  },
};

export const colorMap = {
  1:"#dfff1a",
  2:"#e8c80e",
  3:"#ffb31c",
  4:"#e86d0e",
  5:"#ff3912",
  6:"#6dfe01",
  7:"#e8d60e",
  8:"#e8590e",
  9:"#ffc95e",
  10:"#eb936e",
  11:"#fe8bb6"
}

const MAX_COLOR_ID = 11;
let mapedHash = [];

export const getColorOfUserhash = (hash) =>{
  let res = "color:";
  let lastMap = 0;
  for(let h of mapedHash){
    if(h.hash === hash) return res + colorMap[h.id] + ";";
    lastMap = h.id;
  }
  if (lastMap >= MAX_COLOR_ID) lastMap = 0;
  const newEntry = {hash:hash, id: (lastMap+1)};
  mapedHash.push(newEntry);
  return res + colorMap[newEntry.id] + ";";
}

export function switchTheme(e) {
  document.getElementsByTagName("body")[0].classList.toggle("lightTheme")
}
