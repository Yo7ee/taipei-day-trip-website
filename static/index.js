let article=document.querySelector('article');
let nextPage=0;
let src="/api/attractions/?page="+nextPage;

const data = 
fetch(src, {method:'get'}).then(function(response){
    return response.json();
});

data.then(function(jsonobj){
    console.log(jsonobj)
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

// 判斷當使用者螢幕高度足夠，導致無捲軸可觸發scrollLoadmore
// 問題:window.event('load')會在fetch資料載入完畢前就觸發
// window.addEventListener('load',noscroll)
// function noscroll(){
//     let bodyHeight=document.body.scrollHeight; //畫面比例調到最小時，整個頁面的高度
//     let scrollClient=document.documentElement.clientHeight; //正常比例下，頁面的高度
//     let nextPage=1;
//     console.log("noscoll scrollClient"+scrollClient+" bodyHeight"+bodyHeight)
//     if(bodyHeight=scrollClient){
//         let keyword=document.querySelector("input").value;
//         let freshSrc="http://192.168.0.102:3000/api/attractions/?page="+nextPage+"&keyword="+keyword;
//             const refreshData=
//             fetch(freshSrc, {method:'get'}).then(function(response){
//                 return response.json();
//             });
//             refreshData.then(function(jsonobj){
//                 for (let i=0; i<jsonobj.data.length; i++){
//                 let list=jsonobj.data;
//                 let myfigure=document.createElement('figure');
//                 let myimg=document.createElement('img');
//                 let myfigcaption=document.createElement('figcaption');
//                 let divName=document.createElement('div');
//                 divName.className='name';
//                 let divFig1=document.createElement('div');
//                 divFig1.className='figcaption1';
//                 let divMrt=document.createElement('div');
//                 divMrt.className='mrt';
//                 let divCategory=document.createElement('div');
//                 divCategory.className='category';
//                 myimg.src=list[i].images[0];
//                 divName.textContent=list[i].name;
//                 divMrt.textContent=list[i].mrt;
//                 divCategory.textContent=list[i].category;
//                 divFig1.appendChild(divMrt);
//                 divFig1.appendChild(divCategory);
//                 myfigcaption.appendChild(divName);
//                 myfigcaption.appendChild(divFig1);
//                 myfigure.appendChild(myimg);
//                 myfigure.appendChild(myfigcaption);
//                 article.appendChild(myfigure);
//                 };
//             });
//     };
// };


//當使用者執行滾軸轉動至底底部時，載入更多資料
window.addEventListener("scroll",scrollLoadMore);
function scrollLoadMore(){
    console.log("first"+nextPage)
    let scrollTop=document.documentElement.scrollTop; //把畫面scroll多少距離消失在螢幕
    let scrollHeight=document.documentElement.scrollHeight; //畫面比例調到最小時，整個頁面的高度
    let scrollClient=document.documentElement.clientHeight; //正常比例下，頁面的高度
    console.log("scroll check: scrollClient"+scrollClient+" scrollHeight"+scrollHeight+" scrollTop"+scrollTop);
    //此方法可能會有問題，如果scrolltop非整數時
    if(scrollHeight-scrollTop==scrollClient){
        console.log("check scroll down and complete load")
        let keyword=document.querySelector("input").value;
        let freshSrc="/api/attractions/?page="+nextPage+"&keyword="+keyword;
        if (typeof(nextPage)=="number"){
            const refreshData=
            fetch(freshSrc, {method:'get'}).then(function(response){
                return response.json();
            });
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
};

//搜尋關鍵字顯示資料及結果超過一頁，也是判斷滾動至底部時載入更多資料，第二次搜尋時，會先將舊的資料刪除，關鍵字搜尋不到結果時，顯示沒有結果
function searchKeyword(){
    let keyword=document.querySelector("input").value
    let nextPage=0;
    let keywordSrc="/api/attractions/?page="+nextPage+"&keyword="+keyword;
    let checkD=document.querySelector('.result')
    const searchData=fetch(keywordSrc).then(function(response){
        return response.json();
    });
    searchData.then(function(jsonobj){
        while(article.children[0]){
        article.removeChild(article.children[0]);
        }
        while(checkD){
        checkD.remove(checkD)
        console.log("checkD"+checkD)
        break
        }
        nextPage=jsonobj.nextPage
        console.log("search"+nextPage)
        let list=jsonobj.data
        if(list.length>0){
            for(i=0; i<list.length; i++){
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
    });
    window.addEventListener("scroll",function searchLoadMore(){
        console.log("first"+nextPage)
        let scrollTop=document.documentElement.scrollTop; //把畫面scroll多少距離消失在螢幕
        let scrollHeight=document.documentElement.scrollHeight; //畫面比例調到最小時，整個頁面的高度
        let scrollClient=document.documentElement.clientHeight; //正常比例下，頁面的高度
        console.log("scroll check: scrollClient"+scrollClient+" scrollHeight"+scrollHeight+" scrollTop"+scrollTop);
        //此方法可能會有問題，如果scrolltop非整數時
        if(scrollHeight-scrollTop==scrollClient){
            console.log("check scroll down and complete load")
            let keyword=document.querySelector("input").value;
            let freshSrc="/api/attractions/?page="+nextPage+"&keyword="+keyword;
            if (typeof(nextPage)=="number"){
                const refreshData=
                fetch(freshSrc, {method:'get'}).then(function(response){
                    return response.json();
                });
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
};
