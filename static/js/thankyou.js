let bookingNumber=document.querySelector(".bookingNumber")
let number=location.href.split("=")[1]
let src="/api/order/"+number
console.log(src)
checkStatus();
fetch(src, {method:'GET'}).then(function(response){
    return response.json();
}).then(function(jsonobj){
    let number=jsonobj[0].data.number;
    if (jsonobj[0].data.status==0){
        bookingNumber.textContent=number;
        deleteBooking();
    }
    else{
        bookingNumber.textContent=number+" 付款失敗，請於現場繳費"
    }
});

async function deleteBooking(){
    let cookie=document.cookie
    let src="/api/booking";
    const response= await fetch(src, {method:"DELETE", headers:{'cookie':cookie}});
    const data= await response.json();
}