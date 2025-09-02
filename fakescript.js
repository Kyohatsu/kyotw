// made by Costache Madalin (lllll llll)
// discord: costache madalin#8472

var backgroundColor = "#32313f";
var borderColor = "#3e6147";
var headerColor = "#202825";
var titleColor = "#ffffdf";

var countApiKey = "generateFakeScript";
var countNameSpace="madalinoTribalWarsScripts"

var headerWood="#001a33"
var headerWoodEven="#002e5a"
var headerStone="#3b3b00"
var headerStoneEven="#626200"
var headerIron="#1e003b"
var headerIronEven="#3c0076"

var defaultTheme= '[["theme1",["#E0E0E0","#000000","#C5979D","#2B193D","#2C365E","#484D6D","#4B8F8C","35"]],["currentTheme","theme1"],["theme2",["#E0E0E0","#000000","#F76F8E","#113537","#37505C","#445552","#294D4A","35"]],["theme3",["#E0E0E0","#000000","#ACFCD9","#190933","#665687","#7C77B9","#623B5A","35"]],["theme4",["#E0E0E0","#000000","#181F1C","#60712F","#274029","#315C2B","#214F4B","35"]],["theme5",["#E0E0E0","#000000","#9AD1D4","#007EA7","#003249","#1F5673","#1C448E","35"]],["theme6",["#E0E0E0","#000000","#EA8C55","#81171B","#540804","#710627","#9E1946","35"]],["theme7",["#E0E0E0","#000000","#754043","#37423D","#171614","#3A2618","#523A34","35"]],["theme8",["#E0E0E0","#000000","#9E0031","#8E0045","#44001A","#600047","#770058","35"]],["theme9",["#E0E0E0","#000000","#C1BDB3","#5F5B6B","#323031","#3D3B3C","#575366","35"]],["theme10",["#E0E0E0","#000000","#E6BCCD","#29274C","#012A36","#14453D","#7E52A0","35"]]]'
var localStorageThemeName = "generateFakeScript"

  textColor="#ffffff"
var backgroundInput="#000000"

var borderColor = "#C5979D";//#026440
var backgroundContainer="#2B193D"
var backgroundHeader="#2C365E"
var backgroundMainTable="#484D6D"
var backgroundInnerTable="#4B8F8C"

var widthInterface=50;//percentage
var headerColorDarken=-50 //percentage( how much the header should be darker) if it's with -(darker) + (lighter)
var headerColorAlternateTable=-30;
var headerColorAlternateHover=30;

var backgroundAlternateTableEven=backgroundContainer;
var backgroundAlternateTableOdd=getColorDarker(backgroundContainer,headerColorAlternateTable);



var idInterval=0

async function main(){
    initializationTheme()
    await $.getScript("https://cdn.jsdelivr.net/gh/Kyohatsu/TW-Scripts/styleCSSGlobal.js");
    createMainInterface()
    changeTheme()
    hitCountApi()


    


}
main()



function getColorDarker(hexInput, percent) {
    let hex = hexInput;

    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, "");

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length === 3) {
        hex = hex.replace(/(.)/g, "$1$1");
    }

    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    const calculatedPercent = (100 + percent) / 100;

    r = Math.round(Math.min(255, Math.max(0, r * calculatedPercent)));
    g = Math.round(Math.min(255, Math.max(0, g * calculatedPercent)));
    b = Math.round(Math.min(255, Math.max(0, b * calculatedPercent)));

    return `#${("00"+r.toString(16)).slice(-2).toUpperCase()}${("00"+g.toString(16)).slice(-2).toUpperCase()}${("00"+b.toString(16)).slice(-2).toUpperCase()}`
}

function createMainInterface(){
    
    let html=`
    
    <div id="div_container" class="scriptContainer">
        <div class="scriptHeader">
            <div style=" margin-top:10px;"><h2>Generate fake script</h2></div>
            <div style="position:absolute;top:10px;right: 10px;"><a href="#" onclick="$('#div_container').remove()"><img src="https://img.icons8.com/emoji/24/000000/cross-mark-button-emoji.png"/></a></div>
            <div style="position:absolute;top:8px;right: 35px;" id="div_minimize"><a href="#"><img src="https://img.icons8.com/plasticine/28/000000/minimize-window.png"/></a></div>
            <div style="position:absolute;top:10px;right: 60px;" id="div_theme"><a href="#" onclick="$('#theme_settings').toggle()"><img src="https://img.icons8.com/material-sharp/24/fa314a/change-theme.png"/></a></div>
        </div>
        <div id="theme_settings"></div>

        <div id="div_body">
            <table id="settings_table" class="scriptTable">
                <tr>
                    <td style="width:30%">admin id</td>
                    <td><input type="text"  id="input_admin_id" class="scriptInput" placeholder="name" value="${game_data.player.id}"></td>
                </tr>
                <tr>
                    <td>world number</td>
                    <td><input type="text"  id="input_number_world" class="scriptInput" placeholder="name" value="${game_data.world.match(/\d+/)[0]}"></td>
                </tr>
                <tr>
                    <td>database name</td>
                    <td><input type="text"  id="input_database_name" class="scriptInput" placeholder="anything is good" value="PleaseWork"></td>
                </tr>
                <tr>
                    <td>link script</td>
                    <td><textarea id="input_link_script" cols="40" rows="10" placeholder="press start"></textarea></td>
                    
                </tr>
                <tr>
                    <td colspan="2"><input class="btn evt-confirm-btn btn-confirm-yes" type="button" id="btn_start" onclick="generateScript()" value="Start"></td>
                </tr>
            </table>
        </div>
        <div class="scriptFooter">
            <div style=" margin-top:5px;"><h5>made by Costache</h5></div>
        </div>
    </div>`




    
    ////////////////////////////////////////add and remove window from page///////////////////////////////////////////
    $("#div_container").remove()
    $("#contentContainer").eq(0).prepend(html);
    $("#mobileContent").eq(0).prepend(html);


    $("#div_container").css("position","fixed");
    $("#div_container").draggable();
    

    $("#div_minimize").on("click",()=>{
        let currentWidthPercentage=Math.ceil($('#div_container').width() / $('body').width() * 100);
        if(currentWidthPercentage >=widthInterface ){
            $('#div_container').css({'width' : '10%'});
            $('#div_body').hide();
        }
        else{
            $('#div_container').css({'width' : `${widthInterface}%`});
            $('#div_body').show();
        }
    })

    
}

function changeTheme(){
    let html= `
    <h3 style="color:${textColor};padding-left:10px;padding-top:5px">after theme is selected run the script again<h3>
    <table class="scriptTable" >
        
        <tr>
            <td>
                <select  id="select_theme">
                    <option value="theme1">theme1</option>
                    <option value="theme2">theme2</option>
                    <option value="theme3">theme3</option>
                    <option value="theme4">theme4</option>
                    <option value="theme5">theme5</option>
                    <option value="theme6">theme6</option>
                    <option value="theme7">theme7</option>
                    <option value="theme8">theme8</option>
                    <option value="theme9">theme9</option>
                    <option value="theme10">theme10</option>
                </select>
            </td>
            <td>value</td>
            <td >color hex</td>
        </tr>
        <tr>
            <td>textColor</td>
            <td style="background-color:${textColor}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${textColor}"></td>
        </tr>
        <tr>
            <td>backgroundInput</td>
            <td style="background-color:${backgroundInput}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundInput}"></td>
        </tr>
        <tr>
            <td>borderColor</td>
            <td style="background-color:${borderColor}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${borderColor}"></td>
        </tr>
        <tr>
            <td>backgroundContainer</td>
            <td style="background-color:${backgroundContainer}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundContainer}"></td>
        </tr>
        <tr>
            <td>backgroundHeader</td>
            <td style="background-color:${backgroundHeader}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundHeader}"></td>
        </tr>
        <tr>
            <td>backgroundMainTable</td>
            <td style="background-color:${backgroundMainTable}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundMainTable}"></td>
        </tr>
        <tr>
            <td>backgroundInnerTable</td>
            <td style="background-color:${backgroundInnerTable}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundInnerTable}"></td>
        </tr>
        <tr>
            <td>widthInterface</td>
            <td><input type="range" min="25" max="100" class="slider input_theme" id="input_slider_width" value="${widthInterface}"></td>
            <td id="td_width">${widthInterface}%</td>
        </tr>
        <tr >
            <td><input class="btn evt-confirm-btn btn-confirm-yes" type="button" id="btn_save_theme" value="Save"></td>
            <td><input class="btn evt-confirm-btn btn-confirm-yes" type="button" id="btn_reset_theme" value="Default themes"></td>
            <td></td>
        </tr>

    </table>
    `
    $("#theme_settings").append(html)
    $("#theme_settings").hide()

    let selectedTheme = ""
    let colours =[]
    let mapTheme = new Map()

    $("#select_theme").on("change",()=>{
        if(localStorage.getItem(localStorageThemeName) != undefined){
            selectedTheme = $('#select_theme').find(":selected").text();
            colours = Array.from($(".input_theme")).map(elem=>elem.value.toUpperCase().trim())
            mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))
            console.log(selectedTheme)
            console.log(mapTheme)
            colours = mapTheme.get(selectedTheme)
            console.log(colours)
            Array.from($(".input_theme")).forEach((elem,index)=>{
                elem.value = colours[index]
            })
            Array.from($(".td_background")).forEach((elem,index)=>{
                elem.style.background = colours[index]
            })

            mapTheme.set("currentTheme",selectedTheme)
            localStorage.setItem(localStorageThemeName, JSON.stringify(Array.from(mapTheme.entries())))
        }
    })

    $("#btn_save_theme").on("click",()=>{
        colours = Array.from($(".input_theme")).map(elem=>elem.value.toUpperCase().trim())
        selectedTheme = $('#select_theme').find(":selected").text();

        for(let i=0;i<colours.length-1;i++){
            if(colours[i].match(/#[0-9 A-F]{6}/) == null ){
                UI.ErrorMessage("wrong colour: "+colours[i])  
                throw new Error("wrong colour")
            }
        }

        if(localStorage.getItem(localStorageThemeName) != undefined)
            mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))


        mapTheme.set(selectedTheme,colours)
        mapTheme.set("currentTheme",selectedTheme)

        localStorage.setItem(localStorageThemeName, JSON.stringify(Array.from(mapTheme.entries())))
        console.log("saved colours for: "+selectedTheme)
        UI.SuccessMessage(`saved colours for: ${selectedTheme} \n run the script again`,1000)


    })

    $("#btn_reset_theme").on("click",()=>{
        localStorage.setItem(localStorageThemeName, defaultTheme)
        UI.SuccessMessage("run the script again",1000)

    })
    $("#input_slider_width").on("input",()=>{
        $("#td_width").text($("#input_slider_width").val()+"%")
    })


    if(localStorage.getItem(localStorageThemeName) != undefined){
        mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))
        let currentTheme=mapTheme.get("currentTheme")
        document.querySelector('#select_theme').value=currentTheme
    }

    
}

function initializationTheme(){
    if(localStorage.getItem(localStorageThemeName) != undefined){
        let mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))
        let currentTheme=mapTheme.get("currentTheme")
        let colours=mapTheme.get(currentTheme)

        textColor=colours[0]
        backgroundInput=colours[1]

        borderColor = colours[2]
        backgroundContainer=colours[3]
        backgroundHeader=colours[4]
        backgroundMainTable=colours[5]
        backgroundInnerTable=colours[6]
        widthInterface=colours[7]

        backgroundAlternateTableEven=backgroundContainer;
        backgroundAlternateTableOdd=getColorDarker(backgroundContainer,headerColorAlternateTable);       
        console.log("textColor: "+textColor)
        console.log("backgroundContainer: "+backgroundContainer)
        
    }
    else{
        localStorage.setItem(localStorageThemeName, defaultTheme)

        let mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))
        let currentTheme=mapTheme.get("currentTheme")
        let colours=mapTheme.get(currentTheme)

        textColor=colours[0]
        backgroundInput=colours[1]

        borderColor = colours[2]
        backgroundContainer=colours[3]
        backgroundHeader=colours[4]
        backgroundMainTable=colours[5]
        backgroundInnerTable=colours[6]
        widthInterface=colours[7]

        backgroundAlternateTableEven=backgroundContainer;
        backgroundAlternateTableOdd=getColorDarker(backgroundContainer,headerColorAlternateTable);  
    }

}



async function generateScript(){  
    UI.SuccessMessage("generating database...\n wait couple of seconds")
    await insertCryptoLibrary();
    let market = game_data.world.match(/[a-z]+/)[0];

    let nameAdmin = document.getElementById("input_admin_id").value;
    let databaseName=document.getElementById("input_database_name").value
    let numberWorld=document.getElementById("input_number_world").value
    let playerName = game_data.player.name
    databaseName= `FakeScriptDB/${market}/${numberWorld}/${databaseName}_${playerName}_${nameAdmin}`
    
    let plainText=`
        dropboxToken="${ CryptoJS.AES.decrypt("U2FsdGVkX1/6wzFsxv1u7NwiDdhq+t+Ck5XRU3/axVCb2ujjSuDtIhxQPwYv+fu5QCfsQjraV1CzmrbTKLN0Hh5UtsaPWDNYAU5bzqJjytQ4jvRWm9dlnwaVRgCngaur", "whatup").toString(CryptoJS.enc.Utf8)}";
        databaseName="${databaseName}";
        runWorld=${numberWorld};
        adminBoss="${nameAdmin}";
    `
    let key = CryptoJS.AES.encrypt(plainText, "automateThisAnnoyingPart").toString()
    let outputfakeScript=`javascript:var encryptedData='${key}';
    $.getScript('https://dl.dropboxusercontent.com/s/2q29vaqbibe6tph/fakeScriptMain.js?dl=0');void(0);`


    let filname_ally = `${databaseName}/ally.txt`
    let filname_admin = `${databaseName}/admin.txt`

    let filename_fakes1 = `${databaseName}/fakes1.txt`
    let filename_fakes2 = `${databaseName}/fakes2.txt`
    let filename_fakes3 = `${databaseName}/fakes3.txt`
    let filename_fakes4 = `${databaseName}/fakes4.txt`
    let filename_fakes5 = `${databaseName}/fakes5.txt`
    let filename_fakes6 = `${databaseName}/fakes6.txt`
    let filename_fakes7 = `${databaseName}/fakes7.txt`
    let filename_fakes8 = `${databaseName}/fakes8.txt`
    let filename_fakes9 = `${databaseName}/fakes9.txt`
    let filename_fakes10 = `${databaseName}/fakes10.txt`
    
    try {  
        await readFileDropbox(filname_ally)
        await readFileDropbox(filname_admin)

        await readFileDropbox(filename_fakes1)
        await readFileDropbox(filename_fakes2)
        await readFileDropbox(filename_fakes3)
        await readFileDropbox(filename_fakes4)
        await readFileDropbox(filename_fakes5)
        await readFileDropbox(filename_fakes6)
        await readFileDropbox(filename_fakes7)
        await readFileDropbox(filename_fakes8)
        await readFileDropbox(filename_fakes9)
        await readFileDropbox(filename_fakes10)
        UI.ErrorMessage("database already exists")
        console.log("files already exists")
    } catch (error) {
        await uploadFile("[]", filname_ally)
        await uploadFile("[]", filname_admin)

        await uploadFile("[]", filename_fakes1)
        await uploadFile("[]", filename_fakes2)
        await uploadFile("[]", filename_fakes3)
        await uploadFile("[]", filename_fakes4)
        await uploadFile("[]", filename_fakes5)
        await uploadFile("[]", filename_fakes6)
        await uploadFile("[]", filename_fakes7)
        await uploadFile("[]", filename_fakes8)
        await uploadFile("[]", filename_fakes9)
        await uploadFile("[]", filename_fakes10)
        console.log("files created")

    }
    document.getElementById("input_link_script").value=outputfakeScript

}

function insertCryptoLibrary(){
    return new Promise((resolve,reject)=>{


        let start=new Date().getTime()
        let script = document.createElement('script');
        script.type="text/javascript"
        script.src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"
        script.onload = function () {
            let stop=new Date().getTime()
            console.log(`insert crypto-js library in ${stop-start} ms`)
            resolve("done")
        };
        document.head.appendChild(script);
    })
}

function uploadFile(data, filename) {
    return new Promise((resolve, reject) => {
        var file = new Blob([data], { type: "plain/text" });
        var nr_start1 = new Date().getTime();
        file.name = filename;

        //stop refreshing the page
        $(document).bind("keydown", disableF5);
        window.onbeforeunload = function(e) {
            console.log("is uploading");
            return "are you sure?";
        };

        var xhr = new XMLHttpRequest();
        xhr.upload.onprogress = function(evt) {
            console.log(evt)
            var percentComplete = parseInt(100.0 * evt.loaded / evt.total);
            console.log(percentComplete)
            UI.SuccessMessage("progress upload: " + percentComplete + "%")
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                var fileInfo = JSON.parse(xhr.response);
                // Upload succeeded. Do something here with the file info.
                UI.SuccessMessage("upload succes")
                var nr_stop1 = new Date().getTime();
                console.log("time upload: " + (nr_stop1 - nr_start1))

                //enable refresh page
                window.onbeforeunload = function(e) {
                    console.log("done");
                };
                $(document).unbind("keydown", disableF5);
                resolve("succes")

            } else {
                var errorMessage = xhr.response || 'Unable to upload file';
                // Upload failed. Do something here with the error.
                UI.SuccessMessage("upload failed")
                reject(errorMessage)
            }
        };

        xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload', false);
        xhr.setRequestHeader('Authorization', 'Bearer ' + CryptoJS.AES.decrypt("U2FsdGVkX1/6wzFsxv1u7NwiDdhq+t+Ck5XRU3/axVCb2ujjSuDtIhxQPwYv+fu5QCfsQjraV1CzmrbTKLN0Hh5UtsaPWDNYAU5bzqJjytQ4jvRWm9dlnwaVRgCngaur", "whatup").toString(CryptoJS.enc.Utf8));
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
            path: '/' + file.name,
            mode: 'add',
            autorename: true,
            mode: 'overwrite',
            mute: false
        }));

        xhr.send(file)
    })
}
function readFileDropbox(filename) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://content.dropboxapi.com/2/files/download",
            method: 'POST',
            dataType: "text",
            headers: {
                'Authorization': 'Bearer ' + CryptoJS.AES.decrypt("U2FsdGVkX1/6wzFsxv1u7NwiDdhq+t+Ck5XRU3/axVCb2ujjSuDtIhxQPwYv+fu5QCfsQjraV1CzmrbTKLN0Hh5UtsaPWDNYAU5bzqJjytQ4jvRWm9dlnwaVRgCngaur", "whatup").toString(CryptoJS.enc.Utf8),
                'Dropbox-API-Arg': JSON.stringify({ path: "/" + filename })
            },

            success: (data) => {
                resolve(data)
            },
            error: (err) => {
                console.log(err)
                reject(err)
            }
        })
    })
}
function disableF5(e) { if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault(); };



function hitCountApi(){
    $.getJSON(`https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}/up`, response=>{
        console.log(`This script has been run: ${response.count} times`);
    });
    if(game_data.device !="desktop"){
        $.getJSON(`https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_phone/up`, response=>{
            console.log(`This script has been run on mobile: ${response.count} times`);
        });
    }
 
    $.getJSON(`https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_id2${game_data.player.id}/up`, response=>{
        if(response.count == 1){
            $.getJSON(`https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_scriptUsers/up`, response=>{});
        }

    });

    try {
        $.getJSON(`https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_scriptUsers`, response=>{
            console.log(`Total number of users: ${response.count}`);
        }); 
      
    } catch (error) {}


}
