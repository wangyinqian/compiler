function getFile(path){ 
    return fetch(path,{method:"get"})
           .then(response=>response.text())
           .catch(err=>console.log(err)); 
}

class BarGraph {
    constructor(selector){ this.init(selector); }
    init(selector){
        getFile("../barGraph/Json/index.json")
        .then(text=>{
            const ele = this.query(selector),config = JSON.parse(text),html = ele.outerHTML;
                  
            let data = {};
            
            const newStr = html.replace(/<[\w]+[\s\w="':\-.;{}]*>[{}.\w]*|<\/[\w]+>/g,n=>{
                   if(!data.isFor){ return this.repalceExpression(n,"",config,data); }
                   else
                   { 
                     if(n.indexOf(data.tag) == -1)
                     { 
                         data.fragment = (data.fragment || "") + n; return ""; 
                     } 
                     else
                     {
                          const list = config[data.target],len = Array.isArray(list) ? list.length : Object.keys(list).length;

                          let str = "";
                        
                          for(let i = 0;i<len;i++)
                          {
                              str = str + this.repalceExpression(data.fragment,data.keyName,list[i]);
                          }

                          return data = {},str;
                     }
                    
                   }       
            });
           
            ele.outerHTML = newStr;
        })
        
    }
    repalceExpression(str,itemName,data,config){
   
        return str.replace(/m:([\w]+)="([{\s.\w}:;]*)"|{([\s.\w]*)}/g,(n,name,key,key1,i,m)=>{
            if(name == "for")
            {
                const value = key.split(" ");

                config.isFor = true,config.keyName = value[0],config.target = value[2],config.tag = m.substring(1,m.indexOf(" "));

                return "";
            }
            else
            {   
                if(name == "style")
                {
                    if(key.charAt(0) == "{")
                    {
                        const obj = this.getValue(data,key.slice(1,-1),itemName);

                        return `${name}="${Object.keys(obj).map(e=>{ 
                                    const pro = /[A-Z]{1}/.test(e) ? e.replace(/[A-Z]/g,n=>`-${n.toLowerCase()}`) : e;
    
                                    let value = obj[e];
    
                                    if(typeof value == "number"){ value = value + "px"; }
    
                                    return `${pro}:${value};`;
                                
                                }).join("")}"`
                    }
                    else{ return `${name}="${key.replace(/{([\w.\s]*)}/g,(n,key)=>this.getValue(data,key,itemName))}"` }
                   
                }
                else{ return key ? key.replace(/{([\s.\w]*)}/,(n,key)=>this.getValue(data,key,itemName)) : this.getValue(data,key1,itemName); }  
            }
        })
    }
    getValue(data,key,itemName){
        if(key)
        {
            if(key != itemName)
            {
                if(itemName){ key = key.substring(key.indexOf(".") + 1); }
    
                if(key.indexOf(".") != -1)
                {
                    let keys = key.split("."),value = "";
    
                    for(let i = 0,len = keys.length;i<len;i++)
                    {
                        value = value ? value[keys[i]] : data[keys[i]];
                    }
                   
                    return value;
                }
    
                return data[key];
            }
    
            return data;  
        }
        
        return "";
    }
    query(selector){
        if(typeof selector == "string")
        {
            return document.querySelector(selector)
        }
        else
        {
            return selector;
        }
    }
    innerStyle(value){
        const _styleValue = Object.keys(value).map(e=>{
                const _val = value[e]; 
                
                return `${e}:${typeof _val != "number" ? _val : _val + "px"}`

             }).join(";")

        return `style = "${_styleValue}"`;
    } 
   
}

new BarGraph(".bar-graph");