let article=document.querySelector('article');
let nextPage=0;
let src="http://192.168.0.102:3000/api/attractions?page="+nextPage;
const data = 
fetch(src, {method:'get'}).then(function(response){
    return response.json();
});

data.then(function(jsonobj){
    nextPage=jsonobj.nextPage
    console.log("first fetch")
    for (let i=0; i<12; i++){
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

// 先定義什麼情況會觸發scroll reload function=>when scroll down to bottom which detect by xxx, pageNumber取得from json nextPage
// 1.check網頁已經loading結束by DOMCOntentLoaded
// 2.網頁loading完成觸發scroll

//從第一次fetch取得nextpage
window.addEventListener("scroll",function(){
    console.log("first"+nextPage)
    let scrollTop=document.documentElement.scrollTop; //把畫面scroll多少距離消失在螢幕
    let scrollHeight=document.documentElement.scrollHeight; //畫面比例調到最小時，整個頁面的高度
    let scrollClient=document.documentElement.clientHeight; //正常比例下，頁面的高度
    console.log("scroll check:"+scrollClient);
    //此方法可能會有問題，如果scrolltop非整數時
    if(scrollHeight-scrollTop==scrollClient && document.readyState== "complete"){
        console.log("check scroll down and complete load")
        let freshSrc="http://192.168.0.102:3000/api/attractions?page="+nextPage;
        if (typeof(nextPage)=="number"){
            const refreshData=
            fetch(freshSrc, {method:'get'}).then(function(response){
                return response.json();
            });
            // Object.keys(freshData).length is the way to get th length of JSON size
            refreshData.then(function(jsonobj){
                nextPage=jsonobj.nextPage
                console.log("second"+nextPage)
                for (let i=0; i<jsonobj.data.length; i++){
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
        }else{return window.event=false};//如果不行，改試return document.event.returnValue=false，此為終止已經被觸發的document事件
    };
});