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
	var cid=parseInt(e.data.cid);
	 photolink=e.data.photolink;
	var ptype=e.data.type;
	var db=e.data.db;
	var resultset;
	var errorstate=false;
	aaa=new Array();

	try{
			 sqlQuery="INSERT OR REPLACE INTO AlgPhotos (contactId,photolink,type) ";
	 sqlQuery+=	"values("+ cid +" ,'"+ photolink+"',"+ptype+")";

  	db.transaction( function(trans){
	  trans.executeSql(sqlQuery,[],function(trans,data){
			
			resultset=data; //norows=1;}	
			aaa.push({"insertResult":0})
			
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
	

self.postMessage(aaa);

self.close();
},false);
