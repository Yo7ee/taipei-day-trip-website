// let article=document.querySelectorAll('article');
let src="http://3.224.188.5:3000/api/attractions";
const data=fetch(src).then(function(response){
    return response.json();
});
console.log(data)
data.then(function(jsonobj){
    let list=jsonobj.data;
    for (let i=0; i<12; i++){
        let myfigure=document.createElement('figure');
        let myimg=document.createElement('img')
        let myfigcaption=document.createElement('figcaption')
    }
})