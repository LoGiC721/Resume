





function pdf()
{
   document.getElementById("buttonn").remove();
    window.print();
    var template=
    `
    <div id="body1">
    <div id="buttonn" class="text-center">
      <br><br><br>
      <style>
            body{
              background: #c4c4c4;
            }
            .flexxx{
                display:flex;
                align-items:center;
                justify-content: space-around;
            }
            .container{
                max-width:800px;
            }
            @media(max-width:768px)
            {
                .flexxx{
                    display:flex;
                    flex-direction: column;
                }
                .down{
                    margin-bottom:15px;
                }
                
                .bottom{
                    margin-bottom:-8px;
                }
                
            }
      </style>

      <div class="container flexxx">
    <button class="btn btn-dark btn-lg text-light down"  onclick="pdf()" 
    onMouseOver="this.style.background='#cf0000'"
    onMouseOut="this.style.background='#1C1F23'">
    <i class="fa fa-laptop" aria-hidden="true"></i>Download</button>

    <button class="btn btn-light btn-lg text-dark down white" onclick="mobile1()" 
    onMouseOver="this.style.background='#cf0000'"
    onMouseOut="this.style.background='white'">
    <img src="https://img.icons8.com/material-rounded/24/000000/android.png"/>Download</button>



<a class="btn btn-light btn-lg text-dark down white"  href="/profile" 
onMouseOver="this.style.background='#cf0000'" onMouseOut="this.style.background='white'">
    <i class="fas fa-edit"></i>Edit Details</a>

    <a class="btn btn-dark btn-lg text-light down bottom" href="/" 
    onMouseOver="this.style.background='#cf0000';"
    onMouseOut="this.style.background=''"><i class="fa fa-arrow-left" aria-hidden="true"></i>
        Back to Home</a> 

      <br><br><br>
    </div>


      </div>
    </div>

    `;
    document.getElementById("body1").innerHTML=template;
    
}


