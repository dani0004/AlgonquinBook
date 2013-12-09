var viewDatabase=0;

var db=null;
var elementE=null;
var idE=null;
sqlQuery=" ";
var contacts;
var abooknamespace;
var resultset=null;
var resultset2=null;
var resultset3=new Array();
var resultset4;
var resultset6;
var resultset7;
var calevents;
var currentId=null;
var aaa=new Array();
var items = [],
      item;
var editstate=false;
var deletestate=false;	  
var myLat;
var myLong;
var personimgPath=" ";
var worker1;
var worker4;
var viewCourses=0;
var contactDetails;
var courseDetails=new Array();
var photoDetails;
var allPhotos;
var currentContact;
var staticImage="images/ic_contacts.png";
blackberry.io.sandbox = false;
var calendar;
var recEvent;
var monevents=new Array(),tueevents=new Array(),wedevents=new Array(),
		thuevents=new Array(),frievents=new Array();

/***TIMETABLE AND CALENDAR ****/
//var CalendarRepeatRule;
 
 var monthLookup={"1":31,"2":28,"3":31,"4":30,"5":31,"6":30,"7":31,"8":31,"9":30,
 				"10":31,"11":30,"12":31};
var monthNameLookup={"1":"Jan","2":"Feb","3":"Mar","4":"Apr","5":"May","6":"Jun","7":"Jul","8":"Aug","9":"Sep",
 				"10":"Oct","11":"Nov","12":"Dec"};	
var dowlookup={"11":1,"22":2,"33":3,"44":4,"55":5}	;						
 
 
 

window.onload=init;


function init(){

	//alert("start init");
 /* ******webworks ready event******/
	var webworksreadyFired = false;
	
	document.addEventListener('webworksready', function(e) {
		if (webworksreadyFired) return;
			webworksreadyFired = true;
		//alert("after webworks ready");
		
		initializeDatabase();
		contactDetails=new Array();
		allPhotos=new Array();
	
		
		 /* ******BB INIT*****/
		bb.init({
			
			
			onscreenready : function(element, id, params) {
			
				id=id.trim();
				elementE=element;
				
				var ppp=element.getElementById("divTitle");
				ppp.setAttribute("data-bb-caption",params.title);
				
			
				if(id=="screen1"){
				}
				
				
				if(id=="screen2"){
		
					var tab1 = element.getElementById('tab1');
					
					var tab2 = element.getElementById('tab2');
    				var actionBar = element.getElementById('abar');
				
				
					if(viewDatabase==1){
							
							
							ppp=element.getElementById("grid2");
							ppp.style.visibility="hidden";
							ppp.style.display="none";
							
						
							p=element.getElementById("grid1");
							p.style.visibility="visible";
							p.style.display="block";
							//alert("before select all photos");
							selectAllPhotos();
							selectAllDesc();
							
							
							
					}//end viewDatabase=1
					if(viewDatabase==0){
							
							var tt=element.getElementById("divTitle");
							
							tt.setAttribute("data-bb-action-caption","Save");
							tt.setAttribute("onactionclick","addContact()");
						tt.setAttribute("data-bb-caption","Add Algonquin Contact");
						tt.setAttribute("data-bb-img","images/ic_contacts.png");	
							
							
							
							ppp=element.getElementById("grid1");
							
							ppp.style.visibility="hidden";
							ppp.style.display="none";
							
							
							p=element.getElementById("grid2");
							p.style.visibility="visible";
							p.style.display="block";
						element.getElementById("fname").removeAttribute("disabled");
						element.getElementById("lname").removeAttribute("disabled");
						element.getElementById("mphone").removeAttribute("disabled");
						element.getElementById("hphone").removeAttribute("disabled");
						element.getElementById("wemail").removeAttribute("disabled");
						element.getElementById("hemail").removeAttribute("disabled");
						element.getElementById("wemet").removeAttribute("disabled");
				
					}//end else view database=0
					
				}//end if id=screen2
				
				if(id=="screen3"){
			
							
				try{
				
			var initial=contactDetails["fname"].charAt(0);
		var initial2=contactDetails["lname"].charAt(0);
		
		var n1=setCharAt(contactDetails["lname"],0,initial2.toUpperCase())
		var n2=setCharAt(contactDetails["fname"],0,initial.toUpperCase())			
							
		var fullname=n2 + " " +	n1;
				
	element.getElementById("divTitle").setAttribute("data-bb-caption",fullname);
	

	element.getElementById("myimage").setAttribute("src",contactDetails.photoLink);
		 

(element.getElementById("msphone")).setAttribute('data-bb-title',contactDetails.mphone);
	
(element.getElementById("hsphone")).setAttribute('data-bb-title',contactDetails["hphone"]);	


(element.getElementById("wsemail")).setAttribute('data-bb-title',contactDetails["wemail"]);
	
(element.getElementById("hsemail")).setAttribute('data-bb-title',contactDetails["hemail"]);	
(element.getElementById("wsemet")).setAttribute('data-bb-title',("Met at:"+contactDetails["wemet"]));	
			
				element.getElementById("msphone").innerHTML="Work";
				element.getElementById("hsphone").innerHTML="Home";
				element.getElementById("wsemail").innerHTML="Work";
				element.getElementById("hsemail").innerHTML="Home";
				var j=1;
for (var i=0;i<3;i++){
	if(contactDetails["photoOther"+j]!=null && contactDetails["photoOther"+j].length>0){	
			
(element.getElementById("oimg"+j)).setAttribute('src',contactDetails.photoOther1);}
else
(element.getElementById("oimg"+j)).setAttribute('src','./images/takepicture82by82.png');
j++;
	}
				}catch(e){alert("ex setting screen3 "+e.message);}
							
					
				}//end if id == screen3
		
		if(id=="screen6")
		{
			if(params.state.trim()=="add") initializeCourseDetails();
			if(params.state.trim()=="entry") initializeCourseDetails();
			if(params.state.trim()=="editAdd") initializeCourseDetails();
			if(params.state.trim()=="delete") initializeCourseDetails();
			
			if(viewCourses==0)
			{
				//alert("in screen ready screen6");
				ppp=element.getElementById("grid2");
				ppp.style.visibility="hidden";
				ppp.style.display="none";
				
				
				q=element.getElementById("tab3");
				q.style.visibility="hidden";
				q.style.display="none";
				
				if(!editstate){
					t=element.getElementById("deleteBtn");
					t.style.visibility="hidden";
					t.style.display="none";
				}
							
				p=element.getElementById("grid1");
				p.style.visibility="visible";
				p.style.display="block";
				
					
				var tt=element.getElementById("divTitle");
				tt.setAttribute("data-bb-action-caption","Save To Calendar");
				tt.setAttribute("onactionclick","addCourse()");
			try{
				if(!editstate) courseDetails.length=0;	
				if(courseDetails.rawtime!=null)
					{
					var sdd=" PM";
					var sd =courseDetails.rawtime.split(":");
					if(sd[0]<7) sdd=" AM"; 
			(element.getElementById("ptime")).innerHTML=courseDetails.rawtime;		
			if(	courseDetails.rawtime.length<7)	
				(element.getElementById("ptime")).innerHTML=courseDetails.rawtime+sdd;
			
				}
				else
				(element.getElementById("ptime")).innerHTML="Choose Time";	
				if(courseDetails.semesterId!=null)
					element.getElementById(courseDetails.semesterId).selected="true";
				else
					element.getElementById("1a1").selected="true";
				if(courseDetails.dowui!=null){
					//alert(courseDetails.dowui);
					element.getElementById(courseDetails.dowui).selected="true";
				}
				else
				element.getElementById("11").selected="true";
				if(courseDetails.durationId!=null)
					element.getElementById(courseDetails.durationId).selected="true";
				else
					element.getElementById("111").selected="true";	
				
				if(courseDetails.lab!=null){
					
					(element.getElementById("toggle1")).setAttribute("data-bb-checked",courseDetails.lab);
					
				}
		else
	
					(element.getElementById("toggle1")).setAttribute("data-bb-checked","false");			
				if(courseDetails.notify!=null){
					(element.getElementById("toggle2")).setAttribute("data-bb-checked",courseDetails.notify);	
				}
	else
(element.getElementById("toggle2")).setAttribute("data-bb-checked","false");					
				
				if(courseDetails.cname!=null)
				element.getElementById("cname").value=(courseDetails.cname);
				else
				element.getElementById("cname").value="Enter course";
				if(courseDetails.croom!=null)
				element.getElementById("clnum").value=(courseDetails.croom);
				else
				element.getElementById("clnum").value="Enter location";
			}
			catch(e){alert("Exception setting vals "+e.message);}
				
			}
			if(viewCourses==1)
			{
				//alert("in screen ready screen 6 viewCourses is 1");
				ppp=element.getElementById("grid1");
				ppp.style.visibility="hidden";
				ppp.style.display="none";
				
				
				q=element.getElementById("tab3");
				q.style.visibility="visible";
				q.style.display="inline";
				
				qq=element.getElementById("tab1");
				qq.style.visibility="hidden";
				qq.style.display="none";
							
				p=element.getElementById("grid2");
				p.style.visibility="visible";
				p.style.display="block";
		
				
				var tt=element.getElementById("divTitle");
				
				listAllEvents(30);
		
			}
		}//end of if id=screen6
			

console.log("on screen ready 2");

			},//end on screen ready
		//operations after DOM is ready	
							
		ondomready: function(element, id, params) {
	//register event listeners	
	
	$("#myimage").click(function(){navigateToCamera("personImg")});
	$("#oimg1").click(function(){navigateToCamera("otherImg1")});
	$("#oimg2").click(function(){navigateToCamera("otherImg2")});
	$("#oimg3").click(function(){navigateToCamera("otherImg3")});
	
	$(".timeslot").click(function(ev){selectTime(ev)});
	$(".editbutton2").click(function(ev){editCalendaritem(ev)});
	$("#deleteBtn").click(function(ev){deleteEventitem(ev)});
	
	if(id=="screen6" && viewCourses==0){
		getdefaultSelected();
		$("#timepicker").click(function(){chooseTime()});
		
		
		
	}
	
	if(id=="screen6" && viewCourses==1){
		
		getdefaultSelected();
		$("#timepicker").click(function(){chooseTime()});
		
	
	}
	if(id=="screen6" && viewCourses==1){
		try{
			//alert("start scr6 an dvc=1");
			var ss;
			var aa=["Monday","Tuesday","Wednesday","Thursday","Friday"];
			for(var i=0;i<aa.length;i++){
				if(i==0)
					writeEachDayEvents(monevents,aa[i]);
				if(i==1)
					writeEachDayEvents(tueevents,aa[i]);
				if(i==2)
					writeEachDayEvents(wedevents,aa[i]);
				if(i==3)
					writeEachDayEvents(thuevents,aa[i]);
				if(i==4)
					writeEachDayEvents(thuevents,aa[i]);				
			}
			
	$(".editbutton2").click(function(ev){editCalendaritem(ev)});
			
		}
		catch(e){alert("Exception in setting scrren6domready "+e.message);}
	}
	
			}
			
						
			});
		 /* ******END BB INIT*****/	
		  bb.pushScreen('screen1.html','screen1',{title:"My Algonquin Life"});	
		},false);
		// bb.pushScreen('screen2.html','screen2',{title:"Add Contacts"});	
		//},false);
/* ******end webworks ready event******/
	addWorkerThreads1();
	addWorkerThreads2();
}//end init
/********WORKER THREADS ********/
/* worker thread to extract photo from database 

worker3: used to create a single contact in contacts app
*/
function addWorkerThreads1(){

	//instantiate worker js object							
	
	 worker3=new Worker("js/task4.js");
	
 //add a listener associated with the message action
	worker3.addEventListener('message',function(e){
		
			if(e.data!=null)
			{
				var pp=e.data[0];
				contactDetails=eval(pp);
			}
					

	},false);
	
  worker3.onerror=function(error){alert ("worker3 error "+error.message)}
}
function addWorkerThreads2(){

	//instantiate worker js object							
	
	 worker4=new Worker("js/task5.js");
	
 //add a listener associated with the message action
	worker4.addEventListener('message',function(e){
		
			if(e.data!=null)
			{
				var pp=e.data[0];
				
				contactDetails["photoLink"]=pp.plink;
			}
					

	},false);
	
  worker4.onerror=function(error){alert ("worker4 error "+error.message)}
}
  /********END WORKER THREADS ********/

/****SCREEN 1 FUNCTIONS *******/
function navigateTo(target){
	try{
		  var target=target.trim();
		  switch (target){
			  case "sav":
			  navigateToSav();
			  break;
			  case "contacts":
			   bb.pushScreen('screen2.html','screen2',{title:"Algonquin Contacts"});
			   break;	
			  case "transport":
			  navigateToTransport();
			  break;
			  case "gym":
			  navigateToGym();
			  break;
			  case "acsis":
			  navigateToAcsis();
			  break;
			  case "bb":
			  navigateToBB();
			  break;
			  case "camera":
			  navigateToCamera(aa);
			  break;
			  case "map":
			  startGeolocation(myLat,myLong);
			  break;
			  case "timetable":
			  navigateToTimetable(0);
			  break;
		  }
		
	}
	catch(ee){alert("ex in navigation to contacts "+ee.message);}
}
function navigateToTimetable(type){
	try{
		//navigating to another application
		//alert("in navigate to maps");
	viewCourses=type;
	 bb.pushScreen('screen6.html','screen6',{title:"My Timetable", state:"entry"});	
		
	}
	catch(ee){alert("ex in navigation to maps "+ee.message);}
}
function navigateToMaps(){
	try{
		//navigating to another application
		//alert("in navigate to maps");
	
	 bb.pushScreen('screen7.html','screen7',{title:"Algonquin Locations"});	
		
	}
	catch(ee){alert("ex in navigation to maps "+ee.message);}
}
function navigateToContacts(){
	try{
		  bb.pushScreen('screen2.html','screen2',{title:"Add Algonquin Contact"});	
		
	}
	catch(ee){alert("ex in navigation to contacts "+ee.message);}
}
/* The function navigateToTransport
* navigates to a http site using the invocation
* framework 
*/
function navigateToTransport(){
	try{
	//the structure of the request to invoke http, ftp, file data and other apps is :
		//  blackberry.invoke.invoke(request : o, onSuccess: function(), onError: function([error: string]))
		 
		  blackberry.invoke.invoke({

action: "bb.action.OPEN",
uri: "http://www.octranspo.com/mobi/"
}, function(){ }, function(error){alert("error website not available");});
		
	}
	catch(ee){alert("ex in navigation to contacts "+ee.message);}
}
function navigateToSav(){
	try{
	//the structure of the request to invoke http, ftp, file data and other apps is :
		//  blackberry.invoke.invoke(request : o, onSuccess: function(), onError: function([error: string]))
		  
		  blackberry.invoke.invoke({

action: "bb.action.OPEN",
uri: "http://www3.algonquincollege.com/hospitalityandtourism/savoir-fare/"
}, function(){ }, function(error){alert("error website not available");});
		
	}
	catch(ee){alert("ex in navigation to contacts "+ee.message);}
}
function navigateToAcsis(){
	try{
	//the structure of the request to invoke http, ftp, file data and other apps is :
		//  blackberry.invoke.invoke(request : o, onSuccess: function(), onError: function([error: string]))
		 
		  blackberry.invoke.invoke({

action: "bb.action.OPEN",
uri: "https://acsis.algonquincollege.com/students/"
}, function(){ }, function(error){alert("error website not available");});
		
	}
	catch(ee){alert("ex in navigation to contacts "+ee.message);}
}

function navigateToGym(){
	try{
	//the structure of the request to invoke http, ftp, file data and other apps is :
		//  blackberry.invoke.invoke(request : o, onSuccess: function(), onError: function([error: string]))
		 
		  blackberry.invoke.invoke({

action: "bb.action.OPEN",
uri: "http://www.algonquinsa.com/fitness.aspx"
}, function(){ }, function(error){alert("error website not available");});
		
	}
	catch(ee){alert("ex in navigation to contacts "+ee.message);}
}
function navigateToBB(){
	try{
	//the structure of the request to invoke http, ftp, file data and other apps is :
		//  blackberry.invoke.invoke(request : o, onSuccess: function(), onError: function([error: string]))
		  
		  blackberry.invoke.invoke({

action: "bb.action.OPEN",
uri: "http://www.bestbuddies.ca/"
}, function(){ }, function(error){alert("error website not available");});
		
	}
	catch(ee){alert("ex in navigation to contacts "+ee.message);}
}
function navigateToCamera( pp){
	try{
		
//click on the screen when it appears to capture the photo
	 var mode = blackberry.invoke.card.CAMERA_MODE_PHOTO;
      blackberry.invoke.card.invokeCamera(mode, function (path) {
		
			pp=pp.trim();
			pp=pp.toUpperCase();
		

             var filepath = 'file://' + path;
			
		
		
		if(pp=="PERSONIMG"){personimgPath=filepath;
		//alert("current contact is "+currentContact);
		//alert(contactDetails.contactId);
			var mm=document.getElementById("myimage");
			mm.setAttribute("src",filepath);
			if((currentContact.trim()).length>0)
			{
				contactDetails["type"]=0;
				//contactDetails["photolink"]=filepath;
				createDatabaseContactPhotos(currentContact,filepath);
				//createDatabasePhotos(currentContact,filepath);
			}
			else{
				if(contactDetails.contactId!=null  && contactDetails.contactId.length>0)
				{
					contactDetails["type"]=0;
					currentContact=contactDetails.contactId.toString();
					//contactDetails["photolink"]=filepath;
					createDatabasePhotos(currentContact,filepath);
				}
			}
		}
		
		if(pp=="OTHERIMG1"){otherimgPath=filepath;
	//alert("in othrimg1");
			var mm=document.getElementById("oimg1");
			mm.setAttribute("src",filepath);
			if(currentContact!=null  && currentContact.length>0)
			{
					contactDetails["type"]=1;
					//contactDetails["photoOther1"]=filepath;
					createDatabasePhotos(currentContact,filepath);
			}
		}
		if(pp=="OTHERIMG2"){otherimgPath=filepath;
		
			var mm=document.getElementById("oimg2");
			mm.setAttribute("src",filepath);
			if(currentContact!=null  && currentContact.length>0)
			{
					contactDetails["type"]=1;
					//contactDetails["photoOther2"]=filepath;
					createDatabasePhotos(currentContact,filepath);
			}
		}
		if(pp=="OTHERIMG3"){otherimgPath=filepath;
	
			var mm=document.getElementById("oimg3");
			mm.setAttribute("src",filepath);
			if(currentContact!=null  && currentContact.length>0)
			{
					contactDetails["type"]=1;
					//contactDetails["photoOther3"]=filepath;
					createDatabasePhotos(currentContact,filepath);
			}
		}
         //update the list of photos 
		//selectAllPhotos();	 
			 
         },
         function (reason) {
             alert("cancelled " + reason);
         },
         function (error) {
             if (error) {
                 alert("invoke error "+ error);
              } else {
                 console.log("invoke success " );
              }
      });
	

		
	}
	catch(ee){alert("ex in navigation to camera "+ee.message);}
}
//open file picker in saver mode and allow overwrite - try to save already saved file
function invokeFileInPickerModeSaver() {
  var details = {
          mode: blackberry.invoke.card.FILEPICKER_MODE_SAVER,
          directory: [blackberry.io.sharedFolder],
          allowOverwrite: true
      };
  invokeFilePicker(details);
}
//invoke the filePicker Card
function invokeFilePicker(details) {
	alert("in invoke file picker details" );
     blackberry.invoke.card.invokeFilePicker(details, function (path) {
             // alert("saved "+ path);
          },
          function (reason) {
              alert("cancelled " + reason);
          },
          function (error) {
              if (error) {
                  alert("invoke error "+ error);
              } else {
                  console.log("invoke success " );
              }
          }
      );
}


/*****END SCREEN 1 FUNCTIONS ******/
/*******SCREEN 2 ADD CONTACT FUNCTIONS ********/

/********END SCREEN 2 ADD CONTACT FUNCTIONS *********/
/* The click event handler when a contact
* name is clicked on the image list 
* @param ev - the contact id as a string
*/

function showContactDetails(ev){	
//alert("show contact details start");
	try{
		//viewDatabase=3;
		//extract the data for this contact from the database
		
		var ppp=ev.getAttribute("data-id");
		
		//alert("contact id is "+ppp);
		contacts = blackberry.pim.contacts;
		ContactField = contacts.ContactField;
	
		contact=contacts.getContact(ppp.trim());
		contactDetails.length=0;
		/**changes for using worker thread ***/
		
		addWorkerThreads1();
		worker3.postMessage({"contact":contact});
		
		
	
	
		//get contact desc from the database
		selectSingleContact(ppp.trim());
		//get contact photo from the database
		
	
	}
	catch(e){alert("ex in showContactDetails "+e.message);}
}


/* The click event handler when a tab on the 
* action bar is clicked on screen2
* @param - the type of tab details to show
*/
function addTab(a){
	//alert("in add tab");
	//alert(a);
	
	
	if(a=="contacts"){
		//alert("a is contactlist");
	viewDatabase=1;	
	bb.pushScreen('screen2.html','screen2',{title:"Algonquin Contact List"});
	
		}
	if(a=="addContact"){
		//alert("a is addcontact");
	viewDatabase=0;	
	
	bb.pushScreen('screen2.html','screen2',{title:"Add Algonquin Contact"});
	
		}
		if(a.trim()=="viewall"){
		//alert("a is viewall!!");
	viewCourses=1;	
	
	bb.pushScreen('screen6.html','screen6',{title:"My Timetable",state:"view"});
	
		}
		if(a.trim()=="editAdd"){
		//alert("a is editAdd");
		courseDetails.length=0;
	viewCourses=0;	
	
	bb.pushScreen('screen6.html','screen6',{title:"My Timetable", state:"editAdd"});
	
		}
		if(a.trim()=="add"){
		//alert("a is add");
		editstate=false;
		courseDetails.length=0;	
	viewCourses=0;	
	
	bb.pushScreen('screen6.html','screen6',{title:"My Timetable", state:"add"});
	
		}
}

/* The click event handler for add contact button
* in screen2 
* adds a new item to the Algcontacts table in the sqllite db
*/
function addContact(){
	
	try{
	//alert("start addContact");
	
	contactDetails["fname"]=document.getElementById("fname").value;
	contactDetails["lname"]=document.getElementById("lname").value;
	contactDetails["mphone"]=document.getElementById("mphone").value;
	contactDetails["hphone"]=document.getElementById("hphone").value;
	contactDetails["wemail"]=document.getElementById("wemail").value;
	contactDetails["hemail"]=document.getElementById("hemail").value;
	contactDetails["wemet"]=document.getElementById("wemet").value;
	if(personimgPath.length >1)
		contactDetails["photoLink"]=personimgPath;
	else
		contactDetails["photoLink"]=staticImage;
	contactDetails["type"]=0;	
	//alert(contactDetails["photoLink"]);
	currentId=" ";
	currentContact=" ";
	
	createContact(); 
	
	
	clearNewContactData();
	}
	catch(e){
		alert("error in addContact : "+e.message);
	}

}
function clearNewContactData(){
	
	
	document.getElementById("fname").value=" ";
	document.getElementById("lname").value=" ";
	document.getElementById("mphone").value="000-000-0000";
	document.getElementById("hphone").value="000-000-0000";
	document.getElementById("wemail").value=" ";
	document.getElementById("hemail").value=" ";
	document.getElementById("wemet").value=" ";
	document.getElementById("myimage").setAttribute("src","./images/ic_contacts.png");
	
	contactDetails.length=0;
	
	
}


function  getSpecificContactId(){
	//alert("start populate dd");
	var cid=null;
	findSpecificContactByNameAndPhone();
	return cid;
}
/************DATABASE OPERATIONS***************/
function initializeDatabase(){
	//console.log("in init db");
	if (typeof mynamespace === 'undefined') {
    abooknamespace = {};
	}
	
	if(!window.openDatabase){console.log("not supported");}
    console.log(" initializeDatabase: after checking database support ");
  	 //db = window.openDatabase("autos2", "1.0", "autos2", 1024*1024*100);
        abooknamespace.db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
		db=abooknamespace.db;
		
    console.log(" initializeDatabase: after open db ");
	
	
	
	 db.transaction( doTrans1x,function(trans,data){alert("contacts doTrans1x success");

		});

	 db.transaction( doTrans4x,function(trans,data){
		 //alert("contacts doTrans4x success");

		});	
		
	 db.transaction( doTrans5x,function(trans,data){
		 //alert("contacts doTrans5x success");

		});				

}
function onDBCreate(database) {
        //Attach the database because "window.openDatabase" would not have returned it
        abooknamespace.db = database;
        
    }
function doTrans1x( trans ){
	
  
  dbtrans=trans;
 //trans.executeSql("DROP TABLE if EXISTS AlgContacts");

  var sqlQuery="CREATE TABLE IF NOT EXISTS AlgContacts ";
  
  
   sqlQuery+=' ( contactId integer primary key  not null, how_met text )';

  trans.executeSql(sqlQuery );
  
 /***USED FOR TESTING ******/
 /*sqlQuery="INSERT OR REPLACE INTO AlgContacts (contactId,how_met) values (200, 'At the coffee shop')  ";
  alert("insert sql query");
  alert(sqlQuery);
   trans.executeSql(sqlQuery,[],function(trans,data){
		
		alert("!!!EEEcontacts insert success");
		alert(data.rows.length);
		trans.executeSql("select * from AlgContacts",[],function(trans,data){
			alert("XXXXEEEselecting all rows success");
			alert(data.rows.length);
			
			});
				
		});*/
 
 
}
function doTrans4x( trans ){
	
  
  dbtrans=trans;
 //trans.executeSql("DROP TABLE if EXISTS AlgPhotos");

  
  /**** Create photolink table ********/
  var sqlQuery="CREATE TABLE IF NOT EXISTS AlgPhotos ";
 
   sqlQuery+=' ( id integer not null primary key  autoincrement, contactId integer , photolink text, type integer )';
  // alert(sqlQuery);
   trans.executeSql(sqlQuery );
 
 
 
}
function doTrans5x( trans ){
	
  
  dbtrans=trans;
 //trans.executeSql("DROP TABLE if EXISTS Algcal");

  
  /**** Create photolink table ********/
  var sqlQuery="CREATE TABLE IF NOT EXISTS Algcal ";
 
   sqlQuery+=' ( id integer not null primary key  autoincrement, eventId integer )';
  // alert(sqlQuery);
   trans.executeSql(sqlQuery );
 
 
 
}
/* the function createDatabaseContact()
*/
function createDatabaseEvent(){
	try{
	
	//alert("start insert event");
	 sqlQuery="INSERT OR REPLACE INTO Algcal (eventId) ";
	 sqlQuery+=	"values ("+ parseInt(courseDetails.eventid) +"  )";
	 

 
	 
	//alert(sqlQuery); 
 db.transaction( function(trans){
	 
	  trans.executeSql(sqlQuery,[],function(trans,data){
		
		//alert("saving cal event success!!!");
		
		
		});
	 },function(error){alert(error);alert(error.code);alert(error.message)},function(trans,data){			
	
		
		});	 
	}catch(e){alert("exception in create database "+e);}
	 
	
}
/* the function select all calendar events
* selects all the eventids
*/
function selectAllEvents(){
	try{
		//alert("start select all photos");
		//sqlQuery="SELECT contactId,photolink from AlgPhotos ORDER BY contactId ASC";
		sqlQuery="SELECT * from Algcal ORDER BY eventId ASC";
		//alert(sqlQuery);
		db=abooknamespace.db;
		
		//db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
		//alert("after getting db");
		if(resultset7!=null) resultset7.rows.length=0;	
  db.transaction( function(trans){
	  trans.executeSql(sqlQuery,[],function(trans,data){
		//alert("select all db events success!!!");	
			resultset7=data; 
			var len=resultset7.rows.length; 
		//alert(len);
		if(len>0) displayCalendarEvents();
			
		
		
			
		},
		function(error){
			alert("error in select all events "+error);
			alert(error.message);
			});
	  
	  
	  },function(trans,data){/*alert("contacts select all photos success");*/});
	}
	catch(e){alert("exception in select all cal events "+e.message);}
}
/* the function createDatabaseContact()
*/
function createDatabaseContact(cid){
	try{
	
	
	 sqlQuery="INSERT OR REPLACE INTO AlgContacts (contactId,how_met) ";
	 sqlQuery+=	"values ("+ parseInt(cid) +" ,'"+ contactDetails.wemet+"' )";
	 

 
	 
	//alert(sqlQuery); 
 db.transaction( function(trans){
	 
	  trans.executeSql(sqlQuery,[],function(trans,data){
		
		//contactDetails["type"]=0;
		createDatabasePhotos(cid,contactDetails.photoLink);
		
		
		});
	 },function(error){alert(error);alert(error.code);alert(error.message)},function(trans,data){			
	
		
		});	 
	}catch(e){alert("exception in create database "+e);}
	 
	
}
/* the function createDatabasePhotos()
* inserts contact photo info 
* type is 0 when the photo link is for profile
*/
function createDatabaseContactPhotos(cid,plink){
	try{
		
	//alert("createDatabasePhotos: start");
	
	
	 sqlQuery="UPDATE AlgPhotos set photolink='"+plink+"' where (contactId="+cid+" and type=0)";

	 //alert(sqlQuery);
	
 db.transaction( function(trans){
	 
	  trans.executeSql(sqlQuery,[],function(trans,data){
		
		//alert("algphoto insert success!!!");
		
		
		});
	 },function(error){alert(error);alert(error.code);alert(error.message)},function(trans,data){			
	 //alert("algcontacts success in createDatabasePhotos");
		
		});	 
	}catch(e){alert("exception in create database "+e);}
	 
	
}
/* the function createDatabaseContact()
* inserts contact photo info 
* type is 0 when the photo link is for profile
*/
function createDatabasePhotos(cid,plink){
	try{
		
	//alert("createDatabasePhotos: start");
	
	
	 sqlQuery="INSERT OR REPLACE INTO AlgPhotos (contactId,photolink,type) ";
	 sqlQuery+=	"values("+ parseInt(cid) +" ,'"+ plink+"',";
	
	 sqlQuery+=	contactDetails.type+")";
	
	 //alert(sqlQuery);
	
 db.transaction( function(trans){
	 
	  trans.executeSql(sqlQuery,[],function(trans,data){
		
		//alert("algphoto insert success!!!");
		
		
		});
	 },function(error){alert(error);alert(error.code);alert(error.message)},function(trans,data){			
	 //alert("algcontacts success in createDatabasePhotos");
		
		});	 
	}catch(e){alert("exception in create database "+e);}
	 
	
}
function selectAllPhotos(){
	try{
		//alert("start select all photos");
		//sqlQuery="SELECT contactId,photolink from AlgPhotos ORDER BY contactId ASC";
		sqlQuery="SELECT * from AlgPhotos ORDER BY contactId ASC";
		//alert(sqlQuery);
		db=abooknamespace.db;
		
		//alert("after getting db");
		if(resultset4!=null) resultset4.rows.length=0;	
  db.transaction( function(trans){
	  trans.executeSql(sqlQuery,[],function(trans,data){
		//alert("select all photos success!!!");	
			resultset4=data; 
			//var len=resultset4.rows.length; 
		//alert(len);
			
		
		
			
		},
		function(error){
			alert("error in select all "+error);
			alert(error.message);
			});
	  
	  
	  },function(trans,data){/*alert("contacts select all photos success");*/});
	}
	catch(e){alert("exception in select all "+e.message);}
}
/* select the contact profile photo for display with the profile **/
function selectPhoto(){
	
	var mm=parseInt(currentContact);
	try{
		
		sqlQuery="SELECT photolink,type from AlgPhotos WHERE (contactId="+mm +")";
		
		//alert(sqlQuery);
		if(resultset!=null) resultset.length=0;
		db=abooknamespace.db;
		
		//db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
		//alert("after getting db");	
  db.transaction( doTrans3xb,function(trans,data){alert("contacts doTrans3x success");});

	}
	catch(e){ alert("exception in selectAllDesc "+e.message);
	}
}	
/* select the contact profile photo for display with the profile **/
function selectContactPhoto(){
	
	try{
		sqlQuery="SELECT photolink from AlgPhotos WHERE (contactId="+contactDetails.contactId +" AND  type=0)";
		
		db=abooknamespace.db;
		
		//db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
	
  db.transaction( doTrans3xa,function(trans,data){alert("contacts doTrans3x success");});

	}
	catch(e){ alert("exception in selectAllDesc "+e.message);
	}
}

/* select photolinks for type 0 photos for display in the list **/
function doTrans3xb(trans){
	//alert("start select photo 3xb");
	try{
		contactDetails["photoLink"]=staticImage;
		trans.executeSql(sqlQuery,[],function(trans,data){
			
			resultset=data; //norows=1;}	
			var len=resultset.rows.length; var i=0;j=1;
		//alert(len);
		if(len>0) {
			//alert("in loop");
			for(i=0;i<len;i++){
				//alert("!!!"+resultset.rows.item(i).type);
				//alert("!!!"+resultset.rows.item(i).photolink);
				if(resultset.rows.item(i).type==0)
				contactDetails["photoLink"]=resultset.rows.item(i).photolink;
				//alert(contactDetails["photoLink"]);
				if(resultset.rows.item(i).type==1)
					{
						contactDetails["photoOther"+j]=resultset.rows.item(i).photolink;
						j++;
					}
			}
			
		
		}
			
			bb.pushScreen('screen3.html','screen3',{title:"Contact Details"});	
		},
		function(error){
			alert("error in select all "+error);
			alert(error.message);
			});
	}
	catch(e){alert("Exception in trans3x "+e.message);}
}
/* select photolinks for type 0 photos for display in the list **/
function doTrans3xa(trans){
	//alert("start select photo trans 3xa");
	try{
		resultset3=new Array();;
		trans.executeSql(sqlQuery,[],function(trans,data){
			//alert("success trans 3xb");
			resultset3=data; //norows=1;}	
			var len=resultset3.rows.length; //var i=0;
		//alert(len);
			if(len>0) {
			 contactDetails["photoLink"]=resultset3.rows.item(0).photolink;
			}
				
		},
		function(error){
			alert("error in select all "+error);
			alert(error.message);
			});
	}
	catch(e){alert("Exception in trans3x "+e.message);}
}
/* select all for display in the list **/
function selectAllDesc(){
	//alert("start select all desc");
	try{
		if(resultset!=null) resultset.length=0;
		db=abooknamespace.db;
		
		//db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
		//alert("after getting db");	
 
 db.transaction( doTrans2x,function(error){console.log(error)},function(trans,data){//alert("PPPPPcontacts doTrans2x success");
		
		});

  
	}
	catch(e){ alert("exception in selectAllDesc "+e.message);
	}
}
function doTrans2x(trans){
	//alert("YYYYtrans2x start ");
	try{
		
		 sqlQuery="SELECT * FROM AlgContacts ";
		// alert(sqlQuery);
 		if(resultset!=null) resultset.rows.length=0;
		 trans.executeSql(sqlQuery,[],function(trans,data){
		//alert("success");
			resultset=data; //norows=1;}	
			var len=resultset.rows.length; //var i=0;
		//alert("result set length is "+len);
			
			if(len>0){
				findContactsById();
			
			}
		},function(error){
			alert("error in select all "+error);
			alert(error.message);
			});
	}
	catch(e){alert("exception in Trans2x "+e.message);
	}
}
/* the function selectSingleContact()
* select the howmet for a contact given the contactId
* @param - String the contactId
*/
function selectSingleContact(aa){
	try{
		currentContact=aa;
		//alert("start select single contact");
		db=abooknamespace.db;
		
		//db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
		
		 db.transaction( doTrans3x,function(error){console.log(error)},function(trans,data){//alert("PPPPPcontacts doTrans2x success");
		
		});
		
		 sqlQuery="SELECT how_met FROM  AlgContacts WHERE contactId="+aa;


		
	}
	catch(e){alert("ex in selectsinglecontact "+e.message);}
}
function doTrans3x(trans){
	
	try{
	//alert(sqlQuery);
		 trans.executeSql(sqlQuery,[],function(trans,data){
		
			resultset=data; 
			var len=resultset.rows.length; 
	
			if(len>0){
				//alert(resultset.rows.item(0).how_met);
				contactDetails["wemet"]=resultset.rows.item(0).how_met;
				//contactDetails["contactId"]=resultset.rows.item(0).contactId;
				
				selectPhoto();
			
			}
		},function(error){
			alert("error in select one "+error);
			alert(error.message);
			});
	}
	catch(e){alert("exception in Trans2x "+e.message);
	}
}
/* the function createDatabaseContact()
*/
function createDatabaseCal(eventid){
	try{
	
	
	 sqlQuery="INSERT OR REPLACE INTO Algcal (eventId) ";
	 sqlQuery+=	"values ("+ parseInt(eventid) +"  )";
	 

 
	 
	//alert(sqlQuery); 
 db.transaction( function(trans){
	 
	  trans.executeSql(sqlQuery,[],function(trans,data){
		
		alert("success insert eventid");
		
		
		
		});
	 },function(error){alert(error);alert(error.code);alert(error.message)},function(trans,data){			
	
		
		});	 
	}catch(e){alert("exception in create database cal "+e);}
	 
	
}
/* the function selectAllDatabaseCal()
*/
function selectAllDatabaseCal(){
	try{
	
	
	 sqlQuery="SELECT * from Algcal ";

	 
	//alert(sqlQuery); 
 db.transaction( function(trans){
	 
	  trans.executeSql(sqlQuery,[],function(trans,data){
		
		alert("success select all!!!");
		
		resultset7=data;
		
		
		
		});
	 },function(error){alert(error);alert(error.code);alert(error.message)},function(trans,data){			
	
		
		});	 
	}catch(e){alert("exception in create database cal "+e);}
	 
	
}
/* delete eventids no longer in the calendar **/
function deleteCalEvents(flagfordelete){
	
	try{
	
	
	 sqlQuery="DELETE from Algcal where  ";
		for(var i=0;i<flagfordelete.length;i++){
			sqlQuery="DELETE from Algcal where  eventId="+flagfordelete[i];
			
			db.transaction( function(trans){
	 
	  trans.executeSql(sqlQuery,[],function(trans,data){
		
		//alert("success delete!!!");
	
		});
	 },function(error){alert(error);alert(error.code);alert(error.message)},function(trans,data){			
	
		
		});	 
		}//end for
	 
	
 
	}catch(e){alert("exception in create database cal "+e);}
	 
}
/************END DATABASE OPERATIONS***************/
/************START LIST PROCESSING FUNCTIONS*************/

/************END LIST PROCESSING FUNCTIONS*************/

/************START ACCESS CONTACT LIST*************/


/* The functions that format the name displayed **/
function formatName(givenName,familyName){
	try{
		var initial=givenName.charAt(0);
		var initial2=familyName.charAt(0);
		
		familyName=setCharAt(familyName,0,initial2.toUpperCase())
		formattedName=familyName+" " + initial.toUpperCase();
		
	}
	catch(e){alert("exception in formatting name "+e.message);}
	return formattedName;
}
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
/************* START PIM CONTACT OPERATIONS ***************/

/***Callbacks for create, find ******************/
function onFindError(error){
	
	alert("Contacts Find: error");
	
	//alert("in contacts find error");
	//alert(error.code);
	switch (error.code) {
    case error.UNKNOWN_ERROR:
         alert("Contact find error: An unknown error occurred");
         break;
    case error.INVALID_ARGUMENT_ERROR:
         alert("Contact find error: Invalid argument");
         break;
    case error.PERMISSION_DENIED_ERROR:
         alert("Contact find error: Permission denied error");
         break;
    default:
         alert("Contact find error: other error, code=" + error.code);
    }
}
function onFindSuccess(results){
	alert("Contacts find success");
	//process the results
	var len=contacts.length;
			//scroll through contacts and update database
			alert("in contacts find success");
			for ( i=0;i<len;i++){
				
				alert(contacts[i]);
				alert(contacts[i].id);
				alert(contacts[i].ContactName);
				alert(contacts[i].emails);
				alert(contacts[i].displayName);
			}
	
}

function onSaveSuccess(contact) {
   // alert("Contact with id=" + contact.id + " is saved!");
	 currentId=contact.id;
	 createDatabaseContact(currentId);
	 //worker2.postMessage(aaa);
	 //alert ("current id is  "+currentId);
}

function onSaveError(error) {
    alert("Error saving contact: " + error.code);
	alert(error);
	alert(error.toString());
	alert(error.getMessage());
	alert("after error: " );
}
/***End Callbacks for create, find ******************/
/*Add the new data to contacts */
function createContact() {
	//alert("saving contact: " );
  var   contacts = blackberry.pim.contacts,
        ContactField = contacts.ContactField,
        name = {},
        workPhone = { type: contacts.ContactField.WORK, value: contactDetails.mphone },
		homePhone = { type: contacts.ContactField.WORK, value: contactDetails.hphone },
        workEmail = { type: contacts.ContactField.WORK, value: contactDetails.wemail },
        homeEmail = { type: contacts.ContactField.HOME, value: contactDetails.hemail},
		 
        contact;
        
    name.familyName = contactDetails.lname;
    name.givenName = contactDetails.fname;
    contact = contacts.create({
         "displayName": "JJames" ,
         "name": name,
         "phoneNumbers": [workPhone, homePhone],
         "emails": [workEmail, homeEmail]
    });
	//alert("before saving contact: " );
    contact.save(onSaveSuccess, onSaveError);
}
/** find all without search criteria **/
function findAllContactByNameAndPhone(){
	try{
		
		 blackberry.pim.contacts.find(["name","phoneNumbers"],null, onFindSuccess, onFindError);
	}
	catch(e){alert("error in findContactByName:" +e.message);}
}
/** find specific with search criteria **/
function findSpecificContactByNameAndPhone(){
	try{
		
		findOptions = new blackberry.pim.contacts.ContactFindOptions();
		findOptions.filter = [
        {fieldName: 
		blackberry.pim.contacts.ContactFindOptions.SEARCH_FIELD_FAMILY_NAME, 
		fieldValue: contactDetails.fname},
		{fieldName: 
		blackberry.pim.contacts.ContactFindOptions.SEARCH_FIELD_GIVEN_NAME, 
		fieldValue: contactDetails.lname},
		{fieldName: 
		blackberry.pim.contacts.ContactFindOptions.SEARCH_FIELD_WORK_PHONE, 
		fieldValue: contactDetails.wphone}						
                ];
				
		blackberry.pim.contacts.find(["name","phone"], findOptions , onFindSuccess, 				onFindError);		
	}
	catch(e){alert("error in findSpecificContactByNameandPhone:" +e.message);}
}
function populateArray(){
	try{
		var len=resultset2.rows.length;
		for (var i=0;i<len;i++){
			photoArray=new Array();
			photoArray["contactId"]=resultset2.rows.item(i).contactId;
			photoArray["contactImg"]=resultset2.rows.item(i).photolink;
			
			allPhotos.push(photoArray);
		}
	}
	catch(e){alert("Exception in populate array "+e.message);}
}
/* finds the contact and shows it on the page */
function findContactsById() {
	try{
	//alert("MMMMMMin find contacts by id");
	
	var len=resultset.rows.length;
	//alert("$$$ length of how_met is "+len);
	contacts = blackberry.pim.contacts;

	var contact,aa,i,fname=" ",j=0;
	
	items.length=0;
	for( i=0;i<len;i++)
	{
		//alert("in loop");
		contactDetails["photoLink"]=staticImage;
		
		contactDetails["type"]=0;
		contactDetails["contactId"]=resultset.rows.item(i).contactId;
		
		aa=resultset.rows.item(i).contactId.toString();
		currentContact=aa;
		//alert(currentContact);
	
		var plink2=getplink(currentContact);
		//alert(plink2);
		if(plink2!=null){
			if(plink2.length>5)
				contactDetails["photoLink"]=plink2;
					
		}
		
		
		contact=contacts.getContact(aa);
	
		
		if(contact){
		//alert("creating elements");
		 item = document.createElement('div');
		 //alert(item);
		 item.setAttribute('data-bb-type','item');
		 fname=formatName(contact.name.givenName,contact.name.familyName);
	
		 item.setAttribute('data-bb-title',fname);
		
		// item.setAttribute('data-bb-img',contactDetails.photoLink);
		
		  item.setAttribute('data-id',aa);
		
		 item.innerHTML = " ";
		
		
		item.onclick = function(){showContactDetails(document.getElementById("imgList").selected)};
		item.setAttribute('data-bb-img',"images/ic_contacts.png");
		//item.setAttribute('data-bb-img',contactDetails.photoLink);
		 items.push(item);			
 //alert("after items push");
		}
		else {
      // alert("There is no contact with id: " + aa);
	  }//end else
		
	
	}//end for
		//alert("!!!!before appending html");
		document.getElementById('imgList').refresh(items);
		//alert("after appending html");
   }
	catch(e){alert("exception in getcontactbyid "+e.message);}
    
}//end function

/* function to get each profile photo **/
function getplink(){
	var plink;
	try{
		var cid=parseInt(currentContact);
		
		for(var i=0;i<resultset4.rows.length;i++){
			//alert("###in loop"); alert(cid);
			if(resultset4.rows.item(i).contactId==cid && resultset4.rows.item(i).type==0){
				//alert("###!!!is equal");
				plink=resultset4.rows.item(i).photolink;
				//alert("###!!!plink is "+plink);
				break;
			}
		}
	}
	catch(e){alert("ex in getplink "+e.message);}
	
	return plink;
}

/************END PIM CONTACT OPERATIONS*************/

/************SYSTEM EVENT LISTENERS***************/

/************END SYSTEM EVENT LISTENERS **********/


function onCancel() {
    alert("User pressed cancel in contact picker.");
}

function onInvoke(error) {
    if (error) {
       alert("Error invoking contact picker: " + error.code);
    } else {
       alert("Contact picker invoked!");
    }
}

function onContactSelected(data) {
    alert("Id of selected contact: " + data.contactId);
}

function onContactsSelected(data) {
    alert("Total # contacts selected: " + data.contactIds.length);
}

function onContactAttributeSelected(data) {
    alert("The selected field '" + data.field + "(" + data.type + ")' has value '" + data.value + "' belongs to contact with id: " + data.contactId);
}

function invokeContactPickerSingle() {
    contacts.invokeContactPicker({
        mode: ContactPickerOptions.MODE_SINGLE,
        fields: ["phoneNumbers"]
    }, onContactSelected, onCancel, onInvoke);
}

function invokeContactPickerMultiple() {
    contacts.invokeContactPicker({
        mode: ContactPickerOptions.MODE_MULTIPLE,
        fields: ["phoneNumbers"]
    }, onContactsSelected, onCancel, onInvoke);
}

function invokeContactPickerAttribute() {
    contacts.invokeContactPicker({
        mode: ContactPickerOptions.MODE_ATTRIBUTE,
        fields: ["phoneNumbers", "emails"]
    }, onContactAttributeSelected, onCancel, onInvoke);
}

/***** SCREEN 6 FUNCTIONS ********/
function initializeTimetableScreen(){
	try{
		
		
	
	}
	catch(e){
		alert("Exception in initialize timetable "+e.message);
	}
}
function editCalendaritem(ev){
	try{
		//alert("in edit calendar item");
		viewCourses=0;
		editstate=true;
		var pp=ev.target, eventid;
		//alert("target is ");
		//alert(pp);
		
		eventid=pp.getAttribute("id");
		courseDetails.eventid=eventid;
		//alert("event id is "+eventid);
		//based on eventid extract details from calendar
		//show the Edit/Add screen
		getCalendarItem(eventid);
		bb.pushScreen("screen6.html","screen6",{title:"My Timetable",state:"any"});
		
	}
	catch(e){
		alert("Exception in ditCalendaritem "+e.message);
	}
}
function getCalendarItem(id){
	try{
		//loop through calendar array
		calevents.forEach(function (evt) {
			if(evt.id==id)
			{
				//items to populate are
				//semesterId,dowui,durationId,lab,notify,
				//cname,croom,rawtime
				courseDetails["cname"]=evt.summary;
				courseDetails.croom=evt.location;
				var pp=courseDetails.croom.split(" ");
				if(pp.length>1){
					if(pp[0].trim()=="Lab"){
						courseDetails.lab="true";
					}
					courseDetails.croom=pp[1];
				}
				//gets courseDetails.dowui
				courseDetails.dowReal=evt.start.getDay();
				//var aa=["Monday","Tuesday","Wednesday","Thursday","Friday"];
				var bb=["00","11","22","33","44","55"];
				courseDetails.dowui=bb[courseDetails.dowReal];
				//alert("dow real is ");
				//alert(courseDetails.dowReal);
				//alert(bb[courseDetails.dowReal]);
				//alert("dowui is ");
				//alert(courseDetails.dowui);
			var dd1=evt.end.getHours();
			var mm1=evt.end.getMinutes();
			
			var dd2=evt.start.getHours();
			var mm2=evt.start.getMinutes();
			var dhrs=dd1-dd2;
			//alert("dd2 is "+dd2);
			//alert("dd1 is "+dd1);
			//alert("@@@ dhrs is "+dhrs);
			var dmins=mm2-mm1;
			if(dhrs==1 && dmins==0) courseDetails.duration="111";
			if(dhrs==1 && dmins==30) courseDetails.duration="130";
			if(dhrs==2 && dmins==0) courseDetails.duration="222";
			if(dhrs==2 && dmins==30) courseDetails.duration="230";
			if(dhrs==3 && dmins==0) courseDetails.duration="333";
			if(dhrs==3 && dmins==30) courseDetails.duration="330";
				//get start time
			//alert("duration is ");
			//alert(courseDetails.duration);
			var rmins=evt.start.getMinutes();
			if( rmins==0) rmins=rmins+"0";	
			courseDetails.rawtime=evt.start.getHours() +":"+rmins;
			 //alert(evt.recurrence);
			 //var ep=(evt.recurrence).frequency;
			// alert(ep);
			var expmonth;
			var expmonth=evt.start.getMonth();
			//alert(expmonth);
			
		/*	var expdate=(evt.recurrence).expires;
			if(expdate==null) expmonth=11;
			else{
				expmonth=expdate.getMonth();
			}*/
	
			expmonth++;
			//alert("expiry month is "+expmonth);
			if(expmonth>=9 && expmonth<=12 ) courseDetails.semesterId="1a1";
			if(expmonth>=1 && expmonth<=4 ) courseDetails.semesterId="2a1";
			if(expmonth>=5 && expmonth<=7 ) courseDetails.semesterId="3a1";
			
			//alert("semester id is ");
			//alert(courseDetails.semesterId);
			if(evt.reminder>0) courseDetails.notify="true";
			
			
						
			}
      
   });
		//match event id
		//extract details
		//show details
		
	}
	catch(e){
		alert("Exception in getCalendarItem "+e.message);
	}
}
/* the function addCourse 
* this function is called by the save button
* on the Add/Edit Calendar screen
* An update is treated as a delete and create
**/
function addCourse(){
	try{
		var ev;
		if(editstate) {deletestate=true;deleteEventitem(ev);}
		//alert("start addcourse ");
		courseDetails["cname"]=document.getElementById("cname").value;
		
		courseDetails["croom"]=document.getElementById("clnum").value;
		if(courseDetails.lab)
			courseDetails["croom"]="Lab "+courseDetails["croom"];
		//alert("before calculate date ");
		calculateDate();
		//alert("before repeat ");
		
		//createEventInDefaultCalendarFolder();
		createEventRepeatEvent();
		//if the user updated anything and saved
		//viewCourses=1;
		bb.pushScreen("screen6.html","screen6",{title:"My Timetable", state:"add"});
		
	}
	catch(e){
		alert("Exception in addCourse "+e.message);
	}
}
function sendToggle(val){
	//alert("start send toggle "+val);
	try{
		var togState1,togState2;
		if(val.trim()=="toggle1"){
			
			courseDetails["lab"]=(document.getElementById("toggle1")).getChecked();
			//alert(courseDetails["lab"]);
			
			
		}
		if(val.trim()=="toggle2"){
			courseDetails["notify"]=(document.getElementById("toggle1")).getChecked();
			//alert(courseDetails["notify"]);
		}
	}
	catch(e){
		alert("Exception in sendToggle "+e.message);
	}
}
function sendSelected(val){
	try{
		if(courseDetails==null) courseDetails=new Array();
		//alert("start send selected "+val);
		var mp,mmp,dur;
		
		if(val.trim()=="dow"){
			courseDetails["dowui"]=$("#dow option:selected").val();
			courseDetails["dowReal"]=dowlookup[courseDetails["dowui"]];
			//alert(courseDetails["dow"]);
			courseDetails["dowStr"]=$("#dow option:selected").text();
			//alert(courseDetails["dowStr"]);
			
			
		}
		
		if(val.trim()=="dur"){
			courseDetails["duration"]=$("#duration option:selected").text();
			
			courseDetails["durationId"]=$("#duration option:selected").val();
		}
		if(val.trim()=="sem"){
			var sem=$("#sem option:selected").val();
			//alert(sem);
			if(sem.trim()=="1a1")
			{
				
				courseDetails["semesterId"]="1a1" ;
				courseDetails["semester"]="Dec 10, " ;
			}
			if(sem.trim()=="2a1")
			{
				courseDetails["semesterId"]="2a1" ;
				courseDetails["semester"]="Apr 10, " ;
			}
			if(sem.trim()=="3a1")
			{
				courseDetails["semesterId"]="3a1" ;
				courseDetails["semester"]="Jul 10, " ;
			}
			//alert(courseDetails.semester);
			//alert(courseDetails.semesterId);
		}
		if(val.trim()=="nots"){
			var pt=$("#nots option:selected").text();
			//alert("reminder is "+pt);
			var ptt=pt.split(" ");
			if(ptt[1]=="min")
				courseDetails["reminder"]=ptt[0];
			if(ptt[1]=="Hour")
				courseDetails["reminder"]=(parseInt(ptt[0])*60).toString();;	
			//alert("reminder is mins");
			//alert(courseDetails.reminder);
		}
		
		
	}
	catch(e){
		alert("Exception in sendSelected "+e.message);
	}
}
/** sets the default values in courseDetails
* for all the selectable controls 
* this occurs when the dom is ready
* onchange events are generated by each of the controls
* for dynamic update
**/

function getdefaultSelected(){
	try{
		if(courseDetails==null) courseDetails=new Array();
		//alert("start send selected "+val);
		var mp,mmp,dur;
		
		
			courseDetails["dowui"]=$("#dow option:selected").val();
			courseDetails["dowReal"]=dowlookup[courseDetails["dowui"]];
			courseDetails["dowStr"]=$("#dow option:selected").text();
			//alert(courseDetails["dowStr"]);
	
		
			courseDetails["duration"]=$("#duration option:selected").text();
			courseDetails["durationId"]=$("#duration option:selected").val();
		
		
			var sem=$("#sem option:selected").val();
			//alert(sem);
			if(sem.trim()=="1a1")
			{
				courseDetails["semesterId"]="1a1" ;
				courseDetails["semester"]="Dec 10," ;
			}
			if(sem.trim()=="2a1")
			{
				courseDetails["semesterId"]="2a1" ;
				courseDetails["semester"]="Apr 10," ;
			}
			if(sem.trim()=="3a1")
			{
				courseDetails["semesterId"]="3a1" ;
				courseDetails["semester"]="Jul 10," ;
			}
			var togState1,togState2;
	
			courseDetails["lab"]=(document.getElementById("toggle1")).getChecked();
			

			courseDetails["notify"]=(document.getElementById("toggle2")).getChecked();
			
			var pt=$("#nots option:selected").text();
			var ptt=pt.split(" ");
			if(ptt[1]=="min")
				courseDetails["reminder"]=ptt[0];
			if(ptt[1]=="Hour")
				courseDetails["reminder"]=(parseInt(ptt[0])*60).toString();;	
			//alert("reminder is mins");
			//alert(courseDetails.reminder);
	
	}
	catch(e){
		alert("Exception in sendSelected "+e.message);
	}
}
/* the function formatTime
* formats the UI time to what is 
* expected by the calendar
*/
function formatTime(aa){
	try{
		//alert("start format time "+aa);
		aa=aa.trim();
		var aalist1=aa.split(" ");
		
		if(aalist1[1]=="AM")
			aaAdd=0;
		if(aalist1[1]=="PM")
			aaAdd=12;
		var aalist2=aalist1[0].split(":");
		
		if(aalist2.length>1)
		{
			var pp;
			if(aalist2[0]==12){
				 pp=parseInt(aalist2[0]);
			}
			else{
			 pp=parseInt(aalist2[0])+aaAdd;}
			
			courseDetails["time"]=pp+":"+aalist2[1];
			
		}
		//alert("CD time is !!!");
		//alert(courseDetails["time"]);
				
	}
	catch(e){
		alert("Ex in formatting time "+e.message);
	}
}
function calculateDate(){
	
	try{
		//alert("start calculate date");
		var today=new Date();//numeric datein month 1-31
		//alert(today);
		var month=today.getMonth();//months 0-11
		month++;
		//alert(month);//actual month=month++;
		var year=today.getFullYear();
		//alert("year is ");
		//alert(year);
		var dd=today.getDay();//numeric day of week 0-6
		//dd++;//actual day dd++;
		//alert("dd is "+dd);
		var nextDateDiff,nextDateDOM,nextDateYear,
		nextDateShortMon,nextDateDate;
		nextDateYear=year;
		////alert(dd);
		//alert(courseDetails.dowReal);
		if(dd>courseDetails.dowReal){
			
			nextDateDOM=today.getDate()-(dd-courseDetails.dowReal)+7;
			
			if([4,6,9,11].indexOf(month) !=-1)
			{
				//alert("month in 1");
				if(nextDateDOM >30) {nextDateDOM-=30;month++;}
			}
			if([1,3,5,7,8,10,12].indexOf(month) !=-1)
			{
				//alert("month in 2");
				if(nextDateDOM >31) {nextDateDOM-=31;month++;}
			}
			if([2].indexOf(month) !=-1)
			{
				//alert("month in 3");
				if(nextDateDOM >28) {nextDateDOM-=28;month++;}
			}
			//alert("next date dom> !!!"+nextDateDOM);
		}
		
		if(dd<courseDetails.dowReal){
			nextDateDOM=today.getDate()+(courseDetails.dowReal-dd)
			//alert("next date dom< !!!"+nextDateDOM);
		}
		
		if(dd==courseDetails.dowReal){
			nextDateDOM=today.getDate();
			//alert("next date dom==!!!"+nextDateDOM);
		}
		//if the number is greater than days in a month
		if(nextDateDOM>monthLookup.month )
		{
			if(month<12){
				nextDateDOM=nextDateDOM-monthLookup[month];
				nextDateMonth=month++;
				nextDateYear=year;
			}
			else{
				nextDateDOM=nextDateDOM-monthLookup[month];
				nextDateMonth=1;
				nextDateYear=year++;
			}
		}
		courseDetails["nextDateDOM"]=nextDateDOM;
		courseDetails["nextDateMonth"]=month;
		//alert("next date year");
		//alert(nextDateYear);
		courseDetails["nextDateYear"]=nextDateYear;
//create the full date for the appointment
	 nextDateShortMon=monthNameLookup[month];
	 //alert("nextDateshort mon is "+nextDateShortMon);
	 
	//new Date("Jan 21, 2014, 12:00"),
	nextDateDate=""; var endDateDate="";
	//alert("short mon is "+nextDateShortMon);
	//alert("dom is "+nextDateDOM);
	nextDateDate=nextDateShortMon+" "+ nextDateDOM+", ";
	
	//alert(nextDateDate);
	nextDateDate+=nextDateYear+", ";
	endDateDate=nextDateDate;
	//alert("end date isAAABBB ");
	//alert(endDateDate);
	//user may not change time entered previously
	if(courseDetails.time==null && editstate)
		courseDetails["time"]=courseDetails.rawtime;
	
	if(courseDetails.time==null)
		{alert("You must choose time"); return;}
		
	if(courseDetails.time.length<7)
		courseDetails["time"]=courseDetails.time+":00";
	//alert("!!!!##time is "+courseDetails.time);
	processEnd();
	//alert("end time is ");
	///alert(courseDetails["endtime"]);
	endDateDate+=courseDetails["endtime"];
	//alert("end date isAAA ");
	//alert(endDateDate);
	nextDateDate+=courseDetails["time"];
	//alert("!!!!!next date date is "+nextDateDate);
	//alert(nextDateDate);
	courseDetails["formattedDate"]=nextDateDate;
	courseDetails["endDate"]=endDateDate;
	

		
	}
	catch(e){
		alert("Exception in calculateDate "+e.message);
	}
}



function onSaveCalSuccess(saved) {
   // alert("Event saved successfully: " + saved.id);
    recEvent = saved;
	courseDetails["eventid"]=saved.id;
	//alert(courseDetails.eventid);
	createDatabaseEvent();
}

function onSaveCalError(error) {
    //alert("Event not saved, error code: " + error.code);
	//alert("Event not saved, error code: " + error.message);
	
	switch (error.code) {
    case error.UNKNOWN_ERROR:
        alert("Save event error: An unknown error occurred");
        break;
    case error.INVALID_ARGUMENT_ERROR:
        alert("Save event error: Invalid argument");
        break;
    case error.PERMISSION_DENIED_ERROR:
        alert("Save event error: Permission denied error");
        break;
    default:
        alert("Save event error: other error, code=" + error.code);
    }
}
/**create an event that does not repeat ****/
function createEventInDefaultCalendarFolder() {
	calendar = blackberry.pim.calendar;
   evt = calendar.createEvent({
       "summary": courseDetails.cname,
       "location": courseDetails.croom,
       "start": new Date("Jan 01, 2014, 12:00"),
       "end": new Date("Jan 01, 2014, 12:30")
       // if timezone is specified explicitly, then the times will be
       // for that particular timezone; otherwise, the times will be
       // for the current device timezone
       //"timezone": "America/New_York"
   });
   evt.save(onSaveCalSuccess, onSaveCalError);
}
/** Create an event that repeats every week
* until the end of the semester
**/ 
function createEventRepeatEvent() {
try{	
	//alert("start repeat event");
	
	var expires=courseDetails.semester+courseDetails["nextDateYear"]+",12:00:00";
	//alert(expires);
	 calendar = blackberry.pim.calendar;
    var CalendarRepeatRule = calendar.CalendarRepeatRule;
	var rem;reminder;
	
	if(courseDetails.notify)
	{ 
	//alert("EEEcoursedet reminder is  "+courseDetails.reminder);
		rem=parseInt(courseDetails.reminder);
		reminder=new Number(rem);
	//alert("reminder is "+reminder);
	}
	
    
	
	var start=new Date(courseDetails.formattedDate),
   //var start = new Date("Jan 21, 2014, 12:00"),
   
   end = new Date(courseDetails.endDate),
    venue = courseDetails.croom,
	summary = courseDetails.cname,

 
       rule = {
           "frequency": CalendarRepeatRule.FREQUENCY_WEEKLY,
           "expires": new Date(expires),
           "dayInWeek": CalendarRepeatRule.MONDAY 
       };
		setCalendarRepeat(rule,CalendarRepeatRule);
		//alert("after set calendar repeat rule");
if(courseDetails.notify)
	{ 
	/*alert("course details notify");	
	alert(courseDetails.formattedDate);
	alert(courseDetails.endDate);
	alert(summary);
	alert(venue);
	alert(start);
	alert(end);
	alert(reminder);
	alert(rule);*/	
   recEvent = calendar.createEvent({"summary": summary, "location": venue, "start": start, "end": end, "reminder":reminder,"recurrence": rule});
	}
	else{
	/*	alert("course details not notify");
		alert(summary);
	alert(venue);
	alert(start);
	alert(end);
	alert(reminder);
	alert(rule);*/		
	 recEvent = calendar.createEvent({"summary": summary, "location": venue, "start": start, "end": end, "recurrence": rule});
	}
   
   recEvent.save(onSaveCalSuccess, onSaveCalError);
}
catch(e){
		alert("Ex in createEventRepeatEvent "+e.message);
	}
}

/* the function getCalendarRepeat
* gets the repeat day in week rule
*/
function setCalendarRepeat(rule,CalendarRepeatRule)
{
	try{
		//alert("start calendar repeat rule");
		var mm=parseInt(courseDetails.dowReal);
		//alert(mm);
		switch(mm)
		{
			case 1:
			rule.dayInWeek=CalendarRepeatRule.MONDAY;
			break;
			case 2:
			rule.dayInWeek=CalendarRepeatRule.TUESDAY;
			break;
			case 3:
			rule.dayInWeek=CalendarRepeatRule.WEDNESDAY;
			break;
			case 4:
			rule.dayInWeek=CalendarRepeatRule.THURSDAY;
			break;
			case 5:
			rule.dayInWeek=CalendarRepeatRule.FRIDAY;
			break;
			
		}
	}
	catch(e){
		alert("Ex in setCalendarRepeat "+e.message);
	}
}
/* the function getCalendarRepeat
* gets the repeat day in week rule
*/
function getCalendarRepeat(rule)
{
	try{
		//alert("start calendar repeat rule");
		var mm=rule.dayinWeek;
		
		//alert(mm);
		switch(mm)
		{
			case 1:
			rule.dayInWeek=CalendarRepeatRule.MONDAY;
			courseDetails.dowui="Monday";
			break;
			case 2:
			rule.dayInWeek=CalendarRepeatRule.TUESDAY;
			courseDetails.dowui="Tuesday";
			break;
			case 3:
			rule.dayInWeek=CalendarRepeatRule.WEDNESDAY;
			courseDetails.dowui="Wednesday";
			break;
			case 4:
			rule.dayInWeek=CalendarRepeatRule.THURSDAY;
			courseDetails.dowui="Thursday";
			break;
			case 5:
			rule.dayInWeek=CalendarRepeatRule.FRIDAY;
			courseDetails.dowui="Friday";
			break;
			
		}
	}
	catch(e){
		alert("Ex in getCalendarRepeat "+e.message);
	}
}

/** Reading from Calendar *****/
//Read all and compare eventId with db stored val
function onCalFindSuccess(events) {
  // alert("Found " + events.length + " events!");
   calevents=events;
   //alert("before display cal events");
   selectAllEvents();
 
}
function onCalFindSuccess2(events) {
  // alert("Found " + events.length + " events!");
   calevents=events;
  // alert("before display cal events");
  
 
}
function onCalFindError(error) {
   alert("Error: " + error.code);
}
//find all sorted by date in calendar
// Filter is optional in search
function listAllEvents(limit) {
	//alert("start list all events");
	var calendar = blackberry.pim.calendar,
    CalendarFindOptions = calendar.CalendarFindOptions;
//sort on the start date
   var findOptions = {
       "sort": [{
          "fieldName": CalendarFindOptions.SORT_FIELD_START,
          "desc": false
       }],
       "detail": CalendarFindOptions.DETAIL_AGENDA,
       "limit": limit
   };

   calendar.findEvents(findOptions, onCalFindSuccess, onCalFindError);
}
//find all sorted by date in calendar
// Filter is optional in search
function listAllEvents2(limit) {
	//alert("start list all events222");
	var calendar = blackberry.pim.calendar,
    CalendarFindOptions = calendar.CalendarFindOptions;
//sort on the start date
   var findOptions = {
       "sort": [{
          "fieldName": CalendarFindOptions.SORT_FIELD_START,
          "desc": false
       }],
       "detail": CalendarFindOptions.DETAIL_AGENDA,
       "limit": limit
   };

   calendar.findEvents(findOptions, onCalFindSuccess2, onCalFindError);
}
/*** End Reading From Calendar ******/
/*******END SCREEN 6 FUNCTIONS ********/
/** screen 10 functions *******/
function chooseTime(){
	try{
		
		var xx=document.getElementById("cname");
		
		
		courseDetails["cname"]=document.getElementById("cname").value;
		
		courseDetails["croom"]=document.getElementById("clnum").value;
		
		bb.pushScreen('screen10.html','screen10',{title:"Choose Time"});
	}
	catch(e){alert("Exception in choosetime "+e.message)}
}
function selectTime(ev){
	try{
		
		var pp=ev.target;
		var ppp=pp.innerHTML;
		//alert("before format time");
		formatTime(ppp);
		courseDetails["rawtime"]=ppp;
		
		bb.pushScreen('screen6.html','screen6',{title:"My Timetable",state:"any"});
	}
	catch(e){alert("Exception in choosetime "+e.message)}
}
function processEnd(){
	try{
		var pp,pmin,hour,newmin;
		//alert(courseDetails["duration"]);
		 pp=courseDetails["duration"].split(" ");
		 hour=pp[0];
		if(pp.length>2) pmin=pp[2];
		else pmin="00";
		// alert("pmin is "+pmin);
		var pp2=courseDetails.time.split(":");
		var newhour=parseInt(pp2[0])+parseInt(pp[0]);
		
		
	 	newmin=parseInt(pp2[1])+parseInt(pmin);
		if(newmin>=60) {newmin-=60;newhour++;}
		//alert("new min is "+newmin);
		if(newmin==0) 	
			courseDetails["endtime"]=newhour+":"+"00:00";
		else
			courseDetails["endtime"]=newhour+":"+newmin+":00";	
		//alert(courseDetails.endtime);
		
	}
	catch(e){alert("Exception in processEnd "+e.message)}
}
/* selects all the calendar events from the calendar object
* displays them on the screen
* resultset7 is populated
*/
function displayCalendarEvents(){
	
	try{
		
		var flagfordelete=new Array();
		 monevents.length=0,tueevents.length=0,wedevents.length=0,
		thuevents.length=0,frievents.length=0;
		//calevents;
		//alert("cal events is ");
		//alert(calevents);
		//alert(calevents.length);
		//alert("after cal events length");
		var matchfound=false;
		outerloop:
		for(var i=0;i<resultset7.rows.length;i++){
			//alert("in i loop i is "+i);
			for (var j=0;j<calevents.length;j++){
				//alert(calevents[j].id);
				//alert(resultset7.rows.item(i).eventId);
				if(resultset7.rows.item(i).eventId==calevents[j].id){
					//alert("match is found");
					createDisplayItem1(calevents[j]);
					matchfound=true;
					continue outerloop;
				}//end if
				
				
			}//end j for
			if(!matchfound){
					//alert("match is not found");
					 //alert(resultset7.rows.item(i).eventId);
				flagfordelete.push(resultset7.rows.item(i).eventId);
				}
		}//end i for
		//alert("flagfor delete length is ");
		//alert(flagfordelete.length);
		if(flagfordelete.length>0) deleteCalEvents(flagfordelete);
		viewCourses=1;
		//bb.pushScreen("screen6.html","screen6",{title:"My Timetable"});
		
		
	}
	catch(e){alert("Exception in displayCalendarEvents "+e.message)}
}
function createDisplayItem1(event){
	try{
		
		//alert("in create display item1");
		var pp=event.start;
		//alert(pp);
		var day=pp.getDay();
		//alert(day);
		
		if(day==1) monevents.push(event);
			
		
		if(day==2) tueevents.push(event);
		if(day==3) wedevents.push(event);
		if(day==4) thuevents.push(event);
		if(day==5) frievents.push(event);
		
	}
	catch(e){alert("Exception in createDisplayItem "+e.message)}
}
function addEventItem(aa,ss){
	try{
		//alert("start add event item");
		var hrsmins1,arr1,arr2,timelapsem;
		//alert(aa.start);
		//alert(aa.end);
		arr1=getTimetableShowTime(aa.start);
		arr2=getTimetableShowTime(aa.end);
		//alert("!!array2 hours "+arr2[1]);
		//alert("!!array1 hours "+arr1[1]);
		var timelapseh=arr2[1]-arr1[1];
		if(arr2[2]>arr1[2])
		 {timelapsem=arr2[2]-arr1[2]; }
		 else 
		 {
			 if(arr2[2]<arr1[2]){
			 arr2[2]+=60;arr2[1]-=1;
			 timelapsem=arr2[2]-arr1[2];
			 }
			 else{
				 timelapsem=0;
			 }
		 }
		 
		
		if(arr1[1]>12) arr1[1]-=12;
		if(arr1[2]==0)
			hrsmins1=arr1[1]+":0"+arr1[2];
		else
			hrsmins1=arr1[1]+":"+arr1[2];	
		//alert("hrs mins 1" +hrsmins1);
		//add the am/pm
		hrsmins1+=" "+arr1[0];	
		//alert("hrs mins 1" +hrsmins1);
		ss='<div id="evitem">';
		ss+="<div class='selector' id='evsummary' ><p>";
					ss+=aa.summary+"</p></div>";
					ss+='<div class="sendRight" id="evstarttime" ><p>';
					ss+=hrsmins1+'</p></div>';
ss+='<div class="selector" id="evlocation"><p>'+aa.location+'</p></div>';
ss+='<div class="sendright" id="eventtime"><p>'+timelapseh+'.'+timelapsem+' Hrs.'+' </p></div>';

ss+='<div class="editbutton2 " id="'+aa.id+'" '+' >Edit</div></div>	';
//ss+='<div class="editbutton2 " id="1234" >Edit</div></div>	';
//alert("ss at end");
//alert(ss);
//alert(	$("#calitem"));
$("#calitem").append(ss);
//$("#calitem").refresh();
//alert("after append");		
		
	}
	catch(e){alert("Exception in addevItem "+e.message)}
}
function writeEachDayEvents(dayarray,dayname){
	
	try{
		//alert("writing eac day event");
		//alert(dayarray.length);
		if(dayarray.length>0){
			//alert("creating item");
				 ss="<div id='calday' ><p>"+dayname+"</p></div>";
				$("#calitem").append(ss);
				for (var i=0;i<dayarray.length; i++){
					addEventItem(dayarray[i],ss);

				}
			}
		
	}
	catch(e){alert("Exception in writeEachDayEvents "+e.message)}
}
function getTimetableShowTime(mm){
	
	try{
		//alert("getting time "+mm);
		var newarray=new Array();
		var hours=mm.getHours();
		if(hours>12) {newarray.push(" PM");}
		else{
			if(hours<12) {newarray.push(" AM");}
			else
			{if(hours==12){newarray.push(" PM");}}
		}
		
		var mins=mm.getMinutes();
		newarray.push(hours);
		newarray.push(mins);
		
		return newarray;
		
		
	}
	catch(e){alert("Exception in getTimetableShowTime "+e.message)}
}
function deleteEventitem(ev){
	
	try{
		//alert("start delete");
		//delete from calendar
		var calendar = blackberry.pim.calendar,
    evt;
	db=abooknamespace.db;
	
	//refresh here get all cal events
	//alert("before list all events2");
	listAllEvents2(30);
	//alert("after listing all events");
	//alert(courseDetails.eventid);
	//go through list and find event
	for (var i=0;i<calevents.length;i++){
		if(calevents[i].id==courseDetails.eventid)
			calevents[i].remove(function(){
				//delete from database
				//alert("delete success from calendar");
				
		sqlQuery="DELETE from Algcal where eventId="+courseDetails.eventid ;
		//alert(sqlQuery);
			db.transaction( function(trans){
	 
	  trans.executeSql(sqlQuery,[],function(trans,data){
		editstate=false;
		//alert("success delete!!!");
		editstate=false; 
		if(!deletestate)
		bb.pushScreen("screen6.html","screen6",{title:"My Timetable", state:"delete"});
	
		});
	 },function(error){alert(error);alert(error.code);alert(error.message)},function(trans,data){			
	
		
		});	 
				
	
				},function(error){
					alert("error removing the event "+error.message);
					});
	}
		
		
		
		
	}
	catch(e){alert("Exception in deleteEventItem "+e.message)}
}
function initializeCourseDetails(){
	courseDetails["cname"]="Enter course";
	courseDetails["croom"]="Enter location";
	courseDetails["semesterId"]="1a1";
	courseDetails["dowui"]="11";
	courseDetails["lab"]="false";
	courseDetails["notify"]="false";
	courseDetails["rawtime"]="Choose Time ";
	courseDetails["duration"]="111 ";
	
}
/*******END SCREEN 10 FUNCTIONS ********/



