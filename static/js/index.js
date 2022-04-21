let article=document.querySelector('article');
let keyword=document.querySelector("input").value;
let nextPage=0;
let list={};

//檢查會員登入狀態流程
checkStatus();
showLoading();

showAttratiion();

async function showAttratiion(){
    let refreshData = await getAttractions();
    await createAttraction(refreshData);
    hideLoading();
}

async function getAttractions(){
    let src="/api/attractions/?page="+nextPage+"&keyword="+keyword;
    const response = await fetch(src, {method:'get'});
    const result = await response.json();
    return result;
    };


function createAttraction(refreshData){
    list=refreshData.data;
    hideLoading();
    nextPage=refreshData.nextPage
    for (let i=0; i<refreshData.data.length; i++){
    let list=refreshData.data;
    let myfigure=document.createElement('figure');
    let a=document.createElement('a')
    let id=list[i].id;
    a.href='/attraction/'+id
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
    a.appendChild(myfigure)
    article.appendChild(a);
    };
}

//當使用者執行滾軸轉動至底底部時，載入更多資料，使用throttle讓fetch不會在還沒執行完畢就又被觸發
let throttleTimer;
function throttle(callback, time){
    if (throttleTimer) return;
    throttleTimer = true;
    setTimeout(() => {
        callback();
        throttleTimer = false;
    }, time);
};

window.addEventListener("scroll",() => {throttle(scrollLoadMore,250);});
async function scrollLoadMore(){
    let scrollTop=document.documentElement.scrollTop; //把畫面scroll多少距離消失在螢幕
    let scrollHeight=document.documentElement.scrollHeight; //畫面比例調到最小時，整個頁面的高度
    let scrollClient=document.documentElement.clientHeight; //正常比例下，頁面的高度
    if(scrollHeight-scrollTop==scrollClient){
        if (typeof(nextPage)=="number"){
            showLoading();
            let refreshData = await getAttractions();
            await createAttraction(refreshData);
        }else{
            return window.event=false
        };
    };
};

async function searchKeyword(){
    keyword=document.querySelector("input").value;
    nextPage=0;
    let checkD=document.querySelector('.result');
    let searchData = await getAttractions();
    nextPage=searchData.nextPage;
    while(article.children[0]){
    article.removeChild(article.children[0]);
    }
    while(checkD){
    checkD.remove(checkD)
    break
    }
    if(searchData.data.length>0){
        await createAttraction(searchData);
    }else if(checkD==null || keyword==null){
        let div=document.querySelector('.noResult');
        let div1=document.createElement('div');
        div1.className='result';
        div1.textContent="沒有符合關鍵字結果";
        div.appendChild(div1) 
    }else{
        let div=document.querySelector('.noResult');
        let div1=document.createElement('div');
        div1.className='result';
        div1.textContent="沒有符合關鍵字結果";
        checkD.remove(checkD)
        div.appendChild(div1) 
    };
};