package models;

import play.mvc.WebSocket.Out;
import controller.IHeadController;
import controller.impl.HeadController;
import controllers.MainController;
import util.observer.*;

public class GridObserver implements IObserver{
	private Out<String> out;
	private HeadController controller;
	
	
	public GridObserver(Out<String> out, HeadController controller) {
		controller.addObserver(this);
		this.out = out;
		this.controller = controller;
	}


	@Override
	public void update() {
		out.write(MainController.getGrid());
		System.out.println("WUI was updated");
	}
	
}
