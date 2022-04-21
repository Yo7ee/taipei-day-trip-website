TPDirect.setupSDK(124009, 'app_r32zFDigxKxtJ65GcKDEgR4hGSZsKD4hud7gmGQ8sAkcCCcy2dsUJTxypS73', 'sandbox');

let fields ={
    // Display ccv field
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'ccv'
        }
    };
    
TPDirect.card.setup({
    fields:fields,
    styles:{
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});
function alert(message){
    cover.style.display="grid";
    alert_Window.style="grid";
    let alert_message=document.querySelector(".alert_message");
    alert_message.textContent=message;
}

function pay(event){
    const tappayStatus=TPDirect.card.getTappayFieldsStatus()
    //check can or cannot getPrime
    if(tappayStatus.canGetPrime===false){
        console.log("cannot get prime")
        alert("請確認信用卡資料");
        return
    }

    //get prime
    TPDirect.card.getPrime(async(result)=>{
        if (result.status !==0){
            console.log("get prime error" + result.msg)
            alert("請確認信用卡資料");
            return 
        };
        prime=result.card.prime;
        let src="/api/orders";
        let contactForm=document.querySelector('.contactForm');
        let formData=new FormData(contactForm);
        let cookie=document.cookie;
        let response=await fetch(src, 
            {
                method:'POST', 
                body:formData,
                headers:{
                    'prime': prime,
                    'cookie':cookie
                }
            });
        let data=await response.json();
        if (data[0].message==="訂單建立失敗，請確認聯絡資訊"){
            // 訂單建立失敗，聯絡資訊輸入錯誤，回到當前頁面
            alert("訂單建立失敗，請確認聯絡資訊");
        }else if(data[0].error){
            alert("請先登入");
        }
        else{
            let number=data[0].data.number;
            location.href="/thankyou?number="+number;
        }
    });
};