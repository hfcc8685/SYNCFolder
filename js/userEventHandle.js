var fs = require('fs-extra');
var path = require('path');
var gui = require('nw.gui');
var win = gui.Window.get();

var ConfigFilePath = path.join(path.dirname(process.execPath),"config.json");
var SyncFolderPanelIndex = 1;

$(function(){

	fs.readFile(ConfigFilePath,function (err, data){
		if(err){
			showError(err);
		}		
		else{
			var config = JSON.parse(data);
			$.each(config.pathPair,function(){				
				AddSyncNode(this.name,this.sourcePath,this.targetPath);				
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
		var syncName = $("#tb-Name").val();
		var sourcePath = $("#tb-Source").val();
		var targetPath = $("#tb-Target").val();		
		AddSyncNode(syncName,sourcePath,targetPath);

		fs.readFile(ConfigFilePath,function (err, data){
			if(err){
				showError(err);
			}		
			else{
				var config = JSON.parse(data);
				var tempPathPair = {
					"name": syncName,
					"sourcePath": sourcePath,
					"targetPath": targetPath
				}
				config.pathPair.push(tempPathPair);
				fs.writeFile(ConfigFilePath,JSON.stringify(config),function(err){
					if(err)
						showError(err.toString());
				});

				$("#tb-Name").val("");
				$("#tb-Source").val("");
				$("#tb-Target").val("");
			}
		});
	});
});

function AddSyncNode(name,sourcePath,targetPath) {	
	var panelId = "panelName"+SyncFolderPanelIndex;
	var btnOne = "btnOne"+SyncFolderPanelIndex;
	var btnTwo = "btnTwo"+SyncFolderPanelIndex;
	SyncFolderPanelIndex++;

	var html = '<div class="row">'+ 
					'<div class="col-md-12">'+
						'<div class="panel panel-primary">'+
							'<div class="panel-heading">'+
								'<h4 class="panel-title pull-left">'+ 
									'<a class="panel-a-titile" data-toggle="collapse" data-parent="#accordion" href="#'+panelId+'">'
									+name+
									'</a>'+
								'</h4>'+
								'<div class="btn-group btn-group-sm pull-right">'+
								'<button class="btn btn-success" data-loading-text="同步中......" type="button" id="'+btnOne+'">'+
									'<span class="glyphicon glyphicon-open"></span> 正向同步'+
								'</button>'+
								'<button class="btn btn-danger" data-loading-text="同步中......" type="button" id="'+btnTwo+'">'+
									'<span class="glyphicon glyphicon-save"></span> 逆向同步'+
								'</button>'+
								'</div>'+
								'<div class="clearfix"></div>'+
							'</div>'+
							'<div id="'+panelId+'" class="panel-collapse collapse">'+							
								'<div class="panel-body">'+
									'<ul class="list-group">'+
										'<li class="list-group-item text-success">'+sourcePath+'</li>'+ 
										'<li class="list-group-item text-danger">'+targetPath+'</li>'+						
									'</ul>'+
								'</div>'+ 
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
	
    $("#rowContainer").append(html);

	var btn1 = document.getElementById(btnOne);
	btn1.addEventListener("click", function() {
		var btn3 = $(this);
		btn3.button('loading');
		SyncFolder(sourcePath,targetPath,btn3);
	}, false);


	var btn2 = document.getElementById(btnTwo);
	btn2.addEventListener("click", function() {
		var btn4 = $(this);
		btn4.button('loading');
		SyncFolder(targetPath,sourcePath,btn4);
	}, false);
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