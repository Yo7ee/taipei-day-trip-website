pageNumber=2;

// let src="http://10.0.0.200:3000/api/attractions?page="+ pageNumber;

// const data = 
// fetch(src, {method:'get'}).then(function(response){
//     return response.json();
// });

// data.then(function(jsonobj1){
//     let nextPage=jsonobj1.nextPage;
//     let list=jsonobj1.data;
//     console.log(list[0].images[0])
// });
page="null";
console.log(typeof(page));
// if(pageNumber===1){
//     console.log(1);
// }else if(typeof(pageNumber)==="string"){
//     console.log(2);
// }else if(page===4){
//     console.log(4);
// }
let result={
    "data":{
        "data":{
            "number":123,
            "payment":{
                "message":"123",
                "status":0
            }
        }
    }
}
console.log(result)
console.log(result.data)
console.log(result.data.data.payment.status)