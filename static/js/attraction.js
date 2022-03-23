let content=document.querySelector(".content")
let Name=document.querySelector(".name");
let category=document.querySelector(".category");
let mrt=document.querySelector(".mrt");
let article=document.querySelector("article")
let description=document.querySelector(".p_description");
let address=document.querySelector(".p_address");
let transport=document.querySelector(".p_transport");
let imgContainer=document.querySelector(".img")
let myImg=document.createElement('img');
myImg.className='image';
let dotContainer=document.querySelector('.dotContainer')

//檢查會員登入狀態流程
checkStatus();

//show attraction and put first image on the page
let path=location.pathname;
let id=path.split("/")[2] //path=>/attraction/3, path.split("/")=>('','attraction', '3')
let src="/api/attraction/"+id;
const data=
fetch(src).then(function(response){
    return response.json();
});
data.then(function(jsonobj){
    let list=jsonobj.data;
    console.log(jsonobj)
    Name.textContent=list.name;
    category.textContent=list.category+" ";
    mrt.textContent=" "+list.mrt;
    description.textContent=list.description;
    address.textContent=list.address;
    transport.textContent=list.transport;
    myImg.src=list.images[0];
    imgContainer.appendChild(myImg);
    console.log(list.images.length)
    let myDot=document.createElement('li')
    myDot.className='selected';
    dotContainer.appendChild(myDot)
    for(i=0; i<list.images.length-1; i++){
        let myDot=document.createElement('li')
        myDot.className='dot';  
        dotContainer.appendChild(myDot)
    }
    });

//Left/Right Arrow function
let minNumber=0;
let circle=0;
function leftArrow(){
    data.then(function(jsonobj){
    list=jsonobj.data;
    let maxNumber=list.images.length;
    console.log(jsonobj.data.images.length)
    if(minNumber==0){
        minNumber=maxNumber-1;
    }else{
        minNumber--;
    };
//直接一筆一筆清除有變成selected classname的圓點
    for(i=0; i<list.images.length; i++){
        dotContainer.children[i].className='dot'
    }
//把按下左邊箭頭後對應的圖片新增及原點新增classname
    myImg.src=list.images[minNumber];
    dotContainer.children[minNumber].className='selected'
    console.log("leftArrow; "+minNumber)
    });
};

function rightArrow(){
    data.then(function(jsonobj){
    list=jsonobj.data;
    let maxNumber=list.images.length;
    console.log("maxnumber: "+maxNumber+", minnumber: "+minNumber)
    if(minNumber==maxNumber-1){
        minNumber=0;
        console.log(minNumber)
    }else{
        minNumber++;
    };
    //直接一筆一筆清除有變成selected classname的圓點
    for(i=0; i<list.images.length; i++){
        dotContainer.children[i].className='dot'
    }
    //把按下左邊箭頭後對應的圖片新增及原點新增classname
    myImg.src=list.images[minNumber];
    dotContainer.children[minNumber].className='selected'
    console.log("rightArrow: "+minNumber)
    });
}; 

function feeOption(){
    let option=document.querySelector('input[value="up"]:checked');
    let option1=document.querySelector('.option1')
    if(option===null){
        option1.textContent="新台幣2500元"
        console.log("選擇下半天")
    }else{
        option1.textContent="新台幣2000元"
        console.log("選擇上半天")
    }
};

//檢查會員登入狀態流程
async function checkStatus(){
    let src="/api/user";
    let signinNav=document.querySelector('.signinNav');
    let logoutNav=document.querySelector('.logoutNav');
    const response=await fetch(src, {method:'GET'});
    const data=await response.json();
    console.log(data.data)

    if(data.data==null){
        signinNav.style.display="list-item";
        logoutNav.style.display="none";
    }else{
        signinNav.style.display="none";
        logoutNav.style.display="list-item";
    };
};

//登出
function logout(){
    let src="/api/user";
    fetch(src, {method:'DELET'}).then(function(response){
        return response.json();
    });
    location.assign(location.href)
}

//回首頁
function backtohome(){
    location.assign("/")
}