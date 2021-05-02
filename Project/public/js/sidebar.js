document.getElementById("sidebarCollapse").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle('active');
});


document.getElementById("uncoloured").addEventListener("click", function() {
    console.log("clicked");
    document.getElementById("coloured").classList.toggle('active');
});