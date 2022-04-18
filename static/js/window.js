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

//登入 後端設置cookie
async function signin(){
    let src="/api/user";
    let signinForm=document.querySelector(".signinForm")
    let formData=new FormData(signinForm)
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
    let signupForm=document.querySelector(".signupForm");
    let formData=new FormData(signupForm);
    let message=document.querySelector(".signup");
    let valid=0;
    if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(signupForm.email.value)){
        valid++;
    }
    else{
        message.textContent="email格式錯誤";
    }
    if(valid===1){
        let data=fetch(src, {method:'POST', body:formData}).then(function(response){
            return response.json();
        });
        data.then(function(object){
            let result=object[0].message;
            message.textContent=result;
        });
    };
};

//檢查會員登入狀態流程
async function checkStatus(){
    let src="/api/user";
    let signinNav=document.querySelector('.signinNav');
    let memberNav=document.querySelector('.memberNav');
    let cookie=document.cookie;
    const response=await fetch(src, {method:'GET', headers:{'cookie':cookie}});
    const data=await response.json();

    if(data.data==null){
        signinNav.style.display="list-item";
        memberNav.style.display="none";
    }else{
        signinNav.style.display="none";
        memberNav.style.display="list-item";
    };
};

//登出 後端設置cookie
function logout(){
    let src="/api/user";
    fetch(src, {method:'DELETE'}).then(function(response){
        return response.json();
    }).then(function(){
        location.assign("/");
    })
};

//回首頁
function backtohome(){
    location.assign("/");
};

//至會員中心
function member(){
    location.assign("/member");
}

//預定行程
async function bookCheck(){
    let src="/api/user";
    let cookie=document.cookie;
    const response=await fetch(src, {method:'GET', headers:{'cookie':cookie}});
    const data=await response.json();
    const result=data.data;
    if (result==null){
        signIn.style.display="grid";
        cover.style.display="grid";
    }else{
        location.assign("/booking");
    }
}
//show loading 
function showLoading(){
    let loading=document.querySelector("#loading");
    loading.className="display";
}

//hide loading
function hideLoading(){
    loading.className="";
}