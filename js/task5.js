/*Javascript executed by worker1 thread */
/*
*this thread accesses algphotos table and 
* selects teh profile photo for a given contact Id
	errors are posted back to the main thread
*/
//parameters that have to come in are: contact as a serialized object, 


var aaa=new Array();
self.addEventListener('message',function(e){
	var result;
	var cid=e.data.contactId;
	result=eval([e.data.result]);
	//var cid=e.data.contactId;
	var plink;

	if (result!=null){
		
		for(var i=0;i<result.rows.length;i++){
			
			if(result.rows.item(i).contactId==cid && result.rows.item(i).type==0){
				plink=result.rows.item(i).photolink;
				break;
			}
		}
	}
	
		aaa.push({"plink":plink});
	
	
		self.postMessage(aaa);
		self.close();

},false);


