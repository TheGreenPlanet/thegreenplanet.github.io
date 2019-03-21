var g_editor;
$(document).ready(function(){
    var code = $(".codemirror-textarea")[0];
    g_editor  = CodeMirror.fromTextArea(code, {
        lineNumbers : true, theme : "darcula", mode: "text/x-c++src"});
});