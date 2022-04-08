let signIn=document.querySelector('.signin_Window');
let signUp=document.querySelector('.signup_Window');
let alert_Window=document.querySelector('.alert_Window')
let cover=document.querySelector('.cover');

function showSignin(){
    signIn.style.display="grid";
    signUp.style.display="none";
    cover.style.display="grid";
    let message=document.querySelector(".signin")
    message.textContent=""
};

function showSignup(){
    signUp.style.display="grid";
    signIn.style.display="none";
    cover.style.display="grid";
    let message=document.querySelector(".signup")
    message.textContent=""
};

function cross(){
    cover.style.display="none";
    signUp.style.display="none";
    signIn.style.display="none";
    alert_Window.style.display="none";
    let signupMessage=document.querySelector(".signup")
    let signinMessage=document.querySelector(".signin")
    signupMessage.textContent=""
    signinMessage.textContent=""
    checkStatus();
};

//登入 前端設置cookie
// async function signin(){
//     let src="/api/user";
//     let signinForm=document.querySelector(".signinForm")
//     let formData=new FormData(signinForm)
//     let message=document.querySelector(".signin")
//     let response=await fetch(src, {method:'PATCH', body:formData});
//     let data=await response.json();
//     tokenValue=data[0].token;
//     document.cookie='access_token='+tokenValue;
//     console.log(document.cookie)
//     let result=data[0].message;
//     if(result==undefined){
//         location.assign(location.href)
//     }else{
//         message.textContent=result
//     };
// };

//登入 後端設置cookie
async function signin(){
    let src="/api/user";
    let signinForm=document.querySelector(".signinForm")
    let formData=new FormData(signinForm)
    console.log(formData)
    let message=document.querySelector(".signin")
    let response=await fetch(src, {method:'PATCH', body:formData});
    let data=await response.json();
    console.log(document.cookie)
    console.log(data)
    console.log(data.message)
    let result=data.message;
    if(result==undefined){
        location.assign(location.href)
    }else{
        message.textContent=result
    };
};

function signup(){
    let src="/api/user";
    let signupForm=document.querySelector(".signupForm")
    console.log(signupForm)
    let formData=new FormData(signupForm)
    console.log(formData)
    let message=document.querySelector(".signup")
    let data=fetch(src, {method:'POST', body:formData}).then(function(response){
        return response.json()
    });
    data.then(function(object){
        console.log(object[0].message)
        let result=object[0].message
        message.textContent=result
    });
};

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
        signinNav.style.visibility="visible";
        logoutNav.style.display="none";
    }else{
        signinNav.style.display="none";
        logoutNav.style.display="list-item";
    };
};

//登出 後端設置cookie
function logout(){
    let src="/api/user";
    console.log("logout")
    fetch(src, {method:'DELETE'}).then(function(response){
        return response.json();
    });
    location.assign("/")
};

//回首頁
function backtohome(){
    location.assign("/")
};

//預定行程
async function bookCheck(){
    let src="/api/user";
    let cookie=document.cookie
    console.log(cookie)
    const response=await fetch(src, {method:'GET', headers:{'cookie':cookie}})
    const data=await response.json();
    console.log(data.data)
    result=data.data;
    if (result==null){
        signIn.style.display="grid";
        cover.style.display="grid";
    }else{
        location.assign("/booking")
    }


}