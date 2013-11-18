var viewDatabase=0;

var db=null;
var elementE=null;
var idE=null;
sqlQuery=" ";
var contacts;

var resultset=null;
var resultset2=null;
var resultset3=new Array();
var resultset4;
var currentId=null;
var aaa=new Array();
var items = [],
      item;
	  
var myLat;
var myLong;
var personimgPath=" ";
var worker1;
var worker4;

var contactDetails;
var photoDetails;
var allPhotos;
var currentContact;
var staticImage="images/ic_contacts.png";
blackberry.io.sandbox = false;

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
				
			

console.log("on screen ready 2");

			},//end on screen ready
		//operations after DOM is ready	
							
		ondomready: function(element, id, params) {
	//register event listeners		
	$("#myimage").click(function(){navigateToCamera("personImg")});
	$("#oimg1").click(function(){navigateToCamera("otherImg1")});
	$("#oimg2").click(function(){navigateToCamera("otherImg2")});
	$("#oimg3").click(function(){navigateToCamera("otherImg3")});
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
				alert(pp.plink);
				//alert(pp.plink);
				alert("after plink");
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
		  }
		
	}
	catch(ee){alert("ex in navigation to contacts "+ee.message);}
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
				createDatabasePhotos(currentContact,filepath);
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
              alert("saved "+ path);
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
		
		
		//alert(JSON.stringify(contact.phoneNumbers[0]));
		
		//populate the document or the contactdesc array
	/*	contactDetails["fname"]=contact.name.givenName;
		contactDetails["lname"]=contact.name.familyName;
		contactDetails["mphone"]=contact.phoneNumbers[0].value;
		contactDetails["hphone"]=contact.phoneNumbers[1].value;
		contactDetails["wemail"]=contact.emails[0].value;
		contactDetails["hemail"]=contact.emails[1].value;
		*/
		
		//alert("after populating contact details");
	
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
	
	if(!window.openDatabase){console.log("not supported");}
    console.log(" initializeDatabase: after checking database support ");
  	 //db = window.openDatabase("autos2", "1.0", "autos2", 1024*1024*100);
        db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
    console.log(" initializeDatabase: after open db ");
	
	 db.transaction( doTrans1x,function(trans,data){alert("contacts doTrans1x success");

		});

	 db.transaction( doTrans4x,function(trans,data){
		 //alert("contacts doTrans4x success");

		});		

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
		
		db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
		//alert("after getting db");	
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
	  
	  
	  },function(trans,data){alert("contacts select all photos success");});
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
		db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
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
		
		
		db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
	
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
		db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
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
		 //alert(sqlQuery);
 
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
		db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
		
		 db.transaction( doTrans3x,function(error){console.log(error)},function(trans,data){//alert("PPPPPcontacts doTrans2x success");
		
		});
		
		 sqlQuery="SELECT how_met FROM  AlgContacts WHERE contactId="+aa;


		
	}
	catch(e){alert("ex in selectsinglecontact "+e.message);}
}
function doTrans3x(trans){
	
	try{
	alert(sqlQuery);
		 trans.executeSql(sqlQuery,[],function(trans,data){
		
			resultset=data; 
			var len=resultset.rows.length; 
	
			if(len>0){
				alert(resultset.rows.item(0).how_met);
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
/************END DATABASE OPERATIONS***************/
/************START LIST PROCESSING FUNCTIONS*************/

/************END LIST PROCESSING FUNCTIONS*************/

/************START ACCESS CONTACT LIST*************/

/*function listAllContacts() {
	try{
		alert("in list all contacts");
		var contact = new blackberry.pim.contacts.Contact();
		alert("after creating contacts class");
    ContactFindOptions =  contact.ContactFindOptions;
	alert("in list all contacts");
	alert(contact);
	//var contact2=blackberry.pim.contacts.getContactById(1);
	//alert("contact is ");
	//alert(contact2);
	
	//alert(JSON.stringify(contacts, null, 4));
	//alert("after stringify");
	//alert(ContactFindOptions.SORT_FIELD_FAMILY_NAME);
	//alert("in list all contacts #2a");
	//alert(ContactFindOptions.SORT_FIELD_GIVEN_NAME);
	//alert("in list all contacts #2");
   /* var sort = [{
             "fieldName": ContactFindOptions.SORT_FIELD_FAMILY_NAME,
             "desc": false
        }, {
             "fieldName": ContactFindOptions.SORT_FIELD_GIVEN_NAME,
             "desc": true
        }];*/
		//alert("after sort #3");
        // no filter - return all contacts*/
	/*	findOptions = new blackberry.pim.contacts.ContactFindOptions();
		findOptions.filter = [
                        {fieldName: blackberry.pim.contacts.ContactFindOptions.SEARCH_FIELD_FAMILY_NAME, fieldValue: "Horrow"}
                ];
		findOptions.sort = [
                        {fieldName: blackberry.pim.contacts.ContactFindOptions.SORT_FIELD_GIVEN_NAME, desc: true},
                        {fieldName: blackberry.pim.contacts.ContactFindOptions.SORT_FIELD_FAMILY_NAME, desc: false}
                ];
				findOptions.limit = 5;
				alert("before calling find");	
		blackberry.pim.contacts.find(["firstName"], null, onFindSuccess, onFindError);			
        findOptions = { 
             // sort contacts first by family name (desc), then by given name (asc)
             //sort: sort,  
             limit: 20     // limit - return up to 20 contacts
        };
    // The first 20 contacts (based on specified sort specs) will be returned
	
   // contact.find(["name"], findOptions, onFindSuccess, onFindError);
	}catch(e){alert("exception"+e.message);}
}*/
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
	
	alert("in contacts find error");
	alert(error.code);
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
	contacts = blackberry.pim.contacts;

	var contact,aa,i,fname=" ",j=0;
	
	items.length=0;
	for( i=0;i<len;i++)
	{
		contactDetails["photoLink"]=staticImage;
		
		contactDetails["type"]=0;
		contactDetails["contactId"]=resultset.rows.item(i).contactId;
		
		aa=resultset.rows.item(i).contactId.toString();
		currentContact=aa;
	
		var plink2=getplink(currentContact);
		if(plink2!=null){
			if(plink2.length>5)
				contactDetails["photoLink"]=getplink(currentContact);
					
		}
		
		
		contact=contacts.getContact(aa);
	
		
		if(contact){
		
		 item = document.createElement('div');
		 item.setAttribute('data-bb-type','item');
		 fname=formatName(contact.name.givenName,contact.name.familyName);
	
		 item.setAttribute('data-bb-title',fname);
		
		 item.setAttribute('data-bb-img',contactDetails.photoLink);
		  item.setAttribute('data-id',aa);
		
		 item.innerHTML = " ";
		
		
		item.onclick = function(){showContactDetails(document.getElementById("imgList").selected)};
		 items.push(item);			
 
		}
		else {
      // alert("There is no contact with id: " + aa);
	  }//end else
		
	
	}//end for
		
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
			
			if(resultset4.rows.item(i).contactId==cid && resultset4.rows.item(i).type==0){
				plink=resultset4.rows.item(i).photolink;
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




