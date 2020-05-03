const tagsContainer = document.getElementById('tagsContainer');
let tagDivs = document.getElementsByClassName('div-input__tag');
let newtagDiv;
let tags = "";
let tagValue = "";

const addTag = (btn) => {    
    // *** Insert New Empty Tag Input ***
    newtagDiv = tagDivs[0].cloneNode(true);
    newtagDiv.firstElementChild.value = '';
    tagsContainer.insertBefore(newtagDiv, btn.parentNode);
    // *** Insert New Empty Tag Input ***

    initializeTags(tags, tagDivs);
    // *** Create, update tags string ***
    for(let i = 0; i < tagDivs.length; i++) {
       if(i > 0) {
           tagDivs[i].childNodes[3].hidden = false;
       }
    }
}
function readURL(input){
    var ext = input.files[0]['name'].substring(input.files[0]['name'].lastIndexOf('.') + 1).toLowerCase();
   if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
       var reader = new FileReader();
       reader.onload = function (e) {
           document.getElementById('img').setAttribute('src', e.target.result);
       }
   
       reader.readAsDataURL(input.files[0]);
   }else{
    document.getElementById('img').setAttribute('src', '/assets/no_preview.png');
   }
}

const deleteTag = (btn) => { 
    btn.parentNode.remove();
    tagDivs = document.getElementsByClassName('div-input__tag');
   initializeTags(tags, tagDivs);
}

const deleteArticle = (btn) => {
    const articleId = btn.parentNode.querySelector('[name="articleId"]').value;
    // const csrf = btn.parentNode.querySelector('[name="_csrf"]').value;
 
     const dataElement = btn.closest('article')
 
    fetch('/admin/article/' + articleId, {
        method:'DELETE',
        // headers: {
        //     'csrf-token': csrf
        // }
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        dataElement.parentNode.removeChild(dataElement);
    })
    .catch(err => console.log(err));
 };

const initializeTags = (tags, tagDivs) => {
    tags = '';
    // *** Create, update tags string ***
    for(let i = 0; i < tagDivs.length; i++){
        tagValue = tagDivs[i].firstElementChild.value;
       if(tagValue){
           tags += tagValue + ',';
       } 
    }
    tags = tags.slice(0, -1);
    document.getElementById('tags').value = tags;
}