var UI_ID;
var data = [];
var bookingSearch = firebase.database().ref('booking');
var bookingRef = firebase.database().ref('booking');
var clinicsRef = bookingRef.child("clinics");
var calendar;
	$(document).ready(function() {
		//initialize modal
		$('.modal').modal();
		//initialize select
		$('select').material_select();
		// page is now ready, initialize the calendar...
		//SETTING THE SELECT OPTION FOR SERVICES
		//SET THE DATA
		//GET THE USER CREDENTIAL
		getClinics();
		checkDataIsEmpty();

		//getFireBaseData();
		//CHECK THE DATA
		//getServices();
	 
});

function getClinics() {
	$('#clinic').html('');
	$('#services').html('');
	$('#clinic').append(
			$("<option></option>").attr("value",1).attr("id","clinic").text("Select Clinic")
		);
	var clinics = bookingRef.child('clinics');
	clinics.on('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			//console.log(childSnapshot.key);
			var value = childSnapshot.val().name;
		    $("#clinic").append(
		      $("<option></option>").attr("value",childSnapshot.key).attr("id","clinic").text(value)
		    );
		   // Update the content clearing the caret
	    	$("select").material_select('update');
	    	$("select").closest('#input-clinics').children('span.caret').remove();
		});
	});
}
function getServices() {
	//GET THE CLINIC FIRST
	//$("#services").html(' ')
	// And add a new value
	/*var services = bookingRef.child('services');
		services.on('value', function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				console.log(childSnapshot.val().name);
				var value = childSnapshot.val().name;
			    $("#services").append(
			      $("<option></option>").attr("value",value).attr("id","services").text(value)
			    );
			   // Update the content clearing the caret
		    	$("select").material_select('update');
		    	$("select").closest('#input-services').children('span.caret').remove();
			});
		});*/
}
function clear()
{
	//$('#clinic option').remove();
	$('#notes').val('');
	$('#duration_time').val('');
	$('#schedule_time').val('');
	$("#price").val('');
	$('#schedule_error').html('');
	//console.log("calling clear");
}
//function for adding in firebase
function add(price, start_value, end_value, notes, clinic, service, duration_time, schedule_time){
	//console.log(price+" "+start_value+" "+end_value+" "+notes+" "+clinic+" "+service+" "+duration_time+" "+schedule_time);
	var newBookingValue = bookingRef.child('schedule');
	newBookingValue.push().set({
		price: price,
		start_value: start_value,
		end_value: end_value,
		notes: notes,
		clinic: clinic,
		service: service,
		duration_time: duration_time,
		schedule_time: schedule_time
	});
	//var newKey = newBookingValue.push().key;
	//return newKey;
	//console.log(newBookingValue.key);
	 /*var newPostKey = firebase.database().ref().child('posts').push().key;*/
}


$('#loginForm').on('submit', function(e){
	e.preventDefault();

	/*login_username
login_password*/

	var login_username = $('#login_username').val();
	var login_password = $('#login_password').val();

	if(login_username && login_password){

		firebase.auth().signInWithEmailAndPassword(login_username, login_password).then(function(user) {
			UI_ID = user.uid;
		});
	}

	//console.log('loginForm');
});


function checkDataIsEmpty() {
	var newBookingValue = firebase.database().ref('booking');
	newBookingValue.child('schedule').on("value", function(snapshot){
		//console.log("check data");
		//console.log(snapshot.val());
		if(snapshot.val() == null) {
			//console.log("empty");
			initialFullCalendar();
		}
		else {
			//console.log("Note Empty");
			 getFireBaseData();
		}
	});
}
function initialFullCalendar() {
			var calendar = $('#calendar');
					calendar.fullCalendar({

					header : {
						left: 'today,month,agendaDay,agendaWeek prev,next',
						center : 'title',
						right : ''
					},
			       /*	header: {
			       		left: 'title',
			       		center: '',
			       		right: 'today,month,agendaDay,agendaWeek prev,next',
			       	},*/
			        selectable: true,
			        selectHelper: true,
			        editable: true,
			        eventLimit: true,
			        /*events: booking_data,*/
			        select: function(start, end, jsEvent, view){
			        	 $('#modal1').modal('open');
			        		
			        	//CHECK IF THE OPTIONS IS CHANGES FOR CLINIC
			        	$('#clinic').on('change', function(){
			        		var clinic_key = $('#clinic option:selected').attr('value');
			        		//GET THE SERVICES REREFENCE ID FOR CLINIC
			        		$('#services').html('');
			        		var services = bookingRef.child('services');
							services.on('value', function(snapshot){
								snapshot.forEach(function(childSnapshot) {
									//CHECK THE CLINIC ID
									//console.log(snapshot.numChildren())
									if(childSnapshot.val().clinic_id == clinic_key) {
										//console.log("result data name "+childSnapshot.val().price);
										//adding new select from services
										var value = childSnapshot.val().name;
									    $("#services").append(
									      $("<option></option>").attr("value",childSnapshot.val().price).attr("id","services").text(value)
									    );
									   // Update the content clearing the caret
								    	$("select").material_select('update');
								    	$("select").closest('#input-services').children('span.caret').remove();
								    	//SEETING THE PRICE NEED TO MODIFY
								    	$("#price").val(parseInt(childSnapshot.val().price))
								    	
								    	//SETTING THE ON CHANGE FOR SERVICES SELECT
								    	var length = $('#services').children('option').length;
								    	$('#services').unbind().on('change', function(){
											var services = $('#services option:selected').text();
											var price = $('#services option:selected').attr('value');									
											$("#price").val(parseInt(price))
										});

									}
									else {
										//CLEAR THE OPTION SELECT
										$("select").material_select('update');
								    	$("select").closest('#input-services').children('span.caret').remove();
										//console.log("Not Data");
									}										
								});
								//console.log(snapshot.val());
							});
			        		
			        	});
			        	 $('#delete').hide();
			        	 $('#day').text(start.format("MM/DD/YYYY"));
			        	
			        	 $('#submit').unbind().click(function(){
			        	 	var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey;
			        	 	clinic = $('#clinic option:selected').text();
			        	 	service = $('#services option:selected').text();
			        	 	duration_time = $('#duration_time').val();
			        	 	schedule_time = $('#schedule_time').val();
			        	 	//console.log(service);
			        	 	
			        	 	price = $("#price").val();
				        	moment = $('#calendar').fullCalendar('getDate');
				        	allDay = $('#allDay').val();
				        	//variable for all day
				        	//console.log(allDay);
				        	//console.log(start.format()+"T"+duration_time);
				        	var start_date = start.format()+"T"+duration_time;
				        	//START VALUE SETTING TIME
				        	//start_value = start.format("MM/DD/YYYY hh:mm");
				        	start_value = start.format("MM/DD/YYYY "+duration_time);
				        	notes = $('#notes').val();
				        	end_value = end.format("MM/DD/YYYY");
				        	//CHECK IF THB NOTES IS NULL
				        	if(notes.length == 0) {
				        		//console.log("empty");
				        	}
				        	else {
					            //ADD TO FIREBASE
					            //CHECK IF EXIST
					            //console.log(start_value);
					            //var result = checkExistBooking("12/07/2016 13:09");	
					            //var search_value = "12/10/2016 05:55";
					            //var search_schedule_time = "06:06";	
					            //var search_value = start_value;
					            //var search_schedule_time = schedule_time;			           
					          
					            var result = checkExistBooking(start_value, schedule_time);
					            if(result) {
					            	//alert("Data Already Exist");
					            	$('#schedule_error').text("No Vacant between"+start_value+" and "+duration_time);
					            }
					            else {
							            var newEvent = {
							                //start: '2016-11-22T12:30:00',
							                start: start_value,
							                end: end_value,
							                allDay: false,
							                title: notes,
							                clinic: clinic,
							                service: service,
							                duration_time: duration_time,
							                schedule_time: schedule_time,
							                price: price,
							                //id: currentKey
							            };
						            $('#calendar').fullCalendar('renderEvent', newEvent,true);
					            	add(price, start_value, end_value, notes, clinic, service, duration_time, schedule_time);
					            	clear();
					            	$('.modal').modal('close');
					            }					           					        
				        	}
			        	 });

						$('#btn_cancel').on('click', function(){
							$('.modal').modal('close');
							clear();
						});
			        },
			        editable: true,
			        //function for dragging and dropping
			        eventDrop : function(event, delta, revertFunc) {				
			        	if (!confirm("Are you sure about this change?")) {
			        		revertFunc();
				        }
				        else {
				        	//console.log(event.id);
				        	//console.log(event.title+" "+event.start.format()+" "+event.end.format(), event.clinic +" "+event.service, event.duration_time);
				        	//calling the function revertChanges to update the position
				        	var result = checkExistBooking(event.start.format("MM/DD/YYYY "+event.duration_time),event.schedule_time);
				        	if(result) {
				        		alert("No Vacant between"+event.start.format("MM/DD/YYYY "+event.duration_time)+" and "+event.schedule_time);
				        		/*$('#schedule_error').text("No Vacant between");*/
				        		//THIS FUNCTION WILL RETURN THE POSITION
				        		revertFunc();
				        	}
				        	else {
				        		//alert("You Add");
				        		revertChanges(event.id, event.title, event.start.format("MM/DD/YYYY "+event.duration_time), event.end.format(), event.clinic, event.service, event.duration_time, event.schedule_time, event.price, "");
				        	}
				        }
			        },
			        //update or remove
			        eventClick: function(event, jsEvent, view, revertFunc) {				   
			        	/*console.log(event._id);*/
			        	//console.log(event.title +" "+ event.clinic+" "+event.service);
			        	$('#modal1').modal('open');
			        	//SET THE TAG IN MODAL
			        	$('#delete').show();
			        	$('#notes').val(event.title);
						$('#duration_time').val(event.duration_time);
						$('#schedule_time').val(event.schedule_time);
						$("#price").val(event.price);
						//* START FUNCTION FOR SELECT *//
						//CHECK IF THE OPTIONS IS CHANGES FOR CLINIC
			        	$('#clinic').on('change', function(){
			        		var clinic_key = $('#clinic option:selected').attr('value');
			        		//GET THE SERVICES REREFENCE ID FOR CLINIC
			        		$('#services').html('');
			        		var services = bookingRef.child('services');
							services.on('value', function(snapshot){
								snapshot.forEach(function(childSnapshot) {
									//CHECK THE CLINIC ID
									//console.log(snapshot.numChildren())
									if(childSnapshot.val().clinic_id == clinic_key) {
										//console.log("result data name "+childSnapshot.val().price);
										//alert("Equal me");
										
										//adding new select from services
										var value = childSnapshot.val().name;
									    $("#services").append(
									      $("<option></option>").attr("value",childSnapshot.val().price).attr("id","services").text(value)
									    );
									   // Update the content clearing the caret
								    	$("select").material_select('update');
								    	$("select").closest('#input-services').children('span.caret').remove();
								    	//SEETING THE PRICE
								    	$("#price").val(parseInt(childSnapshot.val().price))
								    	//SETTING THE ON CHANGE FOR SERVICES SELECT
								    	var length = $('#services').children('option').length;
								    	$('#services').unbind().on('change', function(){
											var services = $('#services option:selected').text();
											var price = $('#services option:selected').attr('value');									
											$("#price").val(parseInt(price))
										});

									}
									else {
										//CLEAR THE OPTION SELECT
										$("select").material_select('update');
								    	$("select").closest('#input-services').children('span.caret').remove();
										//console.log("Not Data");
									}										
								});
								//console.log(snapshot.val());
							});
			        		
			        	});
						//* END FOR FUNCTION SELECT*//
						//NEED TO MODIFY
						//$('#clinic option:selected').text(2);
			        	//$('#services option:selected').text(2);
			        	//GETTING THE VALUE AND THE SUBMIT BUTTON FOR UPDATE
			        	$('#submit').unbind().click(function(){
			        		var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey, original_title;
			        		original_title = event.title;
			        		clinic = $('#clinic option:selected').text();
			        	 	service = $('#services option:selected').text();
			        	 	duration_time = $('#duration_time').val();
			        	 	schedule_time = $('#schedule_time').val();
			        	 	price = $("#price").val();
				        	allDay = $('#allDay').val();
				        	start_value = event.start.format("MM/DD/YYYY "+duration_time);
				        	notes = $('#notes').val();
				        	end_value = event.end.format("MM/DD/YYYY");
				        	//console.log(clinic+" "+service+" "+duration_time+" "+schedule_time+" "+price+" "+allDay+" "+start_value+" "+notes+" "+end_value);
				        	//UPDATE FULLCALENDAR DELETE FIRST THEN UPDATE
				        	$('#calendar').fullCalendar('removeEvents', event._id);
				        	//SETTING THE DATA FOR FULLCALENDAR
				        	var newEvent = {
					                //start: '2016-11-22T12:30:00',
					                start: start_value,
					                end: end_value,
					                allDay: false,
					                title: notes,
					                clinic: clinic,
					                service: service,
					                duration_time: duration_time,
					                schedule_time: schedule_time,
					                price: price,
					                //id: currentKey
					            };
				        	$('#calendar').fullCalendar('renderEvent', newEvent,true);
				        	//UPDATE FIREBASE DATABASE
				        	revertChanges("", notes, start_value, end_value, clinic, service, duration_time, schedule_time, price, original_title);
				        	clear();
				        	$('#modal1').modal('close');

			        	});
						//CANCEL FUNCTION
						$('#btn_cancel').on('click', function(){
							$('#modal1').modal('close');
							clear();
						});
		        	 	
			        	//DELETE FUNCTION
			        	$('#delete').unbind().click(function() {
			        		//$('#calendar').fullCalendar('removeEvents', event._id);
			        		//clear();
			        		//CONFIRM FOR DELETING
			        		if (!confirm("Are you sure about this change?")) {
				        			//revertFunc();
					        }
					        else {					    
					        	$('#calendar').fullCalendar('removeEvents', event._id);
					        	removeData(event.id, event.title);
				        		clear();
				        		$('#modal1').modal('close');
					        }
			        	});
			        }
			    });
}
function getFireBaseData() {
	//var bookingRef = firebase.database().ref('booking');
	bookingRef.child('schedule').once('value', settingData);
}

function settingData(snapshot) {
	var childSize = snapshot.numChildren();
		var booking_data = [];
		snapshot.forEach(function(childSnapshot){
			//console.log(childSnapshot.val().start_value+"T"+childSnapshot.val().duration_time);
			//var start_date = childSnapshot.val().start_value+"T"+childSnapshot.val().duration_time
				booking_data.push({
			        title: childSnapshot.val().notes,
			        start: childSnapshot.val().start_value,
			        end: childSnapshot.val().end_value,
			        clinic: childSnapshot.val().clinic,
	                service: childSnapshot.val().service,
	                duration_time: childSnapshot.val().duration_time,
	                schedule_time: childSnapshot.val().schedule_time,
	                price: childSnapshot.val().price,
	                id: childSnapshot.key
			    });
				
				if(booking_data.length == childSize) {
					//setting the data from firebase
					var calendar = $('#calendar');
					calendar.fullCalendar({
			       	header: {
			       		left: 'title',
			       		center: '',
			       		right: 'today,month,agendaDay,agendaWeek prev,next',
			       	},
			        selectable: true,
			        selectHelper: true,
			        editable: true,
			        eventLimit: true,
			        events: booking_data,
			        select: function(start, end, jsEvent, view){

			        	if(UI_ID){
			       			$('#modal1').modal('open');
			        		
				        	//CHECK IF THE OPTIONS IS CHANGES FOR CLINIC
				        	$('#clinic').on('change', function(){
				        		var clinic_key = $('#clinic option:selected').attr('value');
				        		//GET THE SERVICES REREFENCE ID FOR CLINIC
				        		$('#services').html('');
				        		var services = bookingRef.child('services');
								services.on('value', function(snapshot){
									snapshot.forEach(function(childSnapshot) {
										//CHECK THE CLINIC ID
										//console.log(snapshot.numChildren())
										if(childSnapshot.val().clinic_id == clinic_key) {
											//console.log("result data name "+childSnapshot.val().price);
											//adding new select from services
											var value = childSnapshot.val().name;
										    $("#services").append(
										      $("<option></option>").attr("value",childSnapshot.val().price).attr("id","services").text(value)
										    );
										   // Update the content clearing the caret
									    	$("select").material_select('update');
									    	$("select").closest('#input-services').children('span.caret').remove();
									    	//SEETING THE PRICE NEED TO MODIFY
									    	$("#price").val(parseInt(childSnapshot.val().price))
									    	
									    	//SETTING THE ON CHANGE FOR SERVICES SELECT
									    	var length = $('#services').children('option').length;
									    	$('#services').unbind().on('change', function(){
												var services = $('#services option:selected').text();
												var price = $('#services option:selected').attr('value');									
												$("#price").val(parseInt(price))
											});

										}
										else {
											//CLEAR THE OPTION SELECT
											$("select").material_select('update');
									    	$("select").closest('#input-services').children('span.caret').remove();
											//console.log("Not Data");
										}										
									});
									//console.log(snapshot.val());
								});
				        		
				        	});
				        	 $('#delete').hide();
				        	 $('#day').text(start.format("MM/DD/YYYY"));
				        	
				        	 $('#submit').unbind().click(function(){
				        	 	var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey;
				        	 	clinic = $('#clinic option:selected').text();
				        	 	service = $('#services option:selected').text();
				        	 	duration_time = $('#duration_time').val();
				        	 	schedule_time = $('#schedule_time').val();
				        	 	//console.log(service);
				        	 	
				        	 	price = $("#price").val();
					        	moment = $('#calendar').fullCalendar('getDate');
					        	allDay = $('#allDay').val();
					        	//variable for all day
					        	//console.log(allDay);
					        	//console.log(start.format()+"T"+duration_time);
					        	var start_date = start.format()+"T"+duration_time;
					        	//START VALUE SETTING TIME
					        	//start_value = start.format("MM/DD/YYYY hh:mm");
					        	start_value = start.format("MM/DD/YYYY "+duration_time);
					        	notes = $('#notes').val();
					        	end_value = end.format("MM/DD/YYYY");
					        	//CHECK IF THB NOTES IS NULL
					        	if(notes.length == 0) {
					        		//console.log("empty");
					        	}
					        	else {
						            //ADD TO FIREBASE
						            //CHECK IF EXIST
						            //console.log(start_value);
						            //var result = checkExistBooking("12/07/2016 13:09");	
						            //var search_value = "12/10/2016 05:55";
						            //var search_schedule_time = "06:06";	
						            //var search_value = start_value;
						            //var search_schedule_time = schedule_time;			           
						          
						            var result = checkExistBooking(start_value, schedule_time);
						            if(result) {
						            	//alert("Data Already Exist");
						            	$('#schedule_error').text("No Vacant between"+start_value+" and "+duration_time);
						            }
						            else {
								            var newEvent = {
								                //start: '2016-11-22T12:30:00',
								                start: start_value,
								                end: end_value,
								                allDay: false,
								                title: notes,
								                clinic: clinic,
								                service: service,
								                duration_time: duration_time,
								                schedule_time: schedule_time,
								                price: price,
								                //id: currentKey
								            };
							            $('#calendar').fullCalendar('renderEvent', newEvent,true);
						            	add(price, start_value, end_value, notes, clinic, service, duration_time, schedule_time);
						            	clear();
						            	$('#modal1').modal('close');
						            }					           					        
					        	}
				        	 });

							$('#btn_cancel').on('click', function(){
								$('#modal1').modal('close');
								clear();
							});

			        	}else{
			        		$('#loginUser').modal('open');
			        	}
			        },
			        editable: true,
			        //function for dragging and dropping
			        eventDrop : function(event, delta, revertFunc) {				
			        	if (!confirm("Are you sure about this change?")) {
			        		revertFunc();
				        }
				        else {
				        	//console.log(event.id);
				        	//console.log(event.title+" "+event.start.format()+" "+event.end.format(), event.clinic +" "+event.service, event.duration_time);
				        	//calling the function revertChanges to update the position
				        	var result = checkExistBooking(event.start.format("MM/DD/YYYY "+event.duration_time),event.schedule_time);
				        	if(result) {
				        		alert("No Vacant between"+event.start.format("MM/DD/YYYY "+event.duration_time)+" and "+event.schedule_time);
				        		/*$('#schedule_error').text("No Vacant between");*/
				        		//THIS FUNCTION WILL RETURN THE POSITION
				        		revertFunc();
				        	}
				        	else {
				        		//alert("You Add");
				        		revertChanges(event.id, event.title, event.start.format("MM/DD/YYYY "+event.duration_time), event.end.format(), event.clinic, event.service, event.duration_time, event.schedule_time, event.price, "");
				        	}
				        }
			        },
			        //update or remove
			        eventClick: function(event, jsEvent, view, revertFunc) {				   
			        	/*console.log(event._id);*/
			        	//console.log(event.title +" "+ event.clinic+" "+event.service);
			        	$('#modal1').modal('open');
			        	//SET THE TAG IN MODAL
			        	$('#delete').show();
			        	$('#notes').val(event.title);
						$('#duration_time').val(event.duration_time);
						$('#schedule_time').val(event.schedule_time);
						$("#price").val(event.price);
						//* START FUNCTION FOR SELECT *//
						//CHECK IF THE OPTIONS IS CHANGES FOR CLINIC
			        	$('#clinic').on('change', function(){
			        		var clinic_key = $('#clinic option:selected').attr('value');
			        		//GET THE SERVICES REREFENCE ID FOR CLINIC
			        		$('#services').html('');
			        		var services = bookingRef.child('services');
							services.on('value', function(snapshot){
								snapshot.forEach(function(childSnapshot) {
									//CHECK THE CLINIC ID
									//console.log(snapshot.numChildren())
									if(childSnapshot.val().clinic_id == clinic_key) {
										//console.log("result data name "+childSnapshot.val().price);
										//alert("Equal me");
										
										//adding new select from services
										var value = childSnapshot.val().name;
									    $("#services").append(
									      $("<option></option>").attr("value",childSnapshot.val().price).attr("id","services").text(value)
									    );
									   // Update the content clearing the caret
								    	$("select").material_select('update');
								    	$("select").closest('#input-services').children('span.caret').remove();
								    	//SEETING THE PRICE
								    	$("#price").val(parseInt(childSnapshot.val().price))
								    	//SETTING THE ON CHANGE FOR SERVICES SELECT
								    	var length = $('#services').children('option').length;
								    	$('#services').unbind().on('change', function(){
											var services = $('#services option:selected').text();
											var price = $('#services option:selected').attr('value');									
											$("#price").val(parseInt(price))
										});

									}
									else {
										//CLEAR THE OPTION SELECT
										$("select").material_select('update');
								    	$("select").closest('#input-services').children('span.caret').remove();
										//console.log("Not Data");
									}										
								});
								//console.log(snapshot.val());
							});
			        		
			        	});
						//* END FOR FUNCTION SELECT*//
						//NEED TO MODIFY
						//$('#clinic option:selected').text(2);
			        	//$('#services option:selected').text(2);
			        	//GETTING THE VALUE AND THE SUBMIT BUTTON FOR UPDATE
			        	$('#submit').unbind().click(function(){
			        		var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey, original_title;
			        		original_title = event.title;
			        		clinic = $('#clinic option:selected').text();
			        	 	service = $('#services option:selected').text();
			        	 	duration_time = $('#duration_time').val();
			        	 	schedule_time = $('#schedule_time').val();
			        	 	price = $("#price").val();
				        	allDay = $('#allDay').val();
				        	start_value = event.start.format("MM/DD/YYYY "+duration_time);
				        	notes = $('#notes').val();
				        	end_value = event.end.format("MM/DD/YYYY");
				        	//console.log(clinic+" "+service+" "+duration_time+" "+schedule_time+" "+price+" "+allDay+" "+start_value+" "+notes+" "+end_value);
				        	//UPDATE FULLCALENDAR DELETE FIRST THEN UPDATE
				        	$('#calendar').fullCalendar('removeEvents', event._id);
				        	//SETTING THE DATA FOR FULLCALENDAR
				        	var newEvent = {
					                //start: '2016-11-22T12:30:00',
					                start: start_value,
					                end: end_value,
					                allDay: false,
					                title: notes,
					                clinic: clinic,
					                service: service,
					                duration_time: duration_time,
					                schedule_time: schedule_time,
					                price: price,
					                //id: currentKey
					            };
				        	$('#calendar').fullCalendar('renderEvent', newEvent,true);
				        	//UPDATE FIREBASE DATABASE
				        	revertChanges("", notes, start_value, end_value, clinic, service, duration_time, schedule_time, price, original_title);
				        	clear();
				        	$('.modal').modal('close');

			        	});
						//CANCEL FUNCTION
						$('#btn_cancel').on('click', function(){
							$('.modal').modal('close');
							clear();
						});
		        	 	
			        	//DELETE FUNCTION
			        	$('#delete').unbind().click(function() {
			        		//$('#calendar').fullCalendar('removeEvents', event._id);
			        		//clear();
			        		//CONFIRM FOR DELETING
			        		if (!confirm("Are you sure about this change?")) {
				        			//revertFunc();
					        }
					        else {					    
					        	$('#calendar').fullCalendar('removeEvents', event._id);
					        	removeData(event.id, event.title);
				        		clear();
				        		$('.modal').modal('close');
					        }
			        	});
			        }
			    });
				}
		});
}
function callBack(data) {
	//console.log(data);
	alert("data"+data);
}
//function to update in firebase
function revertChanges(id, title, start, end, clinic, service, duration_time, schedule_time, price, original_title) {
	
	//initial data function
	if(original_title == "") {
		//console.log("original_title IS NULL");
		var bookingRef = firebase.database().ref('booking').child('schedule');
		bookingRef.orderByChild("notes").equalTo(title).on('child_added', function(snapshot){
			var data = {
				price: price,
				start_value: start,
				end_value: end,
				notes: title,
				clinic: clinic,
				service: service,
				duration_time: duration_time,
				schedule_time: schedule_time
			};
			//update firebase
			var bookingUpdateRef = firebase.database().ref('booking').child('schedule').child(snapshot.key);
			bookingUpdateRef.update(data);
		});
	}
	else {
		//console.log("original_title IS NOT NULL");
		var bookingRef = firebase.database().ref('booking').child('schedule');
		bookingRef.orderByChild("notes").equalTo(original_title).on('child_added', function(snapshot){
			var data = {
				price: price,
				start_value: start,
				end_value: end,
				notes: title,
				clinic: clinic,
				service: service,
				duration_time: duration_time,
				schedule_time: schedule_time
			};
			//update firebase
			var bookingUpdateRef = firebase.database().ref('booking').child('schedule').child(snapshot.key);
			bookingUpdateRef.update(data);
		});
	}
}
//function for remove
//need changes 
//need to modify for checking the dublicate
function removeData(id, title) {
	//INITIAL DATA FUNCTION
	if(id == null || id == "") {
		console.log("FUNCTION FOR SEARCH");
		console.log(title);
		//INITIAL DATA FUNCTION
		var bookingSearch = firebase.database().ref('booking').child('schedule');
		bookingSearch.orderByChild("notes").equalTo(title).on('child_added', function(snapshot){
			console.log(snapshot.val());
			var removeBooking = bookingSearch.child(snapshot.key);
			removeBooking.remove(function(error){
				if(!error) {
					console.log("successfully Deleted!..");
				}
				else {
					console.log("Error removing.. "+error);
				}
			});
		});
	}
	else {
		console.log("delete");
		console.log(id+" "+title);
		var bookingUpdateRef = firebase.database().ref('booking').child('schedule').child(id);
		bookingUpdateRef.remove(function(error) {
			if(!error) {
				console.log("successfully remove");
			}
			else {
				console.log("error removing"+error);
			}
		});
	}
}
//FUNCTION FOR SEARCH AND CHECKING FOR DUBLICATE
function checkExistBooking(search_value, search_schedule_time)
{
	//THIS FUNCTION WHERE CHECK FIRE CHILD ONLY START_VALUE NO SEARCH SCHEDULE TIME INCLUDED
	var result;
	bookingSearch.child('schedule').orderByChild("start_value").startAt(search_value).endAt(search_value).once('value', function(snapshot){
		if(snapshot.val() == null) {
			result = false;
		}
		else {
			//COMMENT THE SEARCH FOR SCHECDULE TIME
			/*var data = snapshot.val();
			snapshot.forEach(function(childSnapshot) {
				console.log("Title "+childSnapshot.val().notes);
				if(childSnapshot.val().schedule_time == search_schedule_time) {
					console.log("found child"+childSnapshot.val().schedule_time);
					result = true;
				}
				else {
					console.log("Not found child"+childSnapshot.val().schedule_time);
					result = false;
				}
			});*/
			/*console.log(data);
			result = true;*/
			result = true;
		}
	},
	function(errorObject){
		console.log(errorObject.code);
	});
	///console.log(result);
	return result;
}
