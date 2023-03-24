////////////////////////////////////////////////////////////////////game tien len mien nam V2.0///////////////////////////////////////////
	function _dem_nguoc()
	{
	   var TARG_ID = "COUNTDOWN_REDIRECT";
	   var e = document.getElementById(TARG_ID);

	   if( ! e )
	   {
		  throw new Error('"COUNTDOWN_REDIRECT" element id not found');
	   }

	   var cTicks = parseInt(e.innerHTML);

	   timer = setInterval(function()
	   {
		  if( cTicks )
		  {
			     e.innerHTML = --cTicks;
				  var val = cTicks;
				  var el = document.querySelector('#COUNTDOWN_REDIRECT');
				  
				  el.style.width = val/25 *100 + '%';
				  //el.innerText = val;
			    /*var canvas = document.getElementById("COUNTDOWN_REDIRECT");
				 
				canvas.width = innerWidth;
				canvas.height = innerHeight;
				var ctx = canvas.getContext("2d");

				var percent = cTicks;

				ctx.beginPath();
				ctx.arc(innerWidth/2, innerHeight/2, 20, 0, Math.PI * 2);
				ctx.strokeStyle = "white";
				ctx.lineWidth = 7;
				ctx.stroke();
				ctx.closePath();

				var angle = percent/20 * 360;
				ctx.beginPath();
				ctx.arc(innerWidth/2, innerHeight/2, 20, -90 * Math.PI/180, (angle - 90) * Math.PI/180);
				ctx.strokeStyle = "red";
				ctx.lineWidth = 3;
				ctx.stroke();
				ctx.closePath();

				//ctx.textBaseline = "middle";
				//ctx.textAlign = "center";
				//ctx.font = "40px arial bold";
				ctx.fillStyle = "red"
				//ctx.fillText(percent + "%", innerWidth/2, innerHeight/2);*/
		  }
		  else
		  {
			 
			 clearInterval(timer);
			 document.getElementById('btnboluot').click();
			  
		  }

	   }, 1000);
	}
	function _dem_nguoc1()
	{
	   var TARG_ID = "COUNTDOWN_REDIRECT";
	   var e = document.getElementById(TARG_ID);

	   if( ! e )
	   {
		  throw new Error('"COUNTDOWN_REDIRECT" element id not found');
	   }

	   var cTicks = parseInt(e.innerHTML);

	   timer = setInterval(function()
	   {
		  if( cTicks )
		  {
			 e.innerHTML = --cTicks;
					var val = cTicks;
				  var el = document.querySelector('#COUNTDOWN_REDIRECT');
				  
				  el.style.width = val/25 *100 + '%';
				  //el.innerText = val;
			  /*var canvas = document.getElementById("COUNTDOWN_REDIRECT");
				canvas.width = innerWidth;
				canvas.height = innerHeight;
				var ctx = canvas.getContext("2d");

				var percent = cTicks;

				ctx.beginPath();
				ctx.arc(innerWidth/2, innerHeight/2, 20, 0, Math.PI * 2);
				ctx.strokeStyle = "white";
				ctx.lineWidth = 7;
				ctx.stroke();
				ctx.closePath();

				var angle = percent/20 * 360;
				ctx.beginPath();
				ctx.arc(innerWidth/2, innerHeight/2, 20, -90 * Math.PI/180, (angle - 90) * Math.PI/180);
				ctx.strokeStyle = "red";
				ctx.lineWidth = 3;
				ctx.stroke();
				ctx.closePath();

				//ctx.textBaseline = "middle";
				//ctx.textAlign = "center";
				//ctx.font = "40px arial bold";
				ctx.fillStyle = "red"
				//ctx.fillText(percent + "%", innerWidth/2, innerHeight/2);*/
		  }
		  else
		  {
			 
			 clearInterval(timer);
			  
		  }

	   }, 1000);
	}
   function chuyenchuoi(a){
	  g=[];

	  for(var i=0;i<a.length;i++)
	  {
		g.push(parseInt(a[i].substring(4,6)));//substring cat chuoi
	  }
	  return g;
	 }
	
	function sortNumberAsc(a, b){
          return a - b;
     }
			
	function hien(mr){
			
		    var k = "";
			//var k1=100;
			var k2=0;
			var k3=0;
			a1=[];
			
			a1=mr;
			
			for(var j=0;j<=a1.length-1;j++)
			{   /////////anh len xuong
		
			    k2+=20;
				k3=100;	
				////////
				
			 k+="<img class='image' id='"+j+"' src='"+a1[j]+"'  value='"+a1[j]+"' style=' position:absolute; width: 100;  left: "+k2+"; top: "+k3+";height: 100;'></img>";
			
			}
		   //  console.log(a1);
			$("#a").html(k);
		}
	

/////////////////////////////////
	 function hien2(a){
	       var k2=500;
			var k3=0;
			
				var html="";
				var a1=[];
				a1=a;
				
				//alert(a1);
				//a1=loc_anh(img);
				
				for(var j=0;j<a1.length;j++)
				{   /////////anh len xuong
				   
					 k2+=15;
				//k3=100;	
				html+="<img src='"+a1[j]+"' value='"+a1[j]+"'  style='margin:2px -50px -50px 2px; width: 70px;height: 70px;'></img>";
				
				}
				var k=$("#listMessages").val();
			   //  console.log(a1);
			   $("#listMessages").html("");

				$("#listMessages").html(html);
				
							
			    
			    document.getElementById("listMessages").value = a1;
			}
//////////////////////////////////	 
	 function ktrasanh(data){
	 var v=[];
	  v=chuyenchuoi(data);
	  v.sort(sortNumberAsc);//sap xep mang tang dan

	  for(var i=0;i<v.length-1;i++)
	  {   
			  if(v[i]+1==v[i+1])//kiem tra ex: 1,2,3,4,5...
			  {
			   t=0;
			  }
			  else
			  {
			   t=1;
			   break;
			  }		  
	  }
	  return t;
	  
	 }
///////////////////////////////////////////////////////////	 
	 function ktradoithong(data){
	 var v=[];
	  v=chuyenchuoi(data);
	 
	  v.sort(sortNumberAsc);//sap xep mang tang dan
	//console.log(v);
	
	  for(var i=0;i<v.length-2;i+=2)
	  {   
			  if((v[i]==v[i+1])&&(v[i]+1==v[i+2]))//kiem tra ex: 1,2,3,4,5...
			  {
			   t=0;
			  }
			  else
			  {
			   t=1;
			   break;
			  }		  
	  }
	  return t;	  
	 }
////////////////////////////////////////////////////////////////	 
	function kiemtrahople(data)
	 {
		 dem=data.length;
		 var g="";
		 if(dem==1&&data!="")
		 {
			g="coc";
		
		 }
		 else if(dem==2)
		 {

			   c1 = parseInt(data[0].substring(4,6));
			   c2 = parseInt(data[1].substring(4,6));
			if(c1==c2)
			{
			g="doi";
			}
			else
			{
			g="khonghople";
			}
		 }
		 else if(dem>2)
		 {

		   if(ktrasanh(data)==0)
		   {
		  g="sanh";
		   }
		   else{
		  
				 if(dem==3)
				 {
					   c1 = parseInt(data[0].substring(4,6));
					   c2 = parseInt(data[1].substring(4,6));
					   c3 = parseInt(data[2].substring(4,6));
					if((c1==c2)&&(c2==c3))
					{
					g="xamco";
					}
					else
					{
					  g="khonghople";
					}				
				 }
				 else if(dem==4)
				 {
					   c1 = parseInt(data[0].substring(4,6));
					   c2 = parseInt(data[1].substring(4,6));
					   c3 = parseInt(data[2].substring(4,6));
					   c4 = parseInt(data[3].substring(4,6));
					if((c1==c2)&&(c1==c3)&&(c1==c4))
					{
					g="tuqui";
					}
					else
					{
					  g="khonghople";
					}	
					
				 }
				 else if(dem==6)
				 {
					 if(ktradoithong(data)==0)
					 {
					 g="3doithong";
					 }
						else
						{
						 g="khonghople";
						}	
				 }
				 else if(dem==8)
				 {
					 if(ktradoithong(data)==0)
					 {
					 g="4doithong";
					 }
					 else
					{
					  g="khonghople";
					}	
				 }
				 else if(dem==10)
				 {
					 if(ktradoithong(data)==0)
					 {
					 g="5doithong";			
					 }
					else
					{
					  g="khonghople";
					}	
				 }
				 else if(dem==12)
				 {
					 
					 if(ktradoithong(data)==0)
					 {
					 g="6doithong";
					 }
					else
					{
					  g="khonghople";
					}	
				 }
				 else
					{
					  g="khonghople";
					}	
				 
			 }
			 
			
			 
		 
		  }
		  return g;
	}
	///////////////////////////////////////////