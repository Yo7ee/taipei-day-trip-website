pageNumber=1
let src="http://10.0.0.200:3000/api/attractions?page="+ pageNumber;

const data = 
fetch(src, {method:'get'}).then(function(response){
    return response.json();
});

data.then(function(jsonobj1){
    let nextPage=jsonobj1.nextPage;
    let list=jsonobj1.data;
    console.log(list[0].images[0])
});