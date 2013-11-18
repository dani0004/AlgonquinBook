/*Javascript executed by worker1 thread */
/*
*this thread accesses algphotos table and 
* selects teh profile photo for a given contact Id
	errors are posted back to the main thread
*/
//parameters that have to come in are: contact as a serialized object, 


var aaa=new Array();
self.addEventListener('message',function(e){
	var contact;
	contact=e.data.contact;

	if(contact!=null){
	
		aaa.push({"fname":contact.name.givenName,"lname":contact.name.familyName,
					"mphone":contact.phoneNumbers[0].value,
					"hphone":contact.phoneNumbers[1].value,
					"wemail":contact.emails[0].value,
					"hemail":contact.emails[1].value,
					});
	}
	
	
		self.postMessage(aaa);
		self.close();

},false);


