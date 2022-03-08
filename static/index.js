let article=document.querySelector('article');
let src="http://192.168.0.102:3000/api/attractions/";
const data = 
fetch(src, {method:'get'}).then(function(response){
    return response.json();
});

data.then(function(jsonobj){
    for (let i=0; i<13; i++){
    let list=jsonobj.data;
    let myfigure=document.createElement('figure');
    let myimg=document.createElement('img');
    let myfigcaption=document.createElement('figcaption');
    let divName=document.createElement('div');
    divName.className='name';
    let divFig1=document.createElement('div');
    divFig1.className='figcaption1';
    let divMrt=document.createElement('div');
    divMrt.className='mrt';
    let divCategory=document.createElement('div');
    divCategory.className='category';
    myimg.src=list[i].images[0];
    divName.textContent=list[i].name;
    divMrt.textContent=list[i].mrt;
    divCategory.textContent=list[i].category;
    divFig1.appendChild(divMrt);
    divFig1.appendChild(divCategory);
    myfigcaption.appendChild(divName);
    myfigcaption.appendChild(divFig1);
    myfigure.appendChild(myimg);
    myfigure.appendChild(myfigcaption);
    article.appendChild(myfigure);
    };
});