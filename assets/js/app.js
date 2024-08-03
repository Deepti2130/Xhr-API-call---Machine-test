const cl = console.log;

const postform = document.getElementById("postform");
const titlecontrol = document.getElementById("title");
const contentcontrol = document.getElementById("content");
const userIdcontrol = document.getElementById("userId");
const submitbtn = document.getElementById("submitbtn");
const updatebtn = document.getElementById("updatebtn");
const postcontainer = document.getElementById("postcontainer");
const loader = document.getElementById("loader");


const BASE_URL =`https://jsonplaceholder.typicode.com`;

const POST_URL =`${BASE_URL}/posts`; //this url will be used for GET and POST

const sweetAlert = (msg, iconstr) =>{
    swal.fire({
        title:msg,
        timer:2500,
        icon:iconstr
    })
}

let postArr = []

const templating = (arr) => {
    let result = " ";

    arr.forEach(ele => {
        result += `<div class="col-md-4 mb-4">
                <div class="card postcard h-100" id="${ele.id}">
                <div class="card-header">
                    <h3 class="m-0 heading">${ele.title}</h3>
                </div>
                <div class="card-body">
                    <p class="m-0">${ele.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                <button  class="btn btn bg-primary btninfo" onclick = "onEdit(this)">Edit</button>
                <button  class="btn btn bg-danger btnrem" onclick = "onRemove(this)">Remove</button>
                </div>
             </div>
            </div>`
        
    });
    postcontainer.innerHTML = result;
}

const fetchposts = () => {
    //API call starts => loader show
    loader.classList.remove(`d-none`);
    //1. create a xhr object
    let xhr = new XMLHttpRequest(); //object

    //2.configuration
     xhr.open("GET", POST_URL) //Methodname and url


    //3.
    xhr.send()

    //xhr onload

    //4.after getting response

    xhr.onload = function(){
        // cl(xhr.status)
        if(xhr.status >= 200 && xhr.status < 300){
            //API call success
            // cl(xhr.response)
            postArr = JSON.parse(xhr.response)
            cl(postArr)
            templating(postArr)
        }
        loader.classList.add(`d-none`); //loader hide
    }
}
fetchposts();



const onAddpost = (eve) =>{
    eve.preventDefault();

    //create a newobject

    let newobj = {
        title:titlecontrol.value,
        body:contentcontrol.value,
        userId:userIdcontrol.value
    }
    cl(newobj)
    postform.reset();

   //API Call
    loader.classList.remove(`d-none`);

    let xhr = new XMLHttpRequest();

    //configuration
    xhr.open("POST", POST_URL);

    //response

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            cl(xhr.response);
            newobj.id = JSON.parse(xhr.response).id;

            //only one post is added hence no need to templating

            let div = document.createElement(`div`);
            div.className = `col-md-4 mb-4`;
            div.innerHTML = `<div class="card postcard h-100" id="${newobj.id}">
                <div class="card-header">
                    <h3 class="m-0 heading">${newobj.title}</h3>
                </div>
                <div class="card-body">
                    <p class="m-0">${newobj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                <button  class="btn btn bg-primary btninfo" onclick = "onEdit(this)">Edit</button>
                <button  class="btn btn bg-danger btnrem" onclick = "onRemove(this)">Remove</button>
                </div>
             </div>`

             postcontainer.prepend(div)
             sweetAlert(`${newobj.title} is added successfully`, "Success")
        }
        loader.classList.add(`d-none`); //loader hide
    }

    //send to DB
    xhr.send(JSON.stringify(newobj))
}


const onEdit = (ele) => {
    // cl(ele)
    //Edit ID
    let editId = ele.closest(`.card`).id;
    
    
    window.scrollTo(0,0,"auto")


    // window.scrollTo({
    //     top:0,
    //     left:0,
    //     behavior:"smooth"
    // })

    localStorage.setItem(`editId`,editId);

    //URL

    let EDIT_URL = `${BASE_URL}/posts/${editId}`;

    //API call
    //Loader show
    loader.classList.remove(`d-none`);

    let xhr = new XMLHttpRequest();


    xhr.open("GET", EDIT_URL);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            cl(xhr.response);
            let post = JSON.parse(xhr.response);

            //Patch the data
            titlecontrol.value = post.title;
            contentcontrol.value = post.body;
            userIdcontrol.value = post.userId;
            submitbtn.classList.add(`d-none`);
            updatebtn.classList.remove(`d-none`);
    }
    loader.classList.add(`d-none`);

}
 //send

 xhr.send()
}


const onupdatepost = () =>{
    //updateID
    let updateId = localStorage.getItem(`editId`);

    //Updateobj
    let updatedobj = {
        title:titlecontrol.value,
        body:contentcontrol.value,
        userId:userIdcontrol.value

    }

    //URL
    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`;

    //API CALL
    //Loader
    loader.classList.remove(`d-none`);

    let xhr = new XMLHttpRequest();


    xhr.open("PATCH", UPDATE_URL);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            cl(xhr.response);
            let card = [...document.getElementById(updateId).children]
            //cl(card)
            card[0].innerHTML = ` <h3 class="m-0">${updatedobj.title}</h3>`;
            card[1].innerHTML = `<p class="m-0">${updatedobj.body}</p>`

            sweetAlert(`${updatedobj.title} is updated successfully`, "Success")

            postform.reset();
            updatebtn.classList.add(`d-none`);
            submitbtn.classList.remove(`d-none`);

        }
        loader.classList.add(`d-none`);
        
}

//send
xhr.send(JSON.stringify(updatedobj))
}


const onRemove = (ele) => {
//Remove ID
let RemoveId = ele.closest(`.card`).id;
cl(RemoveId);



Swal.fire({
    title: "Are you sure?",
    text: "You won't remove this post !!!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Remove it!"
  }).then((result) => {
    if (result.isConfirmed) {
    //API CALL
    //Loader show
    loader.classList.remove(`d-none`);
        
    let REMOVE_URL =` ${BASE_URL}/posts/${RemoveId}`;
    let xhr = new XMLHttpRequest();


    xhr.open("DELETE", REMOVE_URL);

    xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status < 300){
    ele.closest(`.card`).parentElement.remove()
    
}

}
//send
xhr.send()
      Swal.fire({
        title: "Removed!",
        text: "Your file has been Removed.",
        icon: "success"
      });
    }
    loader.classList.add(`d-none`);
  });

}
















postform.addEventListener("submit", onAddpost);
updatebtn.addEventListener("click", onupdatepost)

