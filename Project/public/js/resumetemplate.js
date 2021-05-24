
function pdf()
{
   document.getElementById("buttonn").remove();
    window.print();
    var template=`<div id="body1" >
    <button id="buttonn" type="submit" onclick="pdf()">Click</button>
    </div>`;
    document.getElementById("body1").innerHTML=template;
    
}