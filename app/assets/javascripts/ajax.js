root = typeof exports !== "undefined" && exports !== null ? exports : this;

root.updateGrid= function(data) {
			var x,y;
			for(x=0; x < data.xLength; x++){
				for(y=0; y < data.yLength; y++){
					if(data.placeGrid[x][y].cell.type == "Water"){
						$('#deffcell' + y + x).removeClass().addClass("water");
						$('#deffinnercell' + y + x).removeClass();
					}
					if(data.placeGrid[x][y].cell.type == "Water" && data.placeGrid[x][y].cell.selected){
						$('#deffcell' + y + x).removeClass().addClass("selected");
						$('#deffinnercell' + y + x).removeClass();
					}
					if(data.placeGrid[x][y].cell.type == "ShipPart"){
						$('#deffcell' + y + x).removeClass().addClass("placedShip");
						$('#deffinnercell' + y + x).removeClass();
					}
					if((data.placeGrid[x][y].cell.type == "Water" || data.placeGrid[x][y].cell.type == "ShipPart") && data.placeGrid[x][y].cell.hit == true){
						$('#deffinnercell' + y + x).removeClass().addClass("enemyHit");
					}
					if(data.placeGrid[x][y].cell.type == "ShipPart" && data.placeGrid[x][y].cell.destroyed == true){
						$('#deffcell' + y + x).removeClass().addClass("playerShipDestroyed");
						$('#deffinnercell' + y + x).removeClass();
					}
				}
			}
			for(x=0; x < data.xLength; x++){
				for(y=0; y < data.yLength; y++){
					if(data.attackGrid[x][y].cell.type == "Water" || data.attackGrid[x][y].cell.type == "ShipPart"){
						$('#offcell' + y + x).removeClass().addClass("water");
						$('#offinnercell' + y + x).removeClass();
					}
					if(data.attackGrid[x][y].cell.type == "ShipPart" && data.attackGrid[x][y].cell.hit == true){
						$('#offcell' + y + x).removeClass().addClass("placedShip");
						$('#offinnercell' + y + x).removeClass();
					}
					if((data.attackGrid[x][y].cell.type == "Water" || data.attackGrid[x][y].cell.type == "ShipPart") && data.attackGrid[x][y].cell.hit == true){
						$('#offinnercell' + y + x).removeClass().addClass("playerHit");
					}
					if(data.attackGrid[x][y].cell.type == "ShipPart" && data.attackGrid[x][y].cell.destroyed == true){
						$('#offcell' + y + x).removeClass().addClass("enemyShipDestroyed");
						$('#offinnercell' + y + x).removeClass();
					}
				}
			}
			if(!(data.isSelection)){
				$('#placementType').empty();
				x=0
				for(l in data.shipsToPlace){
					$('#placementType').append("<label class=\"btn btn-default\"> <input type=\"radio\" name=\"size\" id=\"zahl" + x + "\" title=\"" + data.shipsToPlace[x] + "\">" + data.shipsToPlace[x] + "</label>");
					x = x + 1;
				}
				if(x==0){
					$('#schiffgroesse').empty();
				}
			
			if(data.isGameEnd){
				$('#gameEndMsg').empty();
				$('#gameEndMsg').append(data.gameEndMsg);
				$('#gameEndModal').modal('show');
			}
			$('#cmdMsg').empty();
			$('#cmdMsg').append(data.command);
			
			}
}