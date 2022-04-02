checkStatus();
getBooking();

//檢查會員登入狀態流程
async function checkStatus(){
    let src="/api/user";
    let signinNav=document.querySelector('.signinNav');
    let logoutNav=document.querySelector('.logoutNav');
    let cookie=document.cookie
    console.log("checkStatus: "+cookie)
    const response=await fetch(src, {method:'GET', headers:{'cookie':cookie}});
    const data=await response.json();
    console.log(data.data)

    if(data.data==null){
        location.assign("/")
    }else{
        signinNav.style.display="none";
        logoutNav.style.display="list-item";
        let name=data.data.name;
        console.log(name)
        let userName=document.querySelector(".userName")
        userName.textContent=name;
    }
};

let src="/api/user";
const nameData=fetch(src, {method:'GET'}).then(function(response){
    return response.json()});
let html=document.querySelector("html");
let body=document.querySelector("body");
let footer=document.querySelector("footer");



//取得訂單內容並顯示在網頁
async function getBooking(){
    let src="/api/booking";
    let cookie=document.cookie
    console.log(cookie)
    let none_booked=document.querySelector(".none_booked");
    let booked=document.querySelector(".booked");
    let attractionName=document.querySelector("div.attractionName")
    let date=document.querySelector(".date")
    let time=document.querySelector(".time")
    let price=document.querySelector(".price")
    let address=document.querySelector(".address")
    let attractionImage=document.querySelector(".attractionImage")
    let userName=document.querySelector(".userName")
    console.log(userName)
    const response=await fetch(src, {method:"GET", headers:{'cookie':cookie}})
    const data=await response.json();
    let result=data[0].data;
    console.log(result)
    nameData.then(function(object){
        let name=object.data.name
        console.log(name)
        if (result==undefined){
            booked.style.display="none";
            none_booked.style.display="block";
            html.style.height="100%";
            body.style.height="100%";
            footer.style.height="100%";
        }else{
            none_booked.style.display="none";
            booked.style.display="block";
            attractionName.textContent=result.attraction.name;
            date.textContent=result.date;
            time.textContent=result.time;
            price.textContent=result.price;
            address.textContent=result.attraction.address;
            attractionImage.src=result.attraction.images;
        }
    })
}

async function deleteBooking(){
    let none_booked=document.querySelector(".none_booked");
    let booked=document.querySelector(".booked");
    
    let cookie=document.cookie
    let src="/api/booking";
    const response= await fetch(src, {method:"DELETE", headers:{'cookie':cookie}});
    const data= await response.json();
    if (response.status==200){
        booked.style.display="none";
        none_booked.style.display="block";
        html.style.height="100%";
        body.style.height="100%";
        footer.style.height="100%";
        
        checkStatus();
    }else{
        signinNav.style.display="list-item";
        logoutNav.style.display="none";
    }
}