"use strict"
var curr_domain = window.location.host;
let speed;
let unhide;
var w;
function ShowUpload(){
    let btn = document.getElementById("upload");
    let src = document.getElementById("link");
    src.innerHTML="";
    btn.setAttribute("style","");
}
function Show(element) {
    let pointer = document.getElementById(element);
    if (pointer.hasAttribute("hidden")) {
        pointer.removeAttribute("hidden");
    } else {
        pointer.setAttribute("hidden", "");
    }
}
function ShowHidden(){
    let container = document.getElementById("files");
    let i=0;
    for(i=0;i<container.childNodes.length;i++){
        if(container.childNodes[i].nodeName=="DIV")
        {
            if(container.childNodes[i].hasAttribute("hiddenF")){
                unhide=true;
                if(container.childNodes[i].hasAttribute("hidden")){
                    container.childNodes[i].removeAttribute("hidden");
                }else{
                    container.childNodes[i].setAttribute("hidden","");
                    unhide=false;
                }
            }
        }
    }
}
function QR(link){
    Show('security-shadow');
    Show('qr');
    var qrc = new QRCode(document.getElementById("qr-area"), link);
}
function Copy(link){
    navigator.clipboard.writeText(link);
    $.toast('Link Copied!', {type:'success'});
}
function SecInfo(){
    $.ajax({
        url: "./api/?action=loginsdata",
        success: function (seek){
            let json = seek;
            var obj = JSON.parse(json);
            let i=0;
            let table= document.getElementById("security-table-access");
            table.innerHTML="";
            for(i=0;i<obj.result.length;i++){
                let date = new Date(parseInt(obj.result[i].Time)*1000);
                table.innerHTML+=`<tr>
                <th>`+obj.result[i].IP+`</th>
                <th>`+obj.result[i].Location+`</th>
                <th><a title="Show User Agent"><svg onclick="alert('`+obj.result[i].UserAgent+`')" xmlns="http://www.w3.org/2000/svg" width="13" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg></a></th>
                <th>`+date.toLocaleDateString('it-it')+" "+date.toLocaleTimeString('it-IT')+`</th>
                </tr>`;
            }
        }
    })
    Show('security-shadow');
    Show('security-info-card');
}
function AskDelete(id){
    Show('security-shadow');
    Show('delete-ask');
    document.getElementById("doDelete").setAttribute("onclick","parent.location='./api/?action=delete&id="+id+"'");
}
function GetVariables(){
    var $_GET = {};
    if(document.location.toString().indexOf('?') !== -1) {
        var query = document.location
                    .toString()
                    .replace(/^.*?\?/, '')
                    .replace(/#.*$/, '')
                    .split('&');
        for(var i=0, l=query.length; i<l; i++) {
        var aux = decodeURIComponent(query[i]).split('=');
        $_GET[aux[0]] = aux[1];
        }
    }
    return $_GET;
}
function GetShareCode(){
    let $_GET=GetVariables();
    $.ajax({
        url: "./api/?action=getdata&id="+$_GET['code'],
        success: function (seek){
            let json = seek;
            var obj = JSON.parse(json);
            let title = obj.result[0].Title;
            let tooltip =title;
            if(title.length > 21){
                let n =0;
                let newtit="";
                for(n=0;n<21;n++){
                    newtit+=title[n];
                }
                newtit+="...";
                title=newtit;
            }
            let table = document.getElementById("file");
            let mainIcon=LesMimes(obj.result[0].Title)
                if(mainIcon==""){
                    mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/bin-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                  </img>`;
                }else{
                    switch(mainIcon){
                        case "img":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/picture-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                        case "video":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/video-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                        case "audio":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/audio-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                        case "text":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/text-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                        case "pdf":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/pdf-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                        case "html":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/bin-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                    }
                }
            table.innerHTML=`
            <img src="./favicon.png" style="margin-top:20vh" width="60px">
            <br/>
            <br/>
            <h2>FileDrop</h2>
            <br/>
            <br/>
            <br/>
            <div class="share-file" style="color:#0d6efd;margin:auto;max-width:200px">
                <a href="./api/?action=search&id=`+$_GET['code']+`" style="cursor:pointer;text-decoration:none;display:block">
                    `+mainIcon+`
                    <br/>
                    <br/>
                    <p title="`+tooltip+`">`+title+`</p>
                    <a class="quickactions" style="color:#0d6efd;cursor:pointer;" id="file-1"></a>
                    <p>`+(parseFloat(obj.result[0].Size)/1000000).toFixed(2)+` MB</p>
                </a>
            <div>
            `;
            let id ="file-1";
            let filearef=document.getElementById(id);
            if(LesMimes(obj.result[0].Title)!=""){
                let what=LesMimes(obj.result[0].Title);
                filearef.setAttribute("title","Preview");
                filearef.setAttribute("onclick","Preview('"+obj.result[0].Code+`','`+what+"');");
                filearef.innerHTML+=`
                <img width="26" height="26" fill="currentColor" src="./img/preview.png" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">    
                </img>
                <br/>
                <br/>
                `;
            }
        }
    })
}
function CheckVariables(){
    let $_GET = GetVariables();
    if($_GET['res']=="nologin"){
        $.toast('You Must be Logged in to Continue', {type:'danger'});
    }
    if($_GET['notecode']!="" && $_GET['notecode']!=undefined){
        window.close();
    }
    if($_GET['res']=="wrong"){
        $.toast('Wrong Credentials', {type:'danger'});
    }
    if($_GET['res']=="noupload"){
        $.toast('File Upload Failed!', {type:'danger'});
    }
    if($_GET['res']=="filenotfound"){
        $.toast('File Not Found', {type:'danger'});
    }
    if($_GET['upcode']!=undefined){
        $.toast('File Uploaded', {type:'success'});
    }
    if($_GET['res']=="downlink"){
        let src = document.getElementById("linkaddr");
        src.setAttribute("value",$_GET['id']);
    }
    if($_GET['res']=="shared"){
        let src = document.getElementById("link");
        src.innerHTML=`<br/><br/><br/><button type="button" onclick="Copy('https://`+curr_domain+`/share.html?code=`+$_GET['id']+`')" class="sharing btn btn-secondary"><svg width="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.503 4.627 5.5 6.75v10.504a3.25 3.25 0 0 0 3.25 3.25h8.616a2.251 2.251 0 0 1-2.122 1.5H8.75A4.75 4.75 0 0 1 4 17.254V6.75c0-.98.627-1.815 1.503-2.123ZM17.75 2A2.25 2.25 0 0 1 20 4.25v13a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-13A2.25 2.25 0 0 1 8.75 2h9Z" ></svg>&nbsp;Copy Shared Link</button>
        <button type="button" onclick="QR('https://`+curr_domain+`//share.html?code=`+$_GET['id']+`')" class="sharing btn btn-secondary"><svg width="20" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 6H6v2h2V6Z" fill="#ffffff"/><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h3A2.5 2.5 0 0 1 11 5.5v3A2.5 2.5 0 0 1 8.5 11h-3A2.5 2.5 0 0 1 3 8.5v-3ZM5.5 5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3ZM6 16h2v2H6v-2Z" fill="#ffffff"/><path d="M3 15.5A2.5 2.5 0 0 1 5.5 13h3a2.5 2.5 0 0 1 2.5 2.5v3A2.5 2.5 0 0 1 8.5 21h-3A2.5 2.5 0 0 1 3 18.5v-3Zm2.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3ZM18 6h-2v2h2V6Z" fill="#ffffff"/><path d="M15.5 3A2.5 2.5 0 0 0 13 5.5v3a2.5 2.5 0 0 0 2.5 2.5h3A2.5 2.5 0 0 0 21 8.5v-3A2.5 2.5 0 0 0 18.5 3h-3ZM15 5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3ZM13 13h2.75v2.75H13V13ZM18.25 15.75h-2.5v2.5H13V21h2.75v-2.75h2.5V21H21v-2.75h-2.75v-2.5ZM18.25 15.75V13H21v2.75h-2.75Z" fill="#ffffff"/></svg>&nbsp;Show QR Code</button>
        <button class="sharing btn btn-secondary" onclick="ShowMail('`+$_GET['id']+`');"><svg width="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23 6.75A3.75 3.75 0 0 0 19.25 3l-.102.007A.75.75 0 0 0 19.25 4.5l.154.005A2.25 2.25 0 0 1 19.25 9l-.003.005-.102.007a.75.75 0 0 0 .108 1.493V10.5l.2-.005A3.75 3.75 0 0 0 23 6.75Zm-6.5-3a.75.75 0 0 0-.75-.75l-.2.005a3.75 3.75 0 0 0 .2 7.495l.102-.007A.75.75 0 0 0 15.75 9l-.154-.005A2.25 2.25 0 0 1 15.75 4.5l.102-.007a.75.75 0 0 0 .648-.743Zm3.5 3a.75.75 0 0 0-.75-.75h-3.5l-.102.007A.75.75 0 0 0 15.75 7.5h3.5l.102-.007A.75.75 0 0 0 20 6.75Zm-.75 4.75h-2.77l-4.132 2.164a.75.75 0 0 1-.696 0L2 8.608v8.142l.005.184A3.25 3.25 0 0 0 5.25 20h13.5l.184-.005A3.25 3.25 0 0 0 22 16.75v-6.127a4.728 4.728 0 0 1-2.75.877ZM5.25 4h6.627a4.751 4.751 0 0 0 2.057 7.14L12 12.153l-9.984-5.23a3.25 3.25 0 0 1 3.048-2.918L5.25 4Z"></svg>&nbsp;Send via Email</button>
        <br/>
        <br/>
        ` ;
    }
    if($_GET['res']!="nologin"){
        GetFileList();
    }
}
function LoadOccSpace(){
    $.ajax({
        url: "./api/?action=account-size",
        success: function (seek){
            let json = seek;
            var obj = JSON.parse(json);
            let space = document.getElementById("occ-space");
            space.innerHTML=`Occ. Space: <b>`+(parseFloat(obj.result[0].Size)/1000000).toFixed(2)+`MB</b>&nbsp;<a title="Over `+obj.result[0].NoF+` Files"><svg xmlns="http://www.w3.org/2000/svg" width="13" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>`;
        }
    })
}
function ShowMail(id){
    document.getElementById('send').setAttribute("onclick","ShareMail('"+id+"')");
    Show('security-shadow');
    Show('mail-ask');
}
function Upload(){
    let form = document.getElementById("fileform");
    let over = document.getElementById("over");
    //var fSize = (document.getElementById('fileupload').files[0].size)/8;
    //let time = fSize/speed;
    over.innerHTML='<div style="min-width:100%;min-height:20vh;position:relative;opacity:40%;z-index:1000;"><br/><br/><img src="./img/loading-spinner.gif" width="50px"></div>';
    over.setAttribute("style","min-width:100%;text-align:center;min-height:100vh;margin:auto;");
    window.scrollTo(0,0);
    form.submit();
}
function HideShare(){
    let data = document.getElementById('link');
    data.remove();
}
function ShareMail(code){
    let send = document.getElementById("send");
    let dest = document.getElementById("share-mail-input");
    dest = dest.value;
    $.ajax({
        url: "./api/?action=sharemail&dest="+dest+"&id="+code,
        success: function (seek){
            let json = seek;
            if(json=="ok"){
                $.toast('Email Sent!', {type:'success'});
                ShowMail(0);
            }else{
                $.toast('Could\'t Send Email', {type:'danger'});
            }
        }
    })
}
function LesMimes(filename){
    let split=filename.split(".");
    let splitLength=split.length;

    let ret = "";
    switch((split[splitLength-1]).toUpperCase()){
        default:

            //MIME Not Found

            break;

        //Pictures

        case "PNG":
            ret="img";
            break;
        case "JPG":
            ret="img";
            break;
        case "JPEG":
            ret="img";
            break;
        case "BMP":
            ret="img";
            break;
        case "FIF":
            ret="img";
            break;
        case "GIF":
            ret="img";
            break;
        case "ICO":
            ret="img";
            break;
        case "ICO":
            ret="img";
            break;
        case "JFIF":
            ret="img";
            break;
        case "JPE":
            ret="img";
            break;
        case "TIF":
            ret="img";
            break;
        case "TIFF":
            ret="img";
            break;
        case "WEBP":
            ret="img";
            break;
        
        //Videos

        case "AVI":
            ret="video";
            break;
        case "M1V":
            ret="video";
            break;
        case "MOV":
            ret="video";
            break;
        case "MOOV":
            ret="video";
            break;
        case "MP2":
            ret="video";
            break;
        case "MPEG":
            ret="video";
            break;
        case "MP4":
            ret="video";
            break;

        //Audio

        case "AIF":
            ret="audio";
            break;
        case "AIFC":
            ret="audio";
            break;
        case "AIFF":
            ret="audio";
            break;
        case "M2A":
            ret="audio";
            break;
        case "M4A":
            ret="audio";
            break;
        case "M3U":
            ret="audio";
            break;
        case "MID":
            ret="audio";
            break;
        case "MIDI":
            ret="audio";
            break;
        case "MP2":
            ret="audio";
            break;
        case "MP3":
            ret="audio";
            break;
        case "MPA":
            ret="audio";
            break;
        case "WAV":
            ret="audio";
            break;
        case "WMA":
            ret="audio";
            break;
        case "WAVE":
            ret="audio";
            break;

        //Text

        case "TXT":
            ret="text";
            break;
        
        //PDF

        case "PDF":
            ret="pdf";
            break;
    }
    return ret;
}
function Preview(file,mime){
    window.open('./preview.html?type='+mime+"&code="+file, '_blank', 'toolbar=0,location=0,menubar=0');
}
function GetPreviewCode(){
    let $_GET = GetVariables();
    let place = document.getElementById("file");
    if($_GET['type']=="img"){
        place.innerHTML+="<img src=\"./api/index.php?action=search&id="+$_GET['code']+"\" width=\"100%\">";
        GetMetaData($_GET['code']);
    }
    if($_GET['type']=="audio"){
        place.innerHTML+="<audio controls width=\"100%\"><source src=\"./api/index.php?action=search&id="+$_GET['code']+"\"></source></audio>";
        GetMetaData($_GET['code']);
    }
    if($_GET['type']=="video"){
        if(navigator.userAgent.indexOf("iPhone")!=-1){
            let over = document.getElementById("over");
            over.innerHTML='<div style="min-width:100%;min-height:20vh;position:relative;opacity:40%;z-index:1000;"><br/><br/><img src="./img/loading-spinner.gif" width="50px"><p>Please Wait...</p></div>';
            over.setAttribute("style","min-width:100%;text-align:center;min-height:100vh;margin:auto;");
            window.scrollTo(0,0);
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "./api/?action=search&id="+$_GET['code']);
            xhr.responseType = "arraybuffer";
            
            xhr.onload = function () {
                if (this.status === 200) {
                    var blob = new Blob([xhr.response], {type: "video/mp4"});
                    var objectUrl = URL.createObjectURL(blob);
                    place.innerHTML+="<video controls width=\"100%\"><source src=\""+objectUrl+"\"></source></video>";
                    GetMetaData($_GET['code']);
                    over.remove();
                }
            };
            xhr.send();
        }else{
            place.innerHTML+="<video controls width=\"100%\"><source src=\"./api/index.php?action=search&id="+$_GET['code']+"\"></source></video>";
            GetMetaData($_GET['code']);
        }
    }
    if($_GET['type']=="text"){
        $.ajax({
            url: "./api/?action=search&id="+$_GET['code'],
            success: function (seek){
                let json = escapeHtml(seek);
                place.innerHTML+="<center><textarea style='width:100%;height:70vh'>"+json+"</textarea></center>";
                GetMetaData($_GET['code']);
            }
        })
    }
    if($_GET['type']=="pdf"){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "./api/?action=search&id="+$_GET['code']);
        xhr.responseType = "arraybuffer";
        
        xhr.onload = function () {
            if (this.status === 200) {
                var blob = new Blob([xhr.response], {type: "application/pdf"});
                var objectUrl = URL.createObjectURL(blob);
                let height = screen.height;
                height=height-100;
                place.innerHTML+="<embed width=\"100%\" height=\""+height+"px\" type=\"application/pdf\" src=\""+objectUrl+"\"></embed>";
                GetMetaData($_GET['code']);
            }
        };
        xhr.send();
    }
}
function GetMetaData(code){
    $.ajax({
        url: "./api/?action=getdataprivate&id="+code,
        success: function (seek){
            let json = seek;
            var obj = JSON.parse(json);
            let title = obj.result[0].Title;
            let tooltip =title;
            if(title.length > 40){
                let n =0;
                let newtit="";
                for(n=0;n<40;n++){
                    newtit+=title[n];
                }
                newtit+="...";
                title=newtit;
            }
            let table = document.getElementById("file");
            table.innerHTML+=`
                <br/>
                <br/>
                <h3 style="display:inline" title="`+tooltip+`">`+title+`&nbsp;<a href=\"./api/index.php?action=search&id=`+code+`\" class="quickactions">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                <a>
                <br/>
                <br/>
                <h6>`+(parseFloat(obj.result[0].Size)/1000000).toFixed(2)+` MB</h6>
                </h3>
            `;
        }
    })
}
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "'");
}
function NewNote(){
    window.open('./note.html', '_blank', 'toolbar=0,location=0,menubar=0');
}
function LoadGUI(){
    let place = document.getElementById("file");
    place.innerHTML+="<center><textarea id='note-text' name='note-text' style='width:100%;height:70vh'></textarea></center>";
}
function CancelNote(){
    window.close();
}
function StartBackgroundCheck(){
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
          w = new Worker("./js/back-check.js");
        }
        w.onmessage = function(event) {
          GetFileList();
        };
      } else {
      }
}
function GetFileList(){
    $.ajax({
        url: "./api/?action=list",
        success: function (seek){
            let json = seek;
            var obj = JSON.parse(json);
            let i;
            let table = document.getElementById("files");
            table.innerHTML="";
            for(i=obj.result.length-1;i>-1;i--){
                let title = obj.result[i].Title;
                let tooltip =title;
                let mainIcon=LesMimes(obj.result[i].Title)
                if(mainIcon==""){
                    mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/bin-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                    </img>`;
                }else{
                    switch(mainIcon){
                        case "img":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/picture-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                        case "video":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/video-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                        case "audio":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/audio-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                        case "text":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/text-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                        case "pdf":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/pdf-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                        case "html":
                            mainIcon=`<img xmlns="http://www.w3.org/2000/svg" src="./img/bin-file.png" height="66" fill="currentColor" class="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                            </img>`;
                        break;
                    }
                }
                if(title.length > 21){
                    let n =0;
                    let newtit="";
                    for(n=0;n<21;n++){
                        newtit+=title[n];
                    }
                    newtit+="...";
                    title=newtit;
                }
                let icon=`
                <img width="26" src="./img/share.png" height="26" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                </img>`;
                let href="./api/?action=share&id="+obj.result[i].Code;
                let tools = "Share File";
                let text= "Share";
                if(obj.result[i].Public == "1"){
                    icon=`
                    <img width="26" src="./img/unshare.png" height="26" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    </img>
                    `;
                    href="./api/?action=unshare&id="+obj.result[i].Code;
                    tools = "Stop Sharing";
                    text= "Stop Sharing";
                }
                if(obj.result[i].Hidden == "1"){
                    if(unhide){
                        table.innerHTML+=`
                        <div id="fic-`+i.toString()+`" hiddenF="true" class="file-info common hidden-file">
                         <a style="text-decoration:none;" href="./api/?action=search&id=`+obj.result[i].Code+`">
                         <div class="file">
                             <p class="file-icon">
                                 <br/>
                                 `+mainIcon+`
                             </svg>
                             <p>
                             <p title="`+tooltip+`">`+title+`</p>
                             <p>`+(parseFloat(obj.result[i].Size)/1000000).toFixed(2)+` MB</p>
                         </div>
                         </a>
                         <a style="color:#dc3545;" class="quickactions" onclick="AskDelete('`+obj.result[i].Code+`')">
                            <img width="26" src="./img/delete.png" height="26" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            </img>
                         </a>
                         &nbsp;
                         <a title="`+tools+`" class="quickactions" style="color:#0d6efd;" href="`+href+`">
                         `+
                         icon
                         +`
                         </a>
                         <a class="quickactions" hidden style="color:#0d6efd;" id="file-`+i+`"></a>
                         &nbsp; <a href="./api/?action=unhide&id=`+obj.result[i].Code+`" title="UnHide File" class="quickactions" style="color:#0d6efd;" id="file-h-`+i+`">
                            <img width="26" src="./img/unhide.png" height="26" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            </img>
                         </a>
                         <br/>
                         <br/>
                         </div>`;
                    }else{
                        table.innerHTML+=`
                        <div id="fic-`+i.toString()+`" hiddenF="true" hidden class="file-info common hidden-file">
                         <a style="text-decoration:none;" href="./api/?action=search&id=`+obj.result[i].Code+`">
                         <div class="file">
                             <p class="file-icon">
                                 <br/>
                                 `+mainIcon+`
                             </svg>
                             <p>
                             <p title="`+tooltip+`">`+title+`</p>
                             <p>`+(parseFloat(obj.result[i].Size)/1000000).toFixed(2)+` MB</p>
                         </div>
                         </a>
                         <a style="color:#dc3545;" class="quickactions" onclick="AskDelete('`+obj.result[i].Code+`')">
                            <img width="26" src="./img/delete.png" height="26" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            </img>
                         </a>
                         &nbsp;
                         <a title="`+tools+`" class="quickactions" style="color:#0d6efd;" href="`+href+`">
                         `+
                         icon
                         +`
                         </a>
                         <a class="quickactions" hidden style="color:#0d6efd;" id="file-`+i+`"></a>
                         &nbsp; <a href="./api/?action=unhide&id=`+obj.result[i].Code+`" title="UnHide File" class="quickactions" style="color:#0d6efd;" id="file-h-`+i+`">
                            <img width="26" src="./img/unhide.png" height="26" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            </img>
                         </a>
                         <br/>
                         <br/>
                         </div>`;
                    }
                }else{
                    table.innerHTML+=`
                    <div id="fic-`+i.toString()+`" class="file-info common">
                     <a style="text-decoration:none;" href="./api/?action=search&id=`+obj.result[i].Code+`">
                     <div class="file">
                         <p class="file-icon">
                             <br/>
                             `+mainIcon+`
                         <p>
                         <p title="`+tooltip+`">`+title+`</p>
                         <p>`+(parseFloat(obj.result[i].Size)/1000000).toFixed(2)+` MB</p>
                     </div>
                     </a>
                     <a style="color:#dc3545;" class="quickactions" onclick="AskDelete('`+obj.result[i].Code+`')">
                        <img width="26" src="./img/delete.png" height="26" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        </img>
                     </a>
                     &nbsp;
                     <a title="`+tools+`" class="quickactions" style="color:#0d6efd;" href="`+href+`">
                     `+
                     icon
                     +`
                     </a>
                     <a class="quickactions" hidden style="color:#0d6efd;" id="file-`+i+`"></a>
                     &nbsp; <a <a href="./api/?action=hide&id=`+obj.result[i].Code+`" title="Hide File" class="quickactions" style="color:#0d6efd;" id="file-h-`+i+`">
                        <img width="26" src="./img/hide.png" height="26" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        </img>
                     </a>
                     <br/>
                     <br/>
                     </div>`;
                }
                let id ="file-"+i.toString();
                let filearef=document.getElementById(id);
                if(LesMimes(obj.result[i].Title)!=""){
                    let what=LesMimes(obj.result[i].Title);
                    filearef.setAttribute("title","Preview");
                    filearef.insertAdjacentHTML('beforebegin','&nbsp;')
                    filearef.removeAttribute("hidden");
                    filearef.setAttribute("onclick","Preview('"+obj.result[i].Code+`','`+what+"');");
                    filearef.innerHTML+=`
                    <img width="26" height="26" fill="currentColor" src="./img/preview.png" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">    
                    </img>
                    `;
                }

            }
            StartBackgroundCheck();
        }
    })
    LoadOccSpace();
}