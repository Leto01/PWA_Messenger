export function createElement(type, classname, doc){
    var temp = document.createElement(type);
    if(classname){
        var cnames = classname.split(' ');
        cnames.forEach(c=>{
            temp.classList.add(c);
        });
    }
    return temp;
}

export function appendChild(parent, child){
    if(child){
        child.forEach(n=>{
            parent.appendChild(n);
        });
    }
    return parent;
}

export function getEmptyContent(selector){
    var c = document.querySelector(selector);
    c.innerHTML = "";
    return c;
}

export function makeInput(t, n, ph, minLen){
    const input = createElement("input");
    input.placeholder = ph;
    input.type = t;
    input.name = n;
    //input.minlength = minLen;
    // input.required;
    input.setAttribute("minlength", minLen);
    input.setAttribute("required", "");
    return input;
}

export function createButton(className, name, textContent){
    var b = createElement("button", className);
    b.name = name;
    b.innerText = textContent;
    return b;
}