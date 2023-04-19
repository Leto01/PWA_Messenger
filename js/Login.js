function pageLogin(c, err) {
  // var c = this.getEmptyContent();
  var feeldSet = this.pageLoginFeeldSet();
  if (err) {
    var errorMsg = this.createElement("div");
    errorMsg.innerHTML = err;
    c.appendChild(errorMsg);
  }
  return [c, [feeldSet]];
}

function pageLoginFeeldSet() {
  var form = this.createElement("form", "content");
  var div = this.createElement("div", "inputfield");
  this.appendChild(form, [div]);

  const inputName = this.makeInput("text", "userId", "User ID (>5 Char)", 5);
  const brk = this.createElement("br");
  const inputPassword = this.makeInput(
    "password",
    "password",
    "Password (>5 Char)",
    5
  );

  this.appendChild(div, [inputName, brk, inputPassword]);

  var divButton = this.createElement("div", "submitbutton");
  var btn = this.createButton("btn", "login", "LOGIN");

  btn.setAttribute("disabled", "");

  const btnEnabler = () => {
    btn.disabled =
      !inputName.reportValidity() || !inputPassword.reportValidity();
    //btn.removeAttribute("disabled");
  };
  inputName.addEventListener("input", btnEnabler);
  inputPassword.addEventListener("input", btnEnabler);

  btn.addEventListener("click", () => {
    this.pageLoginSent(inputName.value, inputPassword.value);
  });

  this.appendChild(divButton, [btn]);
  this.appendChild(form, [divButton]);

  return form;
}

