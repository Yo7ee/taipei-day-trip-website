let signIn=document.querySelector('.signin_Window');
let signUp=document.querySelector('.signup_Window');
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
    let signupMessage=document.querySelector(".signup")
    let signinMessage=document.querySelector(".signin")
    signupMessage.textContent=""
    signinMessage.textContent=""
    checkStatus();
};

function signin(){
    let src="/api/user";
    let signinForm=document.querySelector(".signinForm")
    let formData=new FormData(signinForm)
    let message=document.querySelector(".signin")
    let data=fetch(src, {method:'PATCH', body:formData}).then(function(response){
        return response.json()
    });
    data.then(function(object){
        console.log(object)
        let result=object[0].message
        console.log(object[0].lengh)
        if(result==undefined){
            location.assign(location.href)
        }else{
            message.textContent=result
        };
    });
};

function signup(){
    let src="/api/user";
    let signupForm=document.querySelector(".signupForm")
    let formData=new FormData(signupForm)
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

//回首頁
function backtohome(){
    location.assign("/")
};