var fs = require('fs');
var path = require('path');
var os = require('os');
var gui = require('nw.gui');
var win = gui.Window.get();
var ncp = require('ncp').ncp;

ncp.limit = 1000;
var ConfigFilePath = path.join(path.dirname(process.execPath),"config.json");

$(function(){
	$(window).on('focus', function () {
		$("#nav-title").css("background-color","#222222");
  	});

  	$(window).on('blur', function () {
		$("#nav-title").css("background-color","#7a7c7c");
  	});

	$('#nav-title-close').click(function(){
		win.close();
	});			

	$('#nav-title-minimize').click(function(){
		win.minimize();
	});

	$('#btn-Add').click(function(){
		var sourcePath = $("#tb-Source").val();
		var targetPath = $("#tb-Target").val();
		AddSyncNode(sourcePath,targetPath);
	});
});


function AddSyncNode(sourcePath,targetPath) {
	var row = document.createElement("div");
	row.className = "row";

	var col = document.createElement("div");
	col.className = "col-md-12";

	var ul = document.createElement("ul");
	ul.className = "list-group";
	
	var sourceli = document.createElement("li");
	sourceli.className = "list-group-item text-primary";
	sourceli.appendChild(document.createTextNode(sourcePath));

	var targetli = document.createElement("li");
	targetli.className = "list-group-item text-danger";
	targetli.appendChild(document.createTextNode(targetPath));

	var syncBtnli = document.createElement("li");
	syncBtnli.className = "list-group-item";

	var syncBtn = document.createElement("BUTTON");
	syncBtn.className = "btn btn-success";
	var btnSpan = document.createElement("span");
	btnSpan.className = "glyphicon glyphicon-transfer";
	syncBtn.appendChild(btnSpan);
	syncBtn.appendChild(document.createTextNode(" 正向同步"));
	syncBtn.addEventListener("click", function(){		
		 SyncFolder(sourcePath,targetPath);	
	} , false);

 	syncBtnli.appendChild(syncBtn);

	ul.appendChild(sourceli);
	ul.appendChild(targetli);
	ul.appendChild(syncBtnli);

	col.appendChild(ul);
	row.appendChild(col);

 	$("#rowContainer").append(row);
}

function SyncFolder(sourcePath,targetPath)
{
	ncp(sourcePath, targetPath, function (err) {
		if (err) {
   		return alert(err);
 		}
 		alert('done!');
	});
}

