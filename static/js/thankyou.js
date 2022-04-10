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

async function checkStatus(){
    let src="/api/user";
    let signinNav=document.querySelector('.signinNav');
    let logoutNav=document.querySelector('.logoutNav');
    console.log(document.cookie)
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

async function deleteBooking(){
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