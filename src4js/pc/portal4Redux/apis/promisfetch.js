export default function promiseFetch(url, param, method) {
  let type = "POST";
  if (method) {
    type = method;
  }
  let bodyObject = {
    method: type,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "X-Requested-With": "XMLHttpRequest"
    },
    credentials: "include",
  }
  if (url.indexOf("?") != -1) {
    url += "&" + Math.random()
  } else {
    url += "?" + Math.random()
  }
  if (type.toUpperCase() == "POST") {
    let paramStr = "";
    for (let key in param) {
      paramStr += key + "=" + param[key] + "&";
    }
    paramStr = paramStr.substring(0, paramStr.length - 1);
    bodyObject.body=paramStr
  }

  return new Promise((resolve, reject)=> {
    fetch(url, bodyObject).then((response) => {
      if (response.ok) {
          response.text().then((result) =>{
            let data = result.trim()
            if(data.indexOf("{") == 0  || data.indexOf("[") == 0){
              try{
                data = JSON.parse(data)
              }catch(e){
                data = result.trim()
              }
            }
            resolve(data)
          });
      } else {
        return reject("请求异常：" + response.statusText + "，请求URL：" + url);
      }
    }).catch((e) => {
      return reject("请求异常：" + e.statusText + "，请求URL：" + url);
    });
  })
}

window.promiseFetch = promiseFetch;