import { getEmptyContent, appendChild, createElement, makeInput, createButton } from "./helper.js";

export class Register{

    rerender = (val, vale)=>{
        console.log("no override here :D")
    };

    constructor(callback) {
        this.rerender = callback;
    }
  
    loadPage(){
        var c = getEmptyContent(".contentContainer");
        var feeldSet = this.getFeeldSet();
        appendChild(c, [feeldSet]);
    }

    getFeeldSet(){
        var form = createElement("from", "content");
        var div = createElement("div", "inputfield");
        var h3Title = createElement("h3", "title_h3");
        h3Title.innerText = "Register here";
        appendChild(form, [h3Title, div]);

        const inputName = makeInput("text", "userId" , "User ID (=8 Char)", 8); 
        const brk = createElement("br");
        const inputPassword = makeInput("password", "password", "Password (>5 Char)", 5);
        const inputPasswordRepeat = makeInput("password", "password", "Repeat Password", 5)
        appendChild(div, [inputName, brk, inputPassword, inputPasswordRepeat]);
    
        var divButton = createElement("div", "submitbutton");
        var btn = createButton("btn", "register", "REGISTER");

        btn.setAttribute("disabled", "");
        
        const btnEnabler = ()=>{
            btn.disabled = !inputName.reportValidity() || !inputPassword.reportValidity() || (inputPassword.value !== inputPasswordRepeat.value);
            //btn.removeAttribute("disabled");
        };
    
        inputName.addEventListener("input", btnEnabler);
        inputPassword.addEventListener("input", btnEnabler);
    
        btn.addEventListener("click", ()=>{
          this.pageRegisterSent(inputName.value, inputPassword.value);
        }); 

        appendChild(divButton, [btn])
        appendChild(form, [divButton]);
        return form;
    }

    pageRegisterSent(name, pw){
        this.rerender(1, undefined);
    }
  } 