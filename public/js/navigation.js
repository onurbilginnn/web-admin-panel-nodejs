    var collapseBtn = document.getElementById('sidebarCollapse');
    var sideBar = document.getElementById('sidebar');
    collapseBtn.addEventListener('click', function(){
        sideBar.classList.toggle('active');
        this.classList.toggle('active');
    })
