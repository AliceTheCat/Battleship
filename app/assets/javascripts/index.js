$(function() {
    // add a click handler to the button
    $("#getMessageButton").click(function(event) {
        // make an ajax get request to get the message
        jsRoutes.controllers.MessageController.getMessage().ajax({
            success: function(data) {
                console.log(data)
                $(".well").append($("<h1>").text(data.value))
            }
        })
    })
})

$(function() {
	connect();
	
	function connect(){
		var socket = new WebSocket("ws://localhost:9000/socket");
		
		message('Socket Status' + socket.readyState + ' (ready)');
		
		socket.onopen = function(){ message('Socket Status: ' + socket.readyState + ' (open)'); };
		
		socket.onmessage = function(msg){
			var msg = JSON.parse(msg.data);
			updateGrid(msg);
		};
		
		socket.onclose = function(){ message('Socket Status: ' + socket.readyState + ' (closed)'); };
		
		function send(){
		
		}
		
		function message(msg){
			$('#logMsg').empty();
			$('#logMsg').append(msg);
		}
		}
		
	});
	
		function getType(){
			if($('#horizontal').is(':checked')){
				return "h";
			}
			if($('#vertical').is(':checked')){
				return "v";
			}
			return "";
		}
		function getSize(){
			for(x=0; x <26; x++){
				if(!($('#zahl'+x).length)){
					return 0;
				}
				if($('#zahl'+x).is(':checked')){
					return $('#zahl'+x).attr("title");
				}
			}
			return 0;
		}
		function attack(row,column) {
			if(row < 10){
				$.post("/json/" + "a"+column+"0"+row, function (data) {
					var msg = JSON.parse(data);
					updateGrid(msg);
				});
			}else{
				$.post("/json/" + "a"+column+row, function (data) {
					var msg = JSON.parse(data);
					updateGrid(msg);
				});
			}
		}
		
		function place(row,column) {
			var size = getSize();
			var type = getType();
			
			if(type === "" || size === 0){
				return;
			}
			if(row < 10){
				$.post("/json/" + "p"+ size + column + "0" + row + type, function (data) {
					var msg = JSON.parse(data);
					updateGrid(msg);
				});
			}else{
				$.post("/json/" + "p"+ size + column + row + type, function (data) {
					var msg = JSON.parse(data);
					updateGrid(msg);
				});
			}
		}
		function enterCell(row,column){
			var size = getSize();
			var type = getType();
			if(type === "" || size === 0){
				return;
			}
			if(row < 10){
				$.post("/json/" + "s"+size+column+"0"+row+type, function (data) {
					var msg = JSON.parse(data);
					updateGrid(msg);
				});
			}else{
				$.post("/json/" + "s"+size+column+row+type, function (data) {
					var msg = JSON.parse(data);
					updateGrid(msg);
				});
			}
		}
		function undo(){
			$.post("/json/" + "u", function (data) {
					var msg = JSON.parse(data);
					updateGrid(msg);
				});
		}
		function redo (){
			$.post("/json/" + "r", function (data) {
					var msg = JSON.parse(data);
					updateGrid(msg);
				});
		}
		function leaveCell(row,column){
			if(row < 10){
				$.post("/json/" + "d"+column+"0"+row, function (data) {
					var msg = JSON.parse(data);
					updateGrid(msg);
				});
			}else{
				$.post("/json/" + "d"+column+row, function (data) {
					var msg = JSON.parse(data);
					updateGrid(msg);
				});
			}
		}
		function createNewGame(){
			var column = $('#inputColumn').val();
			var row = $('#inputRow').val();
			window.location = "/command/"+"n"+column+row;
		}