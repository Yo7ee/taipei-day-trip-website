getOrderInfo();
checkStatus();

async function getOrderInfo(){
    console.log("test")
    let path=location.pathname;
    let bookingNumber=path.split("/")[2];
    let src="/api/member/"+bookingNumber;
    const data=await fetch(src).then(function(response){
        return response.json();
    });
    console.log(data[0].data);
    let list=data[0].data;

    let userName=document.querySelector(".userName");
    userName.textContent=list.userName;

    let orderNumber=document.querySelector(".orderNumber");
    orderNumber.textContent=bookingNumber;

    let attractionImage=document.querySelector(".attractionImage")
    attractionImage.src=list.attraction.images

    let attractionName=document.querySelector("div.attractionName")
    attractionName.textContent=list.attraction.name;

    let date=document.querySelector(".date");
    date.textContent=list.date;

    let time=document.querySelector(".time");
    time.textContent=list.time;
    
    let price=document.querySelector(".price");
    price.textContent=list.price;

    let address=document.querySelector(".address")
    address.textContent=list.attraction.address;


}