/*Javascript executed by worker1 thread */
/*
*this thread selects a random number from a given set
* and the associated physical image to show for the onclick
* action. The RN is associated with a physical image file in the main
* thread
*/

var attractions=new Array("1","2","3","4");

self.addEventListener('message',function(e){
},false);
var ii=0,aaa,aa,rnum;
//aaa=new Array();

//loop to randomly select images and populate array of JSON
/*for (ii=0;ii<9;ii++){
 rnum=Math.floor(Math.random()*12+1);
 aa=null;
//send serialized JSON back
switch(rnum.toString()){
	case "1":
	aa="remicRapids";
	break;
	case "2":
	aa="remicRapids";
	break;
	case "3":
	aa="remicRapids"
	break;
	case "4":
	aa="remicRapids";
	break;
	case "5":
	aa="farmhouse";
	break;
	case "6":
	aa="moodieTrails"
	break;
	case "7":
	aa="farmhouse";
	break;
	case "8":
	aa="farmhouse";
	break;
	case "9":
	aa="farmhouse"
	break;
	case "10":
	aa="farmhouse";
	break;
	case "11":
	aa="moodieTrails";
	break;
	case "12":
	aa="moodieTrails"
	break;
	case "13":
	aa="moodieTrails";
	break;
	
	
}
//if(ii=0){
	//aaa[ii]=JSON.stringify({"img":rnum,"llink":aa});}
//else{
	//aaa.push({"img":rnum,"llink":aa});//}
}*/
//var qq=JSON.stringfy(aaa);
self.postMessage("hello");

self.close();

