/*Javascript executed by worker1 thread */
/*
*this thread accesses algphotos table and 
* selects teh profile photo for a given contact Id
	errors are posted back to the main thread
*/
//parameters that have to come in are: contact id as int, 
var db;
var photolink;
var aaa;
var sqlQuery;
self.addEventListener('message',function(e){
	var cid=e.data;
	var resultset;
	var errorstate=false;

aaa=new Array();
//alert("start select current photo");
	try{
		sqlQuery="SELECT photolink from AlgPhotos WHERE (contactId="+cid +" AND  type=0)";
		
		
		
	db = window.openDatabase("algcontacts", "1.0", "contacts", 655367);
		
  	db.transaction( function(trans){
	  trans.executeSql(sqlQuery,[],function(trans,data){
			
			resultset=data; //norows=1;}	
			var len=resultset.rows.length; //var i=0;
		
			if(len>0) 
			 photolink=resultset.rows.item(0).photolink;
			
		},
		function(error){
			alert("error in select all "+error);
			alert(error.message);
			aaa.push({"error":error.message});
			errorstate=true;
			});
	  
	  
	  },
  
  function(trans,data){});

	}
	catch(e){ 
		aaa.push({"error":e.message});
		errorstate=true;
	}
	if(!errorstate)
		aaa.push({"link":photolink});

self.postMessage(aaa);

self.close();
},false);
