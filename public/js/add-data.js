const imageInput = document.getElementById('image');

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