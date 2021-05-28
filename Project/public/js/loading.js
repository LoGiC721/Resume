
var doc=document.querySelector('body').innerHTML;
var preloaderHTML = `
        <style>
        body{
            margin:0;
            padding:0;
            height:100vh;
        
        }
        
        .loader{
            background: #111;
            width: 100%;
            height:100vh;
            display:flex;
            justify-content: center;
            align-items: center;
        }
        .loader div{
            background: #fff;
            width:16px;
            height:32px;
            margin-left:10px;
            animation: loader 1.2s infinite;
        
        }
        
        @keyframes loader{
            50%{
                height:64px;
        
            }
        }
        
        .loader div:nth-child(1)
        {
            background:#56C9AA;
            animation-delay: -0.40s;
        }
        .loader div:nth-child(2)
        {
            background:#56C9AA;
            animation-delay: -0.20s;
        }
        .loader div:nth-child(3)
        {
            background:#56C9AA;
            animation-delay: 0s;
        }
        
        </style>
        
        
                <div class="loader">
                     <div></div>
                   <div></div>
                <div></div>
                    
            </div>

                `;

var request = new XMLHttpRequest();

request.onreadystatechange = function() {

    if(!(request.readyState == 4 && request.status == 200)) {
        document.querySelector('body').innerHTML = preloaderHTML;
                
     }
            
     
     else{
      
      document.querySelector('body').innerHTML = doc;
    }

};

var currentpage=document.getElementById("page").value;
// console.log(currentpage);
  request.open("GET", currentpage, true);
request.send();