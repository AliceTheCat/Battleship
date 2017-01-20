package controllers;

import java.awt.Color;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import model.GameState;
import model.ICell;
import model.ICoordinate;
import model.ICoordinateRange;
import model.IGrid;
import model.IPlayer;
import model.impl.Coordinate;
import model.impl.Water;
import models.GridObserver;
import controller.Command;
import controller.IHeadController;
import controller.impl.HeadController;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.WebSocket;
import view.Gui;
import play.mvc.Security;
import play.mvc.Http.Context;
import battleshipx.BattleshipX;
import play.libs.F;
import play.libs.Json;
import play.libs.OpenID;
import play.data.*;
import static play.data.Form.*;

public class MainController extends Controller {
	private final static boolean startWithGui = false;
	static IHeadController controller;
	
	@play.mvc.Security.Authenticated(Secured.class)
    public static Result index() {
		String email = session("email");
        System.out.println(email);
        controller = BattleshipX.getInstance(startWithGui).getController();
        return ok(views.html.index.render(email,controller, "Play"));
    }
	
    public static Result command(String line) {
    	BattleshipX.getInstance(startWithGui).getTui().userInput(line);
    	String email = session("email");
    	return ok(views.html.index.render(email, controller, "Play"));
    }
    
    public static Result contact() {
        return ok(views.html.contact.render("Contact"));
    }
    
    public static Result about() {
        return ok(views.html.about.render("About"));
    }
    
    public static Result json(){
    	return ok(Json.stringify(Json.toJson(generateMap())));
    }
    
    public static String getGrid(){
    	return Json.stringify(Json.toJson(generateMap()));
    }
    
    private static Map<String, Object> generateMap(){
    	IGrid placeGrid = controller.getMatch().getPlayerOne().getDeffensiveMap();
    	IGrid attackGrid = controller.getMatch().getPlayerOne().getOffensiveMap();
    	int xPlace = placeGrid.getLengthX();
    	int yPlace = attackGrid.getLengthY();
    	Map<String,Object> placeObj[][] = new HashMap[xPlace][yPlace];
    	Map<String,Object> attackObj[][] = new HashMap[xPlace][yPlace];
    	
    	for(int i=0; i < xPlace; i++){
    		for(int j=0; j < yPlace; j++){
	    		placeObj[i][j] = new HashMap<String,Object>();
	    		placeObj[i][j].put("cell", placeGrid.getGrid()[i][j]);
	    		attackObj[i][j] = new HashMap<String,Object>();
	    		attackObj[i][j].put("cell", attackGrid.getGrid()[i][j]);
    		}
    	}
    	Map<String, Object> map = new HashMap<String, Object>();
    	map.put("placeGrid", placeObj);
    	map.put("attackGrid", attackObj);
    	map.put("xLength", xPlace);
    	map.put("yLength", yPlace);
    	map.put("shipsToPlace", controller.getMatch().getPlayerOne().getShipListToPlace());
    	map.put("isGameEnd", controller.isGameEnd());
    	map.put("gameEndMsg", controller.getEndMessage());
    	map.put("isSelection", controller.isSelection());
    	map.put("command", controller.getNextOptionsAsString());
    	return map;
    }
    
    public static Result jsonCommand(String command){
		BattleshipX.getInstance(startWithGui).getTui().userInput(command);
    	return json ();
    }
    
    public static WebSocket<String> connectWebSocket(){
    	return new WebSocket<String>(){
    		public void onReady(WebSocket.In<String> in, WebSocket.Out<String> out){
    			new GridObserver(out,((HeadController)controller));
    		}
    	};
    }
    
    public static Result login() {
        return ok(
        		views.html.login.render(play.data.Form.form(User.class), null, "Play")
        );
    }
    
    public static Result authenticate() {
        Form<User> loginform = DynamicForm.form(User.class).bindFromRequest();
        System.out.println(loginform.get().email + loginform.get().password);
        
        User user = User.authenticate(loginform.get());

        if (loginform.hasErrors() || user == null) {
            return badRequest(views.html.login.render(loginform, "wrong username or password", "Play"));
        } else {
            session().clear();
            session("email", user.email);
            return redirect(
                routes.MainController.index()
            );
        }
    }
    
    public static Result logout() {
    	session().clear();
    	return redirect(routes.MainController.index());
    }
    
    public static class User {
        
        private final static String defaultUser = "test@123.de";
        private final static String defaultPasswort = "nsa";

        public String email;
        public String password;
        
        public User() {}
        
        private User(final String email, final String password) {
            this.email = email;
            this.password = password;
        }

     	public static User authenticate(User user){
     	    if (user != null && defaultUser.equals(user.email) && defaultPasswort.equals(user.password)) {
     	        return new User(user.email, user.password);
     	    }
     	    
    	    return null;
    	}
   }
    
    public static class Secured extends Security.Authenticator {

        @Override
        public String getUsername(Context ctx) {
            return ctx.session().get("email");
        }

        @Override
        public Result onUnauthorized(Context ctx) {
            return redirect(routes.MainController.login());
        }
    }
    public static Result auth() {
    	String providerUrl = "https://www.google.com/accounts/o8/id";
    	String returnToUrl = "http://localhost:9000/openID/verify";
    	Map<String, String> attributes = new HashMap();
    	attributes.put("Email", "http://schema.openid.net/contact/email");
    	attributes.put("FirstName", "http://schema.openid.net/namePerson/first");
    	attributes.put("LastName", "http://schema.openid.net/namePerson/last");
    	F.Promise<String> redirectUrl = OpenID.redirectURL(providerUrl, returnToUrl, attributes);
    	return redirect(redirectUrl.get());
    	}
    
    public Result verify() {
    	F.Promise<OpenID.UserInfo> userInfoPromise = OpenID.verifiedId();
    	OpenID.UserInfo userInfo = userInfoPromise.get();
    	session().clear();
    	session("email", userInfo.attributes.get("Email"));
    	return redirect(
    	routes.MainController.index()
    	);
    }
}
