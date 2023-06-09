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
  minLen ? input.setAttribute("minlength", minLen) : undefined;
  input.setAttribute("required", "");
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
    state: "state"
  },
  STATES: {
    Login: 1,
    Register: 2,
    Chat: 3,
    falsyToken: 456
  },
};
