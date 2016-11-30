var UI_ID;
var data = [];
var bookingSearch = firebase.database().ref('booking');
var bookingRef = firebase.database().ref('booking');
var clinicsRef = bookingRef.child("clinics");
var servicesRef = bookingRef.child("services");
var usersRef = bookingRef.child('users');
var calendar;

var loginButton = false;

var lastSelectedStart = null;
var lastSelectedEnd = null;

firebase.auth().onAuthStateChanged(function(user) {
	
	  if (user) {
		UI_ID = user.uid;
	  }else{
	  	UI_ID = null;
	  }
	});

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
		//initialFullCalendar();
		checkDataIsEmpty();

		//getFireBaseData();
		//CHECK THE DATA
		//getServices();
	 
});

$('#login').on('click', function(){
	loginButton = true;
})

function getClinics() {
	$('#clinic').html('');
	$('#services').html('');
	$('#clinic').append(
			$("<option></option>").attr("value",1).attr("id","clinic").text("Select Clinic")
		);
	var clinics = bookingRef.child('clinics');
	clinics.on('value', function(snapshot) {
		//console.log(snapshot.val());
		snapshot.forEach(function(childSnapshot) {
			//console.log(childSnapshot.key);
			var value = childSnapshot.val().name;
			//console.log(value);
		    $("#clinic").append(
		      $("<option></option>").attr("value",childSnapshot.key).attr("id","clinic").text(value)
		    );
		   // Update the content clearing the caret
	    	$("select").material_select('update');
	    	$("select").closest('#input-clinics').children('span.caret').remove();
		});
	}, function(err){
		console.log(err);
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

$('#createUser').on('submit', function(e){
			e.preventDefault();
			var fullname = $('#create_fullname').val();
			var email_address = $('#create_email').val();
			var password = $('#create_password').val();
			var contact_no = $('#create_contact_no').val();
			var address = $('#create_address').val();
			var confirm_password = $('#create_confirm_password').val();
			if(fullname && email_address && password && password == confirm_password){

				var preloader = $(this).find('[type="submit"]').find('.preloader-wrapper');

				removeError(this);


				preloader.addClass('active');

				firebase.auth().createUserWithEmailAndPassword(email_address, password).then(function(error) {

				
				var user = firebase.auth().currentUser;
					user.updateProfile({
						  displayName: fullname
						}).then(function() {

							var userRef = usersRef.child(user.uid);
							userRef.set({
								contact_no : contact_no,
								address : address,
								role : "patient"
							});

							UI_ID = user.uid;

							$('#user_signout').text(user.displayName);
							$('#login').hide();

						 	$('#loginUser').modal('close');
							preloader.removeClass('active');

							if(loginButton == false){
								//console.log('select this please');
								calendar.fullCalendar('select', lastSelectedStart, lastSelectedEnd);
							}

						}, function(error) {
						  console.log(error);
						});
				}).catch(function(error){
						if(error){
							addError($('#createUser'), error.message);
						}

						preloader.removeClass('active');
					});

			}else if(password != confirm_password){
				addError($('#createUser'), 'Password does not match the confirm password.');
			}else{
				addError($('#createUser'), 'Please input the required fields.');
			}


			});


$('#loginForm').on('submit', function(e){
	e.preventDefault();

	var login_username = $('#login_username').val();
	var login_password = $('#login_password').val();

	if(login_username && login_password){

		var preloader = $(this).find('[type="submit"]').find('.preloader-wrapper');

		removeError(this);

		preloader.addClass('active');

		firebase.auth().signInWithEmailAndPassword(login_username, login_password).then(function(user) {
			UI_ID = user.uid;

			$('#loginUser').modal('close');
			preloader.removeClass('active');

			if(loginButton == false){
				//console.log('select this please');
				calendar.fullCalendar('select', lastSelectedStart, lastSelectedEnd);
			}


		}).catch(function(error){
			if(error){
				addError($('#loginForm'), error.message);
			}

			preloader.removeClass('active');
		});
	}else{
		addError($('#loginForm'), 'Username/Password required.');
	}

	//console.log('loginForm');
});


function addError(form, message){
	console.log(message);
	$(form).find('.error_display').addClass('active');
	console.log($(form).find('.error_display'));
	$(form).find('.error_display span').text(message);
}

function removeError(form){
	$(form).find('.error_display').removeClass('active');
	$(form).find('.error_display span').text('');
}


function checkDataIsEmpty() {
    var newBookingValue = firebase.database().ref('booking');

    var theRef = newBookingValue.child('schedule');

    if(typeof filter_clinic !== 'undefined'){
        theRef = newBookingValue.child('schedule').orderByChild('clinic').equalTo(search_clinic);
    }
    theRef.on("value", function(snapshot){
        //console.log("check data");
        console.log(snapshot.val());
        if(snapshot.val() == null) {
            console.log("empty");
            initialFullCalendar();
        }
        else {
            //console.log("Note Empty");
             getFireBaseData();
        }
    }, function(err){
        initialFullCalendar();
        console.log(err);
    });

    console.log(newBookingValue.child('schedule'));
}
function initialFullCalendar() {

			calendar = $('#calendar');
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
			        //events: booking_data,
			        select: function(start, end, jsEvent, view){

			        	lastSelectedStart = start;
						lastSelectedEnd = end;

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
										      $("<option></option>").attr("value",childSnapshot.val().price).attr("service_id", childSnapshot.key).attr("id","services").text(value)
										    );
										   // Update the content clearing the caret
									    	$("select").material_select('update');
									    	$("select").closest('#input-services').children('span.caret').remove();
									    	//SEETING THE PRICE NEED TO MODIFY
									    	//NEED TO ADD THE FIRST CHILD
									    	$("#price").val(parseInt(childSnapshot.val().price));
									    	$('#duration_time').val(childSnapshot.val().time);	
									    	
									    	//SETTING THE ON CHANGE FOR SERVICES SELECT
									    	var length = $('#services').children('option').length;
									    	$('#services').unbind().on('change', function(){
												var services = $('#services option:selected').text();
												var price = $('#services option:selected').attr('value');
												servicesRef.on("value", function(snapshot){
									        			snapshot.forEach(function(childSnapshot) {
									        				//console.log(childSnapshot.val().time);
									        				//console.log(childSnapshot.val().name);
									        				var service = $('#services option:selected').text();
									        				if(services == childSnapshot.val().name) {
									        					$('#duration_time').val(childSnapshot.val().time);	
									        				}
									        			});
									        		});						
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
			        	// $('#day').text(start.format("MM/DD/YYYY"));
			        	$('#btn_cancel').on('click', function(){
								$('#modal1').modal('close');
								clear();
							});
			        	
			        	 $('#submit').unbind().click(function(){

			        	 	var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey;
			        	 	clinic = $('#clinic option:selected').text();
			        	 	service = $('#services option:selected').text();
			        	 	duration_time = $('#duration_time').val();
			        	 	schedule_time = $('#schedule_time').val();
			        	 	
			        	 	var clinic_key = $('#clinic option:selected').attr('value');			        	 
			        	 	var services_key = $('#services option:selected').attr('service_id');
			        	 	var price_value = $('#services option:selected').attr("price");			  
			        	 	
			        	 	price = $("#price").val();
				        	moment = $('#calendar').fullCalendar('getDate');
				        	allDay = $('#allDay').val();				      
				        	//variable for all day
				        	//console.log(allDay);
				        	//console.log(start.format()+"T"+duration_time);
				        	var start_date = start.format()+"T"+duration_time;
				        	//START VALUE SETTING TIME
				        	//start_value = start.format("MM/DD/YYYY hh:mm");
				        	start_value = start.format("MM/DD/YYYY "+schedule_time);
				        	notes = $('#notes').val();
				        	end_value = end.format("MM/DD/YYYY");
				        	//CHECK IF THB NOTES IS NULL
				        	if(notes.length == 0) {				        	
								Materialize.toast('Empty Notes!', 3000, 'rounded');
				        	}
				        	else if(services.length == 0) {
								Materialize.toast('Empty Services!', 3000, 'rounded');
				        	}
				        	else if(price.length == 0) {
								Materialize.toast('Empty Price!', 3000, 'rounded');
				        	}
				        	else if(duration_time.length == 0) {
								Materialize.toast('Empty Duration Time!', 3000, 'rounded');
				        	}
				        	else if(schedule_time.length == 0) {
								Materialize.toast('Empty schedule Time!', 3000, 'rounded');
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
							                price: price_value,
							                //id: currentKey
							            };
						            $('#calendar').fullCalendar('renderEvent', newEvent,true);
						            //ADD TO FIREBASE
						            //console.log(service);
						            //console.log(services_key);
					            	add(price, start_value, end_value, notes, clinic_key, services_key, duration_time, schedule_time);
					            	clear();
					            	$('.modal').modal('close');
					            }					           					        
				        	}
			        	 });

			        	}else{
			        		loginButton = false;
			        		console.log('selecta');
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

			        	loginButton = false;
			        	$('#modal1').modal('open');
			        	//SET THE TAG IN MODAL FOR INITIAL LOAD
			        	$('#delete').show();
			        	$('#notes').val(event.title);
						$('#duration_time').val(event.duration_time);
						$('#schedule_time').val(event.schedule_time);
						$("#price").val(event.price);
						//GLOBAL CLINIC_ID
						var clinic_id = event.clinic;
						
						//$('#clinic').html('');
						//GETING THE VALUE KEY OF CLINIC AND GET THE CLINIC NAME
						/*console.log("clinic");
						console.log(event.clinic);*/
						clinicsRef.child(event.clinic).on("value", function(snapshot) {
							//console.log(snapshot.val().name);
							$('#clinic').html('');
							$clinic = $('#clinic');
							$clinic.append(
								//NEED TO ADD THE UI ID
								$("<option></option>").attr("value",1).attr("id","clinic").attr("clinic_id", event.clinic).text(snapshot.val().name)
							);
							clinicsRef.on("value", function(snapshot) {
								snapshot.forEach(function(childSnapshot) {				
									if(event.clinic != childSnapshot.key) {
										/*console.log("this is true");
										console.log(childSnapshot.key);
										console.log(childSnapshot.val().name);*/
										//console.log("clinic id"+childSnapshot.key);									
										$clinic.append($("<option></option>").attr("value", childSnapshot.val().name).attr("id", "clinic").attr("clinic_id", childSnapshot.key).attr("key_clinic", childSnapshot.key).text(childSnapshot.val().name));
										$("select").material_select('update');
									}
								});							
							});
						});
						//INTIAL LOAD
						/*------------ SET THE SERVICE OPTION -----------*/			
						//console.log("SERVICES");
						var clinic_name;			
						servicesRef.child(event.service).on("value", function(snapshot) {
							//console.log(snapshot.val());
							//console.log("the value"+snapshot.val().name);
							clinic_name = snapshot.val().name;
							//APPEND THE FIRST DATA TO SELCT 
							$('#services').html('');
							//SET THE SERVICES UI ID
							$('#services').append($("<option></option>").attr("value",1).attr("id","services").attr("service_id", event.service).text(snapshot.val().name));
							//GET ALL SERIVECES
							servicesRef.on("value", function(snapshot) {
								snapshot.forEach(function(childSnapshot) {
									//console.log(childSnapshot.key+"result service_id");
									if(clinic_name != childSnapshot.val().name) {										
										//console.log("service key"+childSnapshot.val().name);
										$('#services').append($("<option></option>").attr("value", childSnapshot.val().name).attr("id", "services").attr("price", childSnapshot.val().price).attr("service_id", childSnapshot.key).text(childSnapshot.val().name));
										$("select").material_select('update');
									}
								});

							});
							//$("#price").val(parseInt(snapshot.val().price));
							/*$("select").material_select('update');*/
						});
						//GETING THE VALUE KEY OF SERVICE
						//* START FUNCTION FOR SELECT *//
						//CHECK IF THE OPTIONS IS CHANGES FOR CLINIC
			        	$('#clinic').on('change', function(){
			        		var clinic_key = $('#clinic option:selected').attr('value');
			        		var ui_key = $('#clinic option:selected').attr('clinic_id');
			        		var key_clinic = $('#clinic option:selected').attr('key_clinic');
			        		var value_key = $('#clinic option:selected').text();
			        		var clinic_id;
			        		//NEED CHANGES
			        		console.log("clinic on change function");
			        		console.log("clinic id"+ui_key);
			        		

			        		//console.log("clinic id"+ui_key);
			        		$('#services').html('');
			        		servicesRef.on("value", function(snapshot){
			        			snapshot.forEach(function(childSnapshot) {
			        				if(ui_key == childSnapshot.val().clinic_id) {
			        					//console.log("iu key"+ui_key+" snapshot key"+childSnapshot.clinic_id);
			        					//zconsole.log(childSnapshot.val().name);
			        					$('#services').append($("<option></option>").attr("value", childSnapshot.val().name).attr("id", "services").attr("service_id", childSnapshot.key).attr("price", childSnapshot.val().price).text(childSnapshot.val().name));
										$("select").material_select('update');
										//NEED TO SET THE PRICE FIRST CHILD
										//console.log(childSnapshot.val().price);
			        				}
			        			});
			        		});	
			        	});
			        	//SERVICES ONCHANGE FUNCTION
			        	$('#services').on('change', function(){
			        		//SET THE PRICE
			        		var services_price = $('#services option:selected').attr('price');
			        		//edit this area
			        		var service_id = $('#services option:selected').attr('service_id');
			        		//console.log("Hello services_price"+services_price);
			        		//console.log("SERVICES_ID"+ service_id);
			        		$("#price").val(parseInt(services_price));
			        		//alert(services_price);
			        	});
						//* END FOR FUNCTION SELECT*//
						//NEED TO MODIFY
						//$('#clinic option:selected').text(2);
			        	//$('#services option:selected').text(2);
			        	//GETTING THE VALUE AND THE SUBMIT BUTTON FOR UPDATE
			        	$('#submit').unbind().on("click",function(){
			        		var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey, original_title, clinic_id;
			        		original_title = event.title;
			        		clinic = $('#clinic option:selected').text();
			        	 	service = $('#services option:selected').text();
			        	 	clinic_id = $('#clinic option:selected').attr('clinic_id');
			        	 	duration_time = $('#duration_time').val();
			        	 	schedule_time = $('#schedule_time').val();
			        	 	price = $("#price").val();
				        	allDay = $('#allDay').val();
				        	start_value = event.start.format("MM/DD/YYYY "+duration_time);
				        	notes = $('#notes').val();
				        	end_value = event.end.format("MM/DD/YYYY");
				        	//var service_id = $('#services option:selected').attr('service_id');
				        	var service_id = $('#services option:selected').attr('service_id');
				        	var clinic_id = $('#clinic option:selected').attr('clinic_id');
							console.log("clinic id"+clinic_id);
							console.log("services id"+service_id);
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
				        	//revertChanges("", notes, start_value, end_value, clinic, service, duration_time, schedule_time, price, original_title);
				        	clear();
				        	$('.modal').modal('close');
				        	clear();
							getClinics();

			        	});
						//CANCEL FUNCTION
						$('#btn_cancel').on('click', function(){
							//$('#clinic').html('');
							$('.modal').modal('close');
							/*$('#clinic').html('');
								$('#clinic').append($("<option></option>").attr("value",1).attr("id","clinic").text("Select Clinic"));
								$("select").material_select('update');*/
							clear();
							getClinics();
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

function getFireBaseData() {
    //var bookingRef = firebase.database().ref('booking');

    var theFireRef = bookingRef.child('schedule');

    if(typeof filter_clinic !== 'undefined'){
        theFireRef = bookingRef.child('schedule').orderByChild('clinic').equalTo(search_clinic);
    }

    theFireRef.once('value', settingData);
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
					calendar = $('#calendar');
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

			        	lastSelectedStart = start;
						lastSelectedEnd = end;

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
										      $("<option></option>").attr("value",childSnapshot.val().price).attr("service_id", childSnapshot.key).attr("id","services").text(value)
										    );
										   // Update the content clearing the caret
									    	$("select").material_select('update');
									    	$("select").closest('#input-services').children('span.caret').remove();
									    	//SEETING THE PRICE NEED TO MODIFY
									    	//NEED TO ADD THE FIRST CHILD
									    	$("#price").val(parseInt(childSnapshot.val().price));
									    	$('#duration_time').val(childSnapshot.val().time);	
									    	
									    	//SETTING THE ON CHANGE FOR SERVICES SELECT
									    	var length = $('#services').children('option').length;
									    	$('#services').unbind().on('change', function(){
												var services = $('#services option:selected').text();
												var price = $('#services option:selected').attr('value');
												servicesRef.on("value", function(snapshot){
									        			snapshot.forEach(function(childSnapshot) {
									        				//console.log(childSnapshot.val().time);
									        				//console.log(childSnapshot.val().name);
									        				var service = $('#services option:selected').text();
									        				if(services == childSnapshot.val().name) {
									        					$('#duration_time').val(childSnapshot.val().time);	
									        				}
									        			});
									        		});						
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
			        	// $('#day').text(start.format("MM/DD/YYYY"));
			        	$('#btn_cancel').on('click', function(){
								$('#modal1').modal('close');
								clear();
							});
			        	
			        	 $('#submit').unbind().click(function(){

			        	 	var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey;
			        	 	clinic = $('#clinic option:selected').text();
			        	 	service = $('#services option:selected').text();
			        	 	duration_time = $('#duration_time').val();
			        	 	schedule_time = $('#schedule_time').val();
			        	 	
			        	 	var clinic_key = $('#clinic option:selected').attr('value');			        	 
			        	 	var services_key = $('#services option:selected').attr('service_id');
			        	 	var price_value = $('#services option:selected').attr("price");			  
			        	 	
			        	 	price = $("#price").val();
				        	moment = $('#calendar').fullCalendar('getDate');
				        	allDay = $('#allDay').val();				      
				        	//variable for all day
				        	//console.log(allDay);
				        	//console.log(start.format()+"T"+duration_time);
				        	var start_date = start.format()+"T"+duration_time;
				        	//START VALUE SETTING TIME
				        	//start_value = start.format("MM/DD/YYYY hh:mm");
				        	start_value = start.format("MM/DD/YYYY "+schedule_time);
				        	notes = $('#notes').val();
				        	end_value = end.format("MM/DD/YYYY");
				        	//CHECK IF THB NOTES IS NULL
				        	if(notes.length == 0) {				        	
								Materialize.toast('Empty Notes!', 3000, 'rounded');
				        	}
				        	else if(services.length == 0) {
								Materialize.toast('Empty Services!', 3000, 'rounded');
				        	}
				        	else if(price.length == 0) {
								Materialize.toast('Empty Price!', 3000, 'rounded');
				        	}
				        	else if(duration_time.length == 0) {
								Materialize.toast('Empty Duration Time!', 3000, 'rounded');
				        	}
				        	else if(schedule_time.length == 0) {
								Materialize.toast('Empty schedule Time!', 3000, 'rounded');
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
							                price: price_value,
							                //id: currentKey
							            };
						            $('#calendar').fullCalendar('renderEvent', newEvent,true);
						            //ADD TO FIREBASE
						            //console.log(service);
						            //console.log(services_key);
					            	add(price, start_value, end_value, notes, clinic_key, services_key, duration_time, schedule_time);
					            	clear();
					            	$('.modal').modal('close');
					            }					           					        
				        	}
			        	 });

			        	}else{
			        		loginButton = false;
			        		console.log('selecta');
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

			        	loginButton = false;
			        	$('#modal1').modal('open');
			        	//SET THE TAG IN MODAL FOR INITIAL LOAD
			        	$('#delete').show();
			        	$('#notes').val(event.title);
						$('#duration_time').val(event.duration_time);
						$('#schedule_time').val(event.schedule_time);
						$("#price").val(event.price);
						//GLOBAL CLINIC_ID
						var clinic_id = event.clinic;
						
						//$('#clinic').html('');
						//GETING THE VALUE KEY OF CLINIC AND GET THE CLINIC NAME
						/*console.log("clinic");
						console.log(event.clinic);*/
						clinicsRef.child(event.clinic).on("value", function(snapshot) {
							//console.log(snapshot.val().name);
							$('#clinic').html('');
							$clinic = $('#clinic');
							$clinic.append(
								//NEED TO ADD THE UI ID
								$("<option></option>").attr("value",1).attr("id","clinic").attr("clinic_id", event.clinic).text(snapshot.val().name)
							);
							clinicsRef.on("value", function(snapshot) {
								snapshot.forEach(function(childSnapshot) {				
									if(event.clinic != childSnapshot.key) {
										/*console.log("this is true");
										console.log(childSnapshot.key);
										console.log(childSnapshot.val().name);*/
										//console.log("clinic id"+childSnapshot.key);									
										$clinic.append($("<option></option>").attr("value", childSnapshot.val().name).attr("id", "clinic").attr("clinic_id", childSnapshot.key).attr("key_clinic", childSnapshot.key).text(childSnapshot.val().name));
										$("select").material_select('update');
									}
								});							
							});
						});
						//INTIAL LOAD
						/*------------ SET THE SERVICE OPTION -----------*/			
						//console.log("SERVICES");
						var clinic_name;			
						servicesRef.child(event.service).on("value", function(snapshot) {
							//console.log(snapshot.val());
							//console.log("the value"+snapshot.val().name);
							clinic_name = snapshot.val().name;
							//APPEND THE FIRST DATA TO SELCT 
							$('#services').html('');
							//SET THE SERVICES UI ID
							$('#services').append($("<option></option>").attr("value",1).attr("id","services").attr("service_id", event.service).text(snapshot.val().name));
							//GET ALL SERIVECES
							servicesRef.on("value", function(snapshot) {
								snapshot.forEach(function(childSnapshot) {
									//console.log(childSnapshot.key+"result service_id");
									if(clinic_name != childSnapshot.val().name) {										
										//console.log("service key"+childSnapshot.val().name);
										$('#services').append($("<option></option>").attr("value", childSnapshot.val().name).attr("id", "services").attr("price", childSnapshot.val().price).attr("service_id", childSnapshot.key).text(childSnapshot.val().name));
										$("select").material_select('update');
									}
								});

							});
							//$("#price").val(parseInt(snapshot.val().price));
							/*$("select").material_select('update');*/
						});
						//GETING THE VALUE KEY OF SERVICE
						//* START FUNCTION FOR SELECT *//
						//CHECK IF THE OPTIONS IS CHANGES FOR CLINIC
			        	$('#clinic').on('change', function(){
			        		var clinic_key = $('#clinic option:selected').attr('value');
			        		var ui_key = $('#clinic option:selected').attr('clinic_id');
			        		var key_clinic = $('#clinic option:selected').attr('key_clinic');
			        		var value_key = $('#clinic option:selected').text();
			        		var clinic_id;
			        		//NEED CHANGES
			        		console.log("clinic on change function");
			        		console.log("clinic id"+ui_key);
			        		

			        		//console.log("clinic id"+ui_key);
			        		$('#services').html('');
			        		servicesRef.on("value", function(snapshot){
			        			snapshot.forEach(function(childSnapshot) {
			        				if(ui_key == childSnapshot.val().clinic_id) {
			        					//console.log("iu key"+ui_key+" snapshot key"+childSnapshot.clinic_id);
			        					//zconsole.log(childSnapshot.val().name);
			        					$('#services').append($("<option></option>").attr("value", childSnapshot.val().name).attr("id", "services").attr("service_id", childSnapshot.key).attr("price", childSnapshot.val().price).text(childSnapshot.val().name));
										$("select").material_select('update');
										//NEED TO SET THE PRICE FIRST CHILD
										//console.log(childSnapshot.val().price);
			        				}
			        			});
			        		});	
			        	});
			        	//SERVICES ONCHANGE FUNCTION
			        	$('#services').on('change', function(){
			        		//SET THE PRICE
			        		var services_price = $('#services option:selected').attr('price');
			        		//edit this area
			        		var service_id = $('#services option:selected').attr('service_id');
			        		//console.log("Hello services_price"+services_price);
			        		//console.log("SERVICES_ID"+ service_id);
			        		$("#price").val(parseInt(services_price));
			        		//alert(services_price);
			        	});
						//* END FOR FUNCTION SELECT*//
						//NEED TO MODIFY
						//$('#clinic option:selected').text(2);
			        	//$('#services option:selected').text(2);
			        	//GETTING THE VALUE AND THE SUBMIT BUTTON FOR UPDATE
			        	$('#submit').unbind().on("click",function(){
			        		var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey, original_title, clinic_id;
			        		original_title = event.title;
			        		clinic = $('#clinic option:selected').text();
			        	 	service = $('#services option:selected').text();
			        	 	clinic_id = $('#clinic option:selected').attr('clinic_id');
			        	 	duration_time = $('#duration_time').val();
			        	 	schedule_time = $('#schedule_time').val();
			        	 	price = $("#price").val();
				        	allDay = $('#allDay').val();
				        	start_value = event.start.format("MM/DD/YYYY "+duration_time);
				        	notes = $('#notes').val();
				        	end_value = event.end.format("MM/DD/YYYY");
				        	//var service_id = $('#services option:selected').attr('service_id');
				        	var service_id = $('#services option:selected').attr('service_id');
				        	var clinic_id = $('#clinic option:selected').attr('clinic_id');
							console.log("clinic id"+clinic_id);
							console.log("services id"+service_id);
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
				        	//revertChanges("", notes, start_value, end_value, clinic, service, duration_time, schedule_time, price, original_title);
				        	clear();
				        	$('.modal').modal('close');
				        	clear();
							getClinics();

			        	});
						//CANCEL FUNCTION
						$('#btn_cancel').on('click', function(){
							//$('#clinic').html('');
							$('.modal').modal('close');
							/*$('#clinic').html('');
								$('#clinic').append($("<option></option>").attr("value",1).attr("id","clinic").text("Select Clinic"));
								$("select").material_select('update');*/
							clear();
							getClinics();
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
