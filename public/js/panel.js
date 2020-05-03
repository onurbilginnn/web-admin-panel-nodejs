    const tableSelect = document.getElementById('tableSelect');
    const page = document.getElementById('page');
    const addBtn = document.getElementById('addBtn'); 
    const getAddData = () => {               
        location.href='/admin/main/add-data/' + page.value + '_' + tableSelect.value;
     };
    tableSelect.addEventListener('change', function(){
        if(this.value === 'default'){
            addBtn.style.display = 'none';
        } else {
            addBtn.style.display = 'block';
        }
     });
     const deleteData = (btn) => {
        const elementId = btn.parentNode.querySelector('[name="elementId"]').value;
        const tableName = btn.parentNode.querySelector('[name="tableName"]').value;
        // const csrf = btn.parentNode.querySelector('[name="_csrf"]').value;
     
         const dataElement = btn.closest('article')
     
        fetch('/admin/data/' + elementId + '_' + tableName, {
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
   