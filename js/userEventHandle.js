var fs = require('fs-extra');
var path = require('path');
var gui = require('nw.gui');
var win = gui.Window.get();

var ConfigFilePath = path.join(path.dirname(process.execPath),"config.json");

$(function(){

	fs.readFile(ConfigFilePath,function (err, data){
		if(err){
			showError(err);
		}		
		else{
			var config = JSON.parse(data);
			$.each(config.pathPair,function(){				
				AddSyncNode(this.sourcePath,this.targetPath);				
			});			
		}
	});

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

		fs.readFile(ConfigFilePath,function (err, data){
			if(err){
				showError(err);
			}		
			else{
				var config = JSON.parse(data);
				var tempPathPair = {
					"sourcePath": sourcePath,
					"targetPath": targetPath
				}
				config.pathPair.push(tempPathPair);
				fs.writeFile(ConfigFilePath,JSON.stringify(config),function(err){
					if(err)
						showError(err.toString());
				});	
			}
		});
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
	syncBtnli.className = "list-group-item clearfix";

	var syncBtn = document.createElement("BUTTON");
	syncBtn.className = "btn btn-success pull-left";
	syncBtn.setAttribute("data-loading-text", "同步中......");
	syncBtn.setAttribute("type","button");
	var btnSpan = document.createElement("span");	
	btnSpan.className = "glyphicon glyphicon-open";
	syncBtn.appendChild(btnSpan);
	syncBtn.appendChild(document.createTextNode(" 正向同步"));
	syncBtn.addEventListener("click", function(){						
		var btn = $(this)
    	btn.button('loading')
		SyncFolder(sourcePath,targetPath,btn);	
	} , false);

	var reverseSyncBtn = document.createElement("BUTTON");
	reverseSyncBtn.className = "btn btn-danger pull-right";
	reverseSyncBtn.setAttribute("data-loading-text", "同步中......");
	reverseSyncBtn.setAttribute("type","button");
	var reverseSyncBtnSpan = document.createElement("span");
	reverseSyncBtnSpan.className = "glyphicon glyphicon-save";
	reverseSyncBtn.appendChild(reverseSyncBtnSpan);
	reverseSyncBtn.appendChild(document.createTextNode(" 逆向同步"));
	reverseSyncBtn.addEventListener("click", function(){					
		var btn = $(this)
    	btn.button('loading')
		SyncFolder(targetPath,sourcePath,btn);
	},false);

 	syncBtnli.appendChild(syncBtn);
 	syncBtnli.appendChild(reverseSyncBtn);

	ul.appendChild(sourceli);
	ul.appendChild(targetli);
	ul.appendChild(syncBtnli);

	col.appendChild(ul);
	row.appendChild(col);

 	$("#rowContainer").append(row);
}

function SyncFolder(sourcePath,targetPath,btn){
	fs.remove(targetPath,function(err){		
		if(err){
			btn.button('reset');
			showError(err.toString());
			return;
		}

		fs.copy(sourcePath,targetPath,function(copyErr){
			btn.button('reset');
			if(copyErr){
				showError(copyErr.toString());
				return;
			}
			showSuccess("同步成功");
		});
	});
}

function showSuccess(message){
	BootstrapDialog.show({
				title: '成功',
				message: message,
				type: BootstrapDialog.TYPE_SUCCESS,
				buttons: [{
					id: 'btn-ok',
					icon: 'glyphicon glyphicon-check',
					label: 'OK',
					cssClass : 'btn-success',
					autospin: false,
					action: function(dialogRef) {
						dialogRef.close();
					}
				}]
			});
}

function showError(err){
	BootstrapDialog.show({
				title: '失败',
				message: err,
				type: BootstrapDialog.TYPE_SUCCESS,
				buttons: [{
					id: 'btn-ok',
					icon: 'glyphicon glyphicon-check',
					label: 'OK',
					cssClass : 'btn-success',
					autospin: false,
					action: function(dialogRef) {
						dialogRef.close();
					}
				}]
			});	
}