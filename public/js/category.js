document.querySelectorAll('.filter').forEach(filter => {
    filter.addEventListener('click', () => {
         // Remove 'active' class from all filters
        document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
        // Add 'active' class to the clicked filter
        filter.classList.add('active');
        const category = filter.getAttribute('data-category');
        window.location.href = `/listings?category=${category}`;
    });
});


let taxSwitch = document.getElementById("flexSwitchCheckDefault");

taxSwitch.addEventListener("click", ()=> {
    const label = document.querySelector('.tax-label');
    let taxInfo = document.getElementsByClassName("tax-info");
    for(info of taxInfo){
        if(info.style.display != "inline"){
            info.style.display = "inline";
            label.textContent = 'Display total before taxes';
        }
        else{
            info.style.display = "none";
            label.textContent = 'Display total after taxes';
        }
    }
});