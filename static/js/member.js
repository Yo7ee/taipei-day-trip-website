checkStatus();
getOrderinfo();


//檢查會員登入狀態流程
async function checkStatus(){
    let src="/api/user";
    let logoutNav=document.querySelector('.logoutNav');
    let cookie=document.cookie;
    const response=await fetch(src, {method:'GET', headers:{'cookie':cookie}});
    const data=await response.json();

    if(data.data==null){
        location.assign("/");
    }else{
        logoutNav.style.visibility="visible";
    };
};

//取得付款行程內容並顯示在網頁
async function getOrderinfo(){
    //取得使用者名稱
    let src="/api/user";
    let response=await fetch(src, {method:'GET'})
    let data=await response.json();
    let userEmail=data.data.email;
    let cookie=document.cookie;
    let src1="/api/member";
    let response1= await fetch(src1, {method:'GET', headers:{'cookie':cookie,'email':userEmail}})
    let result=await response1.json();
    member=result[0].data.memberInfo;
    order=result[0].data.orderInfo;
    let number=document.querySelector(".schedule_title_container");
    for(i=0; i<order.length; i++){
        let aOrdernumber=document.createElement('a');
        let divPrice=document.createElement('div');
        aOrdernumber.textContent=order[i].bookingNumber;
        aOrdernumber.href='/orderInfo/'+ order[i].bookingNumber;
        divPrice.textContent=order[i].price;
        number.appendChild(aOrdernumber);
        number.appendChild(divPrice);
    }
    let user_name=document.querySelector(".name");
    user_name.textContent=member.name;

    let user_email=document.querySelector(".email");
    user_email.textContent=userEmail;
}