

function togglee(){
    document.getElementById("sidebar").classList.toggle('active');
}


    $(document).ready(function(){
        $('input[type="file"]').change(function(e){
            var fileName = e.target.files[0].name;
            document.getElementById("fname").innerHTML=fileName;
        });
    });













