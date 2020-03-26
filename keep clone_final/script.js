  var position = "";  // to get the location of node in tree
	var db = firebase.database(); // global firebase instance
    function pushData()
    {
	    var today = new Date();
		if(today.getMonth()+1<10)
	      	var mm="0"+(today.getMonth()+1);
	    else
	        var mm = today.getMonth()+1
	      		
	    if(today.getDate()<10)
	    	var dd="0"+(today.getDate());
	    else
	    	var dd=today.getDate();

		var date = dd+' - '+mm+' - '+today.getFullYear();
		//Above is to set date and time as node location


	    var ref = db.ref(date+" "+today.getTime());
    	var data = {
		    		note:  document.getElementById('area').value,
		    		title: document.getElementById('title').value,
		    		date:   date+" "+today.getTime()  // make easy to retrive data from firebase
    			}

    	if(document.getElementById('area').value.localeCompare("")!=0 && document.getElementById('title').value!="")
    		{
    			ref.push(data);
	    		document.getElementById('area').value = '';
				document.getElementById('title').value = ''; 
			}

    	else{
    		alert("Write some Notes. And Title ")	
    	}
		
    }

function displayTextarea(){
	document.getElementById('area').style.display = 'block';
	document.getElementById('title').placeholder = "Title";
	document.getElementsByClassName('box2')[0].style.height = '200px';
}


function getData(){

	var ref=db.ref("/"); //acess root of tree or start from root
    ref.on('value',gotData,errData);

}

function gotData(data)
{
	var data = data.val(); // second level as object
  	var keys = Object.keys(data); //get second level tree nodes as array

	for(var i = 0;i < keys.length;i++){
	getinnerData(keys[i].toString()); // for each second level node
	}
	     		 			
}

function errData(e){
	
}

function getinnerData(date){

		if(date){
			var ref = db.ref(date); // go to third level 
      		ref.on('value',retriving,error);
		}
		
}

var iDiv;

function retriving(data){
	

		var data = data.val(); // get the final key values 
		var keys = Object.keys(data); //get data in array formate
	
	
			try {   //remove all previous data.
					for(var j=0;j<keys.length;j++)
					{
						var k = keys[j];
						var date = data[k].date;
						document.getElementById('wrapper').removeChild(document.getElementById('newDiv'+j.toString()+date.toString()));
						
					}

				} 
		catch(e){}
		

	for(var i = 0;i<keys.length;i++)
	{
		var k = keys[i];
		var title = data[k].title;
		var note = data[k].note;
		var date = data[k].date;
		
		// dynamically creating  model content 
		iDiv = document.createElement('div');
		iDiv.id = 'newDiv'+i.toString()+date.toString();
		iDiv.className = 'box3';
		document.getElementById('wrapper').appendChild(iDiv);

		var head = document.createElement('h1')
		head.textContent = title;
		head.className = 'newHead';

		var para = document.createElement('textarea')
		para.textContent = note;
		para.className = 'newPara';
		para.id = 'comment';

		var parad = document.createElement('p')
		parad.textContent = date;
		parad.className = 'newParad';

		var index = document.createElement('p');
		index.textContent = date.substring(0,14);
		index.className = 'indexDate';

		var image = document.createElement('img');
		image.src = "edit.jpg";
		image.className = 'editImage';
		
		
		document.getElementById('newDiv'+i.toString()+date.toString()).appendChild(head);
		document.getElementById('newDiv'+i.toString()+date.toString()).appendChild(para);
		document.getElementById('newDiv'+i.toString()+date.toString()).appendChild(parad);
		document.getElementById('newDiv'+i.toString()+date.toString()).appendChild(index);
		document.getElementById('newDiv'+i.toString()+date.toString()).appendChild(image);

		para.disabled="true"; // disabling content to change manully
		para.style.backgroundColor = '#fff';
		document.getElementById('lod').style.display = 'none';
	}

	disp();
}
function error(){
	console.log("got Error");
}



function disp(){
	document.querySelectorAll('.box3').forEach(item => {
 	item.addEventListener('click', event => {
    document.getElementById('model-head').textContent = item.childNodes[0].textContent;
    document.getElementById('model-text').textContent = item.childNodes[1].textContent;
    document.getElementById('model-date').textContent = item.childNodes[2].textContent;
    document.getElementById('myBtn').click();
    position = item.childNodes[2].textContent;// to get node location in firebase
    console.log( document.getElementById('model-text').textContent)
  })
})

}

function updateData(){
	document.body.style.overflow = 'auto';
	var ref = db.ref(position); //it give second level acess
	ref.on('value',haveData);
}

function haveData(data)
{	
	var data = data.val();
	var keys = Object.keys(data);
	//console.log(keys); //get thrid level acess
	
	var object = {
		note: document.getElementById('model-text').value,
		title: document.getElementById('model-head').value,
		date:  document.getElementById('model-date').textContent 
	} //making object to upload

		//var x = JSON.parse(JSON.stringify(object));
		console.log("Updated")
		var str = position.toString()+"/"+keys[0].toString();
	 	db.ref(str).set(object)
	 	document.getElementById("myModal").style.display = "none";


	
	 		window.location = window.location;
	 	
	 	 


}



//to delete nodes

function deleteNode()
{		document.body.style.overflow = 'auto';
		var adaRef = db.ref("/"+position);
		adaRef.remove()
 		 .then(function() {
   			 console.log("Remove succeeded.")
   			  console.log("Deleted")
   			    $(".box3").first().remove();
   			    document.getElementById("myModal").style.display = "none";
  			})
 		 .catch(function(error) {
   		 console.log("Remove failed: " + error.message)
  		});
		
}



