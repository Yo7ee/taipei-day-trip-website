checkStatus();
getBooking();

let none_booked=document.querySelector(".none_booked");
let booked=document.querySelector(".booked");

//取得使用者名稱
let src="/api/user";
const nameData=fetch(src, {method:'GET'}).then(function(response){
    return response.json()});
let html=document.querySelector("html");
let body=document.querySelector("body");
let footer=document.querySelector("footer");

//取得訂單內容並顯示在網頁
async function getBooking(){
    let src="/api/booking";
    let cookie=document.cookie;
    let attractionName=document.querySelector("div.attractionName");
    let date=document.querySelector(".date");
    let time=document.querySelector(".time");
    let price=document.querySelector(".price");
    let address=document.querySelector(".address");
    let attractionImage=document.querySelector(".attractionImage");
    let userName=document.querySelector(".userName");
    let totalPrice=document.querySelector(".total_price");
    const response=await fetch(src, {method:"GET", headers:{'cookie':cookie}})
    const data=await response.json();
    let result=data[0].data;
    nameData.then(function(object){
        let name=object.data.name;
        userName.textContent=name;
        if (result==undefined){
            booked.style.display="none";
            none_booked.style.display="block";
            html.style.height="100%";
            body.style.height="100%";
            footer.style.height="100%";
        }else{
            none_booked.style.display="none";
            booked.style.visibility="visible";
            attractionName.textContent=result.attraction.name;
            date.textContent=result.date;
            time.textContent=result.time;
            price.textContent=result.price;
            address.textContent=result.attraction.address;
            attractionImage.src=result.attraction.images;
            totalPrice.textContent="總價： " + result.price + " 元";
        }
    })
}

async function deleteBooking(){
    let cookie=document.cookie;
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
        memberNav.style.display="none";
    }
}
