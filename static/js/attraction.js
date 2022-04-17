let content=document.querySelector('.content')
let Name=document.querySelector('.name');
let category=document.querySelector('.category');
let mrt=document.querySelector('.mrt');
let article=document.querySelector('article')
let description=document.querySelector('.p_description');
let address=document.querySelector('.p_address');
let transport=document.querySelector('.p_transport');
let imgContainer=document.querySelector('.img')
let slideShowContainer=document.querySelector('.slideShowContainer')
let myImg=document.createElement('img')

let dotContainer=document.querySelector('.dotContainer')
let date=document.querySelector('.date')

//檢查會員登入狀態流程
checkStatus();

//設定日期選擇最小值
let today=new Date(); //Thu Mar 31 2022 15:31:18 GMT+0800 (CST)
let tomorrow= new Date(today)
console.log(tomorrow.getDate())
tomorrow.setDate(tomorrow.getDate()+1)
// let monthDate=new Date(Year, Month, 0).getDate();//to know the month date number
let tomorrowFormat=tomorrow.toLocaleString('zh-TW',{
    year:'numeric',
    month:'2-digit',
    day:'2-digit',
});
let Year=tomorrowFormat.split('/')[0];
let Month=tomorrowFormat.split('/')[1];
let Day=tomorrowFormat.split('/')[2];
let minDate=Year+'-'+Month+'-'+Day;
date.min=minDate;


//show attraction and put first image on the page
let path=location.pathname;
let id=path.split("/")[2] //path=>/attraction/3, path.split("/")=>('','attraction', '3')
let src="/api/attraction/"+id;
const data=fetch(src).then(function(response){
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
    console.log(list.images[7])
    //輪播方法二
        myImg.className='image';
        myImg.setAttribute('id', 'active')
        myImg.src=list.images[0];
        imgContainer.appendChild(myImg);
        
    let myDot=document.createElement('li')
        myDot.className='selected';
        dotContainer.appendChild(myDot)
    for(i=1; i<list.images.length; i++){
        let myImg=document.createElement('img');
        myImg.className='image';
        myImg.src=list.images[i];
        // myImg.style.display="none";
        imgContainer.appendChild(myImg)
        let myDot=document.createElement('li')
        myDot.className='dot';  
        dotContainer.appendChild(myDot)
    };
    //輪播方法一
    // myImg.src=list.images[0];
    // myImg.className='image';
    // imgContainer.appendChild(myImg);
    // console.log(list.images.length)
    // let myDot=document.createElement('li')
    // myDot.className='selected';
    // dotContainer.appendChild(myDot)
    // for(i=0; i<list.images.length-1; i++){
    //     let myDot=document.createElement('li')
    //     myDot.className='dot';  
    //     dotContainer.appendChild(myDot)
    // }
    });
// arrow function
function showCurrent(){
    let slideShowContainer=document.querySelector('.slideShowContainer')
    let img=document.querySelectorAll(".image")
    console.log(img)
    let count=0;
    data.then(function(jsonobj){
        let imageNumber=jsonobj.data.images.length;
        
    })
}
//Left/Right Arrow function
let minNumber=0;
let circle=0;
function leftArrow(){
    let img=document.querySelectorAll(".image")
    let activeImg=document.querySelectorAll(".active")
    let imgCount=img.length+activeImg.length;
    console.log(imgCount)
    let maxNumber=imgCount;
    if(minNumber==0){
        minNumber=maxNumber-1;
        displayChange=0;
    }else{
        displayChange=minNumber;
        minNumber--;
    };
//直接一筆一筆清除有變成selected classname的圓點
    for(i=0; i<imgCount; i++){
        console.log(dotContainer.children[4].className)
        dotContainer.children[i].className='dot'
    };
//把按下左邊箭頭後對應的圖片新增及原點新增classname
    img[minNumber].setAttribute('id', 'active')
    console.log("after: "+minNumber)
    img[displayChange].removeAttribute('id');
    console.log(displayChange)
    // myImg.src=list.images[minNumber];
    dotContainer.children[minNumber].className='selected'
    console.log("leftArrow; "+minNumber)
};

function rightArrow(){
    let img=document.querySelectorAll(".image")
    let activeImg=document.querySelectorAll(".active")
    let imgCount=img.length+activeImg.length;
    let maxNumber=imgCount;
    console.log("maxnumber: "+maxNumber+", minnumber: "+minNumber)
    if(minNumber==maxNumber-1){
        displayChange=maxNumber-1;
        console.log(displayChange)
        minNumber=0;
        console.log(minNumber)
    }else{
        displayChange=minNumber;
        minNumber++;
    };
    //直接一筆一筆清除有變成selected classname的圓點
    for(i=0; i<imgCount; i++){
        dotContainer.children[i].className='dot'
    }
    //把按下左邊箭頭後對應的圖片新增及原點新增classname
    img[minNumber].setAttribute('id', 'active');
    img[displayChange].removeAttribute('id');
    console.log("after: "+minNumber)
    
    // myImg.src=list.images[minNumber];
    dotContainer.children[minNumber].className='selected'
    console.log("rightArrow: "+minNumber)
}; 

function feeOption(){
    let option=document.querySelector('input[value="09:00~12:00"]:checked');
    let option1=document.querySelector('.option1')
    if(option===null){
        option1.textContent="新台幣2500元"
        console.log("選擇下半天")
    }else{
        option1.textContent="新台幣2000元"
        console.log("選擇上半天")
    }
};
//確認預定行程
async function booking_created(){
    let src="/api/booking";
    let path=location.href
    let attractionId=path.split('/').pop();
    console.log(attractionId)
    let bookingForm=document.querySelector(".booking_form");
    console.log(bookingForm);
    let formData=new FormData(bookingForm);
    console.log(formData);
    let priceHtml=document.querySelector('.option1');
    let priceText=priceHtml.textContent;
    let price=priceText.replace(/\D/g, '');
    console.log(price)
    let cookie=document.cookie
    let messageDate=document.querySelector(".date_message")
    const response=await fetch(src, {method:'POST', body:formData, headers:{"cookie":cookie, "attractionId":attractionId, "price":price}});
    const data=await response.json();
    console.log(data.length)
    if(data[1]==400){
        messageDate.textContent="請選擇日期";
    }else if(data[1]==403){
        showSignin();
        console.log("test")
    }else{
        location.assign("/booking");
    }
}
//檢查會員登入狀態流程
async function checkStatus(){
    let src="/api/user";
    let signinNav=document.querySelector('.signinNav');
    let memberNav=document.querySelector('.memberNav');
    console.log(document.cookie)
    const response=await fetch(src, {method:'GET'});
    const data=await response.json();
    console.log(data.data)

    if(data.data==null){
        signinNav.style.visibility="visible";
        memberNav.style.display="none";
    }else{
        signinNav.style.display="none";
        memberNav.style.display="list-item";
    };
};
