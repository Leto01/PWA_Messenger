import { appendChild, createElement, getEmptyContent, makeInput, createButton } from "./helper.js";

export class Login {

  constructor(rerender){
    this.rerender = rerender;
  }

  loadPage(err){
    var c = getEmptyContent(".contentContainer");
    var feeldSet = this.getFeeldSet();
    if(err){
      var errorMsg = createElement("div");
      errorMsg.innerHTML = err;
      c.appendChild(errorMsg);
    }
    appendChild(c, [feeldSet]);
  }

  getFeeldSet(){
    var form = createElement("form", "content");
    var div = createElement("div", "inputfield"); 
    var h2Title = createElement("h2", "title_h2");
    h2Title.innerText = "P-WAM, I gues?"
    appendChild(form, [h2Title, div]);

    const inputName = makeInput("text", "userId" , "User ID (=8 Char)", 8); 
    const brk = createElement("br");
    const inputPassword = makeInput("password", "password", "Password (>5 Char)", 5);
    appendChild(div, [inputName, brk, inputPassword]);

    var divButton = createElement("div", "submitbutton");
    var btn = createButton("btn", "login", "LOGIN");
    var regBtn = createButton("btn", "register", "REGISTER")
    btn.setAttribute("disabled", "");

    const btnEnabler = ()=>{
        btn.disabled = !inputName.reportValidity() || !inputPassword.reportValidity();
        //btn.removeAttribute("disabled");
    };


    inputName.addEventListener("input", btnEnabler);
    inputPassword.addEventListener("input", btnEnabler);

    btn.addEventListener("click", ()=>{
      this.pageLoginSent(inputName.value, inputPassword.value);
    });

    regBtn.addEventListener("click", this.onRegister);

    appendChild(divButton, [btn, regBtn]);
    appendChild(form, [divButton]);

    return form;
  }

  pageLoginSent(pw, id){
    this.rerender(1, "I am a test error");
  }

  onRegister(){
    console.log("rerender!")
    this.rerender(2, undefined);
  }
} 