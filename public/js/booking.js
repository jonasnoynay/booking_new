var UI_ID;
var data = [];
var bookingSearch = firebase.database().ref('booking');
var bookingRef = firebase.database().ref('booking');
var clinicsRef = bookingRef.child("clinics");
var servicesRef = bookingRef.child("services");
var usersRef = bookingRef.child('users');
var scheduleRef = bookingRef.child('schedule');
var calendar;

var CLINIC_ID = "-KXUF5KYT-nScKv5qjNu";

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

	$('#doctor_notes').val('');
	$('#doctor_duration_time').val('');
	$('#doctor_schedule_time').val('');
	$("#doctor_name").val('');
	$("#doctor_number").val('');
	$("#doctor_address").val('');

	//$('#schedule_error').html('');

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
		uid : UI_ID,
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
								name : fullname,
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


$('input[name="filter_events"]').on('change', function(){
	console.log($(this).val());
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
        //console.log(snapshot.val());
        if(snapshot.val() == null) {
            console.log("empty");
            initialFullCalendar();
        }
        else {
            console.log("Note Empty");
             getFireBaseData();
        }
    }, function(err){
        initialFullCalendar();
        console.log(err);
    });

    //console.log(newBookingValue.child('schedule'));
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
			        timeFormat : 'hh:mm a',
			        height : function(){

			        	return $(window).height();
			        },
			        businessHours: {
					    // days of week. an array of zero-based day of week integers (0=Sunday)
					    dow: [ 1, 2, 3, 4,5 ] // Monday - Friday
					},
			        //events: booking_data,
			        select: selectDay,
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
				        	var start_date = event.start.format()+"T"+duration_time;
				        	//START VALUE SETTING TIME
				        	//start_value = start.format("MM/DD/YYYY hh:mm");
				        	start_value = event.start.format("MM/DD/YYYY");
				        	start_value = start_value+" "+event.schedule_time;
				        	event.end = $.fullCalendar.moment(start_value);
				        	event.end.add(duration_time, 'minutes');
				        	end_value = event.end.format("MM/DD/YYYY hh:mm a");
				        	//SEARCH IF EXIST
				        	bookingSearch.child('schedule').orderByChild("start_value").startAt(start_value).endAt(start_value).once('value', function(snapshot){
				        		if(snapshot.val() == null) {
									revertChanges(event.id, event.title, start_value, end_value, event.clinic, event.service, event.duration_time, event.schedule_time, event.price, "");
								}
								else {
									revertFunc();	
									alert("No Vacant. "+start_value);
												
								}
				        	});				        	
				        }
			        },
			        //update or remove
			        eventClick: eventClickFunc
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

				var _ev = {
			        title: childSnapshot.val().notes,
			        start: childSnapshot.val().start_value,
			        end: childSnapshot.val().end_value,
			        clinic: childSnapshot.val().clinic,
	                service: childSnapshot.val().service,
	                duration_time: childSnapshot.val().duration_time,
	                schedule_time: childSnapshot.val().schedule_time,
	                price: childSnapshot.val().price,
	                id: childSnapshot.key,
	                clinic_id: childSnapshot.val().clinic,
					service_id: childSnapshot.val().service
			    };

			    if(typeof childSnapshot.val().uid != undefined && childSnapshot.val().uid == UI_ID){
			    	_ev.color = "#ccc";
			    }

				booking_data.push(_ev);
				
				if(booking_data.length == childSize) {
					//setting the data from firebase
					//CHECK THE SEARCH_CLINIC ID IF NULL 
					if(typeof(search_clinic) == "undefined") {
						//CHECK IF USER IS LOGIN
						if(UI_ID) {
							//GET ALL THE CLINIC
							clinicsRef.on("value", function(snapshot){
								//FIND THE UI ID
								snapshot.forEach(function(childSnapshot) {
									//console.log(childSnapshot.val().name);
									//GET THE CLINIC
									if(UI_ID == childSnapshot.val().uid) {
										//console.log(childSnapshot.val().name);
										//console.log(childSnapshot.key+"  UI d clinic");
									
										var schedule_data = [];
										//FAKE CLINIC ID
										//scheduleRef.orderByChild("clinic").startAt(childSnapshot.key).endAt(childSnapshot.key).on('value', function(snapshot) {
										scheduleRef.orderByChild("clinic").startAt(	CLINIC_ID).endAt(	CLINIC_ID).on('value', function(snapshot) {
											//GET ALL THE SCHEDULE
											var schedule_size = snapshot.numChildren();	
											snapshot.forEach(function(childSnapshot) {
												schedule_data.push({
												        title: childSnapshot.val().notes,
												        start: childSnapshot.val().start_value,
												        end: childSnapshot.val().end_value,
												        clinic: childSnapshot.val().clinic,
										                service: childSnapshot.val().service,
										                duration_time: childSnapshot.val().duration_time,
										                schedule_time: childSnapshot.val().schedule_time,
										                price: childSnapshot.val().price,
										                id: childSnapshot.key,
										                clinic_id: childSnapshot.val().clinic,
														service_id: childSnapshot.val().service,
														patient_name:  childSnapshot.val().patient_name,
										                patient_address:  childSnapshot.val().patient_address,
										                patient_number:  childSnapshot.val().patient_number
												    });
												if(schedule_data.length == schedule_size) {
													console.log("NOT EMPPTY DATA");
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
												        timeFormat : 'hh:mm a',
												        height : function(){

												        	return $(window).height();
												        },
												        businessHours: {
														    // days of week. an array of zero-based day of week integers (0=Sunday)
														    dow: [ 1, 2, 3, 4,5 ] // Monday - Thursday
														},
												        events: schedule_data,
												        select: selectDayNoClinic,
												        editable: true,
												        //update for doctor patient or removeEvents
					        							eventClick: eventClickFuncDoctor,
					        							 eventDrop : function(event, delta, revertFunc) {				
													        	if (!confirm("Are you sure about this change?")) {
													        		revertFunc();
														        }
														        else {
														        	//console.log(event.id);
														        	//console.log(event.title+" "+event.start.format()+" "+event.end.format(), event.clinic +" "+event.service, event.duration_time);
														        	//calling the function revertChanges to update the position
														        	var start_date = event.start.format()+"T"+duration_time;
														        	//START VALUE SETTING TIME
														        	//start_value = start.format("MM/DD/YYYY hh:mm");
														        	start_value = event.start.format("MM/DD/YYYY");
														        	start_value = start_value+" "+event.schedule_time;
														        	event.end = $.fullCalendar.moment(start_value);
														        	event.end.add(duration_time, 'minutes');
														        	end_value = event.end.format("MM/DD/YYYY hh:mm a");
														        	//SEARCH IF EXIST
														        	bookingSearch.child('schedule').orderByChild("start_value").startAt(start_value).endAt(start_value).once('value', function(snapshot){
														        		if(snapshot.val() == null) {
																			//revertChanges(event.id, event.title, start_value, end_value, event.clinic, event.service, event.duration_time, event.schedule_time, event.price, "");
																			//revertChangesDoctor(id, title, start, end, clinic, service, duration_time, schedule_time, price, original_title, patient_name, patient_number, patient_address) 
																			//console.log(event.id);
																			//console.log(event.title);
																			//console.log(event.);
																			revertChangesDoctor(event.id, event.title, start_value, end_value, event.clinic, event.service, event.duration_time, event.schedule_time, event .price, "", event.patient_name, event.patient_number, event.patient_address);
																		}
																		else {
																			revertFunc();	
																			alert("No Vacant. "+start_value);
																						
																		}
														        	});				        	
														        }
													        },
												     });//END FOR CALENDAR
												}
												//display calendar INTIAL NULL CALENDAR
												if(schedule_size.length == 0) {
													console.log("EMPPTY DATA");
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
												        timeFormat : 'hh:mm a',
												        height : function(){

												        	return $(window).height();
												        },
												        businessHours: {
														    // days of week. an array of zero-based day of week integers (0=Sunday)
														    dow: [ 1, 2, 3, 4,5 ] // Monday - Thursday
														},
												        //events: schedule_data,
												        select: selectDayNoClinic,
												        editable: true,
												     });//END FOR CALENDAR
												}
											});

											
										});
									}
									//ELSE NO CLINIC
									else {
										//console.log("No DAta for your clinic");
									}

								});
							});
						}
					}
					else {
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
					        timeFormat : 'hh:mm a',
					        height : function(){

					        	return $(window).height();
					        },
					        businessHours: {
							    // days of week. an array of zero-based day of week integers (0=Sunday)
							    dow: [ 1, 2, 3, 4,5 ] // Monday - Thursday
							},
					        events: booking_data,
					        select: selectDay,
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
						        	var start_date = event.start.format()+"T"+duration_time;
						        	//START VALUE SETTING TIME
						        	//start_value = start.format("MM/DD/YYYY hh:mm");
						        	start_value = event.start.format("MM/DD/YYYY");
						        	start_value = start_value+" "+event.schedule_time;
						        	event.end = $.fullCalendar.moment(start_value);
						        	event.end.add(duration_time, 'minutes');
						        	end_value = event.end.format("MM/DD/YYYY hh:mm a");
						        	//SEARCH IF EXIST
						        	bookingSearch.child('schedule').orderByChild("start_value").startAt(start_value).endAt(start_value).once('value', function(snapshot){
						        		if(snapshot.val() == null) {
											revertChanges(event.id, event.title, start_value, end_value, event.clinic, event.service, event.duration_time, event.schedule_time, event.price, "");
										}
										else {
											revertFunc();	
											alert("No Vacant. "+start_value);
														
										}
						        	});				        	
						        }
					        },
					        //update or removeEvents
					        eventClick: eventClickFunc
					    });
						}
					}
					//END OF IF ELSE IN CHECKING THE SEARCH CLINIC
				
		});
}

function eventClickFuncDoctor(event, jsEvent, view, revertFunc){
			        loginButton = false;
			        	$('#doctor_modal').modal('open');
			        	//SET THE TAG IN MODAL FOR INITIAL LOAD
			        	$('#doctor_delete').show();
			        	$('#doctor_notes').val(event.title);
						$('#doctor_duration_time').val(event.duration_time);
						$('#doctor_schedule_time').val(event.schedule_time);
						/*console.log("PRICE"+event.price);*/
						$("#doctor_price").val(event.price);
						$("#doctor_name").val(event.patient_name);
						$("#doctor_address").val(event.patient_address);
						$("#doctor_number").val(event.patient_number);

						$('#doctor_day').text(event.start.format("MMM. D,YYYY"));

						//console.log("DOCTOR DAY"+event.start.format("MMM. D,YYYY"));
						//GLOBAL CLINIC_ID

						//GET THE SERVICE NAME
						//console.log(event.service_id);
						$doctor_services = $("#doctor_services");
						$doctor_services.html('');
						//NEED TO MODIFY THIS HET-----------------
						servicesRef.child(event.service_id).on('value', function(snapshot){
							console.log("service name"+snapshot.val().name);
							$doctor_services.append(
						      $("<option></option>").attr("value",snapshot.val().price).attr("service_id", snapshot.key).attr("id","doctor_services").text(snapshot.val().name)
						    );
						    $("select").material_select('update');												   
						});
						//GET ALL SERVICES
						//$doctor_services.html('');
						servicesRef.on('value', function(snapshot){
							snapshot.forEach(function(childSnapshot){
								//console.log(childSnapshot.val().name);
								//check first under the clinic services
								if(childSnapshot.val().clinic_id == CLINIC_ID) {
									//console.log(child);
									if(childSnapshot.key != event.service_id) {
										$doctor_services.append(
									      $("<option></option>").attr("value",childSnapshot.val().price).attr("service_id", childSnapshot.key).attr("id","doctor_services").text(childSnapshot.val().name)
									    );
									    $("select").material_select('update');	
									}
								}
							});
						});
						$('#doctor_services').unbind().on('change', function(){
						var service_name = $('#doctor_services option:selected').text();
						var service_id = $('#doctor_services option:selected').attr('service_id');
						/*console.log("SERVICE ID"+service_id);
						console.log("SERVICE NAME"+service_name);*/
						servicesRef.child(service_id).on('value', function(snapshot){
							//console.log(snapshot.val().price);
							$("#doctor_price").val(parseInt(snapshot.val().price));
							$('#doctor_duration_time').val(snapshot.val().time);	
						});
					})			        	

						
						//* END FOR FUNCTION SELECT*//
						//NEED TO MODIFY
						//$('#clinic option:selected').text(2);
			        	//$('#services option:selected').text(2);
			        	//GETTING THE VALUE AND THE SUBMIT BUTTON FOR UPDATE
			        	$('#doctor_submit').unbind().on("click",function(){
			        		var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey, original_title, clinic_id, patient_name, patient_number, patient_address;
			        		original_title = event.title;
			        		clinic = $('#clinic option:selected').text();
			        	 	service = $('#services option:selected').text();
			        	 

			        	 	schedule_time = $('#schedule_time').val();
			        	 	duration_time = $('#doctor_duration_time').val();
			        	 	schedule_time = $('#doctor_schedule_time').val();
			        	 	//console.log('schedule_time '+schedule_time);
			        	 	

			        	 	var service_name = $('#doctor_services option:selected').text();
							var service_id = $('#doctor_services option:selected').attr('service_id');
							var clinic_id  = $('#doctor_clinic option:selected').attr('value');
							var clinic_name = $('#doctor_clinic option:selected').text();
							notes = $('#doctor_notes').val();
							patient_name = $('#doctor_name').val();
							patient_address = $('#doctor_address').val();
							patient_number = $('#doctor_number').val();
							//console.log(patient_address+" "+patient_number+" "+patient_name);
							//console.log("service name"+service_name+" service id"+service_id+" CLINIC_ID "+CLINIC_ID+" CLINIC_ID NAME "+clinic_name);

			        	 	//var price_value = $('#services option:selected').attr("price");			  
			        	 	
			        	 	price = $("#doctor_price").val();



				        	event.end = $.fullCalendar.moment(event.end+" "+schedule_time);
				        	event.end.add(duration_time, 'minutes');
				        	end_value = event.end.format("MM/DD/YYYY hh:mm a");	

				        	var start_date = event.start.format()+"T"+duration_time;
				        	//START VALUE SETTING TIME
				        	//start_value = start.format("MM/DD/YYYY hh:mm");
				        	start_value = event.start.format("MM/DD/YYYY");
				        	start_value = start_value+" "+schedule_time;

				        	//console.log('setting data');
				        	//console.log(start_value);
				        	//notes = $('#notes').val();

				        	event.end = $.fullCalendar.moment(event.end.format('MM/DD/YYYY')+" "+schedule_time);
				        	event.end.add(duration_time, 'minutes');
				        	end_value = event.end.format("MM/DD/YYYY hh:mm a");


				        	if(notes.length == 0) {				        	
								Materialize.toast('Empty Notes!', 3000, 'rounded');
				        	}
				        	else if(service_name.length == 0) {
								Materialize.toast('Empty Services!', 3000, 'rounded');
				        	}
				        	else if(price.length == 0) {
								Materialize.toast('Empty Price!', 3000, 'rounded');
				        	}
				        	else if(patient_name.length == 0) {
								Materialize.toast('Empty Name!', 3000, 'rounded');
				        	}
				        	else if(patient_number.length == 0) {
								Materialize.toast('Empty Number!', 3000, 'rounded');
				        	} 
				        	else if(patient_address.length == 0) {
								Materialize.toast('Empty Address!', 3000, 'rounded');
				        	} 
				        	else {
				        		$('#calendar').fullCalendar('removeEvents', event._id);
					        	//SETTING THE DATA FOR FULLCALENDAR
					        	var newEvent = {
						                //start: '2016-11-22T12:30:00',
						                start: start_value,
						                end: end_value,
						                allDay: false,
						                title: notes,
						                clinic: clinic_name,
						                service: service,
						                duration_time: duration_time,
						                schedule_time: schedule_time,
						                color: '#ccc',
						                price: price,
						                clinic_id: clinic_id,
						                service_id: service_id,
						                patient_name: patient_name,
						                patient_address: patient_address,
						                patient_number: patient_number
						                //id: currentKey
						            };
					        	$('#calendar').fullCalendar('renderEvent', newEvent,true);
					        	//UPDATE FIREBASE DATABASE

					        	//revertChanges("", notes, start_value, end_value, search_clinic, service_id, duration_time, schedule_time, price, original_title);
					        	var id = event.id;
					        	if(id == "") {

					        	} 
					        	else {
					        		revertChangesDoctor(id, notes, start_value, end_value, CLINIC_ID, service_id, duration_time, schedule_time, price, original_title, patient_name, patient_number, patient_address);
					        	}
					        	clear();
					        	$('.modal').modal('close');
					        	clear();
								getClinics();
				        	}//END OF VALIDATION FOR NULL IMPUT 			     

				        	

			        	});
						//CANCEL FUNCTION
						$('#doctor_btn_cancel').on('click', function(){
							//$('#clinic').html('');
							$('#doctor_modal').modal('close');
							/*$('#clinic').html('');
								$('#clinic').append($("<option></option>").attr("value",1).attr("id","clinic").text("Select Clinic"));
								$("select").material_select('update');*/
							clear();
							//getClinics();
						});
		        	 	
			        	//DELETE FUNCTION
			        	$('#doctor_delete').unbind().click(function() {
			        		//$('#calendar').fullCalendar('removeEvents', event._id);
			        		//clear();
			        		//CONFIRM FOR DELETING
			        		if (!confirm("Are you sure about this change?")) {
				        			//revertFunc();
					        }
					        else {					    
					        	$('#calendar').fullCalendar('removeEvents', event._id);
					        	console.log("SCHEDULE TIME"+event.schedule_time);
					        	var start_date = event.start.format("MM/DD/YYYY")+" "+event.schedule_time;
					        	//console.log("START DATE: "+event.start.format());
				        		//START VALUE SETTING TIME
				        		//start_value = start.format("MM/DD/YYYY hh:mm");
				        		//start_value = event.start.format("MM/DD/YYYY");
				        		//start_value = start_value+" "+event.schedule_time;
				        		console.log("DELETE START "+start_date);

					        	//removeData(event.id, event.title);
				        		clear();
				        		$('#doctor_modal').modal('close');
					        }
			        	});
}


function eventClickFunc(event, jsEvent, view, revertFunc){
			        loginButton = false;
			        	$('#modal1').modal('open');
			        	//SET THE TAG IN MODAL FOR INITIAL LOAD
			        	$('#delete').show();
			        	$('#notes').val(event.title);
						$('#duration_time').val(event.duration_time);
						$('#schedule_time').val(event.schedule_time);
						/*console.log("PRICE"+event.price);*/
						$("#price").val(event.price);

						$('#day').text(event.start.format("MMM. D,YYYY"));
						//GLOBAL CLINIC_ID
						var clinic_id = event.clinic;
						clinicsRef.child(search_clinic).on('value', function(snapshot) {
			        			//console.log("reslut");
			        			//console.log(snapshot.val().name);
			        			$('#clinic').html('');
			        			$('#clinic').append($("<option></option>").attr("value",1).attr("id","clinic").attr("clinic", search_clinic).text(snapshot.val().name));
			        			$("select").material_select('update');
			        			//var services = bookingRef.child('services');
			        			//console.log(snapshot.key);
			        			//SET THE SERVICE VALUE FOR EDIT
			        			var clinic_key = snapshot.key;
			        			$service = $('#services');
			        			$service.html('');
			        			servicesRef.on('value', function(snapshot){
			        				//console.log("result for edit");
			        				//console.log(event.service);
			        				snapshot.forEach(function(childSnapshot) {
			        					if(childSnapshot.key == event.service) {
			        						//console.log("result"+childSnapshot.val().name);
			        						//$('#services').html('');
			        						$service.append(
										      $("<option></option>").attr("value",1).attr("service_id", childSnapshot.key).attr("id","services").attr("time", childSnapshot.val().time).attr("price", childSnapshot.val().price).text(childSnapshot.val().name)
										    );
										     $("select").material_select('update');
			        					}
			        				
			        				});
			        			});
								//$('#services').html('');
			        			servicesRef.on('value', function(snapshot){
			        				//console.log("result for edit");
			        				//console.log(event.service);
			        				snapshot.forEach(function(childSnapshot) {	
			        					if(childSnapshot.val().clinic_id == clinic_key) {
			        						//console.log(childSnapshot.val().name);
			        						if(childSnapshot.key != event.service) {
				        							$service.append(
											      $("<option></option>").attr("value",childSnapshot.val().price).attr("service_id", childSnapshot.key).attr("time", childSnapshot.val().time).attr("id","services").attr("price", childSnapshot.val().price).text(childSnapshot.val().name)
											    );
											    $("select").material_select('update');
											    //$("#price").val(parseInt(childSnapshot.val().price));
												//$('#duration_time').val(childSnapshot.val().time);	
			        						}
			        						
			        					}
			        				});
			        			});
			        		});
						
			        	//SERVICES ONCHANGE FUNCTION
			        	$('#services').on('change', function(){
			        		//SET THE PRICE			        		
			        		var services_price = $('#services option:selected').attr('price');
			        		var time = $('#services option:selected').attr('time');
			        		$("#price").val(parseInt(services_price));
			        		$('#duration_time').val(time);	
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
			        	 	
				        	//var service_id = $('#services option:selected').attr('service_id');
				        	var service_id = $('#services option:selected').attr('service_id');
				        	var clinic_id = $('#clinic option:selected').attr('clinic_id');
							//console.log("clinic id"+clinic_id);
							//console.log("services id"+service_id);

							var start_date = event.start.format()+"T"+duration_time;
				        	//START VALUE SETTING TIME
				        	//start_value = start.format("MM/DD/YYYY hh:mm");
				        	start_value = event.start.format("MM/DD/YYYY");
				        	start_value = start_value+" "+schedule_time;

				        	//console.log('setting data');
				        	//console.log(start_value);
				        	notes = $('#notes').val();

				        	event.end = $.fullCalendar.moment(event.end.format('MM/DD/YYYY')+" "+schedule_time);
				        	event.end.add(duration_time, 'minutes');
				        	end_value = event.end.format("MM/DD/YYYY hh:mm a");


				  

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
					                color: '#ccc',
					                price: price,
					                //id: currentKey
					            };
				        	$('#calendar').fullCalendar('renderEvent', newEvent,true);
				        	//UPDATE FIREBASE DATABASE
				        	revertChanges("", notes, start_value, end_value, search_clinic, service_id, duration_time, schedule_time, price, original_title);
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

function selectDayNoClinic(start, end, jsEvent, view){

	schedule_time = $('#schedule_time').val();
	//console.log(schedule_time);
		end = end.utc().subtract(1, 'days');
			        //console.log(start.format("MM/DD/YYYY hh:mm a"));
			        //console.log(end.format("MM/DD/YYYY hh:mm a"));
			        
			        //console.log('start '+start.format('dddd'));
			        //console.log('end '+end.format('dddd'));
			        var hasWeekend = false;
			        for(var m = $.fullCalendar.moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days') ){
			        	var dow_ = m.format('dddd');
			        	//console.log(dow_);
			        	if(dow_ == "Saturday" || dow_ == "Sunday"){
			        		hasWeekend = true;
			        		break;
			        	}
			        }
			        if(hasWeekend){
			        	alert('Cannot add appointment on weekends.');

			        	return false;
			        }

			        lastSelectedStart = start;
						lastSelectedEnd = end;

			        	if(UI_ID){
			       			$('#doctor_modal').modal('open');
			        		//SETTING THE CLINIC
			        		//GET ALL THE CLINIC ID AND NAME
			        		//$('#clinic').html('');
			        		$doctor_clinic = $('#doctor_clinic');
			        		$doctor_clinic.html('');			        		
							clinicsRef.on("value", function(clinicSnapshot){
								clinicSnapshot.forEach(function(childClinicSnapshot) {
									if(childClinicSnapshot.val().uid == UI_ID) {
										//console.log(childClinicSnapshot.val().name);
										console.log("CLINNID ID"+childClinicSnapshot.key);
			        					$doctor_clinic.append($("<option></option>").attr("value",childClinicSnapshot.key).attr("id","doctor_clinic").attr("clinic_id", childClinicSnapshot.key).text(childClinicSnapshot.val().name));
			        					$("select").material_select('update');
			        					//GET THE SERVICES
			        					//console.log(childClinicSnapshot.key+" clinic_id");
			        					var clinic_id = childClinicSnapshot.key;
			        					//$('#services').html('');
			        					//$doctor_services = $('#doctor_services');
			        					//INITILA LOAD
			        					$doctor_services = $("#doctor_services");
			        					$doctor_services.html('');
			        					servicesRef.on('value', function(serviceSnapShot) {
			        						serviceSnapShot.forEach(function(childServicesSnapshot){
			        							//FAKE CLINIC ID
			        							if(childServicesSnapshot.val().clinic_id == CLINIC_ID) {
			        							/*if(childServicesSnapshot.val().clinic_id == clinic_id) {*/
			        								$doctor_services.append(
												      $("<option></option>").attr("value",childServicesSnapshot.val().price).attr("service_id", childServicesSnapshot.key).attr("id","doctor_services").text(childServicesSnapshot.val().name)
												    );
												    $("select").material_select('update');												   
													$("#doctor_price").val(parseInt(childServicesSnapshot.val().price));
													$('#doctor_duration_time').val(childServicesSnapshot.val().time);		
												}
			        						});
			        					});
			        					//ON CHANGE FOR DOCTOR CLINIC
			        					$('#doctor_clinic').unbind().on('change', function(){
			        						 
			        						var clinic_id  = $('#doctor_clinic option:selected').attr('value');
			        						var clinic_name = $('#doctor_clinic option:selected').text();
			        						/*console.log("id "+clinic_id);
			        						console.log("clinname "+clinic_name);*/
			        						$doctor_services = $("#doctor_services");
			        						servicesRef.on('value', function(snapshot) {
			        							//console.log(snapshot.val());
			        							//FAKE CLINIC ID
			        							//var CLINIC_ID = "-KXv6BueyLpm0Eaw5HsS";
			        							snapshot.forEach(function(childSnapshot){
			        								if(CLINIC_ID == childSnapshot.val().clinic_id) {
			        									console.log(childSnapshot.val().name);
			        									
			        									$doctor_services.html('');
			        									$doctor_services.append(
													      $("<option></option>").attr("value",1).attr("service_id", childSnapshot.key).attr("id","doctor_services").text(childSnapshot.val().name)
													    );
													    $("select").material_select('update');
													    //console.log)(childSnapshot.val().price+"price");
													    //$("#doctor_price").val(parseInt(childSnapshot.val().price));
														//$('#doctor_duration_time').val(childSnapshot.val().time);
			        								}
			        							});
			        						});
			        						//NEED TO MODIFY
				        					servicesRef.on('value', function(snapshot){
												snapshot.forEach(function(childSnapshot) {
													//console.log(childSnapshot.val().name+"Name ");
													//$doctor_services.html('');
													if(clinic_id == childSnapshot.val().clinic_id){

														$doctor_services.append(
													      $("<option></option>").attr("value",childSnapshot.key).attr("service_id", childSnapshot.key).attr("id","doctor_services").text(childSnapshot.val().name)
													    );
													    $("select").material_select('update');
													}												
		        									
												});
											});	
			        					});
										//
										$('#doctor_services').unbind().on('change', function(){
											var service_name = $('#doctor_services option:selected').text();
											var service_id = $('#doctor_services option:selected').attr('service_id');
											/*console.log("SERVICE ID"+service_id);
											console.log("SERVICE NAME"+service_name);*/
											servicesRef.child(service_id).on('value', function(snapshot){
												console.log(snapshot.val().price);
												$("#doctor_price").val(parseInt(snapshot.val().price));
												$('#doctor_duration_time').val(snapshot.val().time);	
											});
										})			        			
									}
								});
							});
			        		
				        	//CHECK IF THE OPTIONS IS CHANGES FOR CLINIC
				        	
				        	
			        	 $('#doctor_delete').hide();
			        	 //$('#doctor_day').text(event.start.format("MMM. D,YYYY"));
						
						
			        	 $('#doctor_day').text(start.format("MMM. D,YYYY"));
			        	 console.log("DOCTOR DAY "+start.format("MMM. D,YYYY"));
			        	$('#doctor_btn_cancel').on('click', function(){
								$('#doctor_modal').modal('close');
								clear();
							});
			        	
			        	 $('#doctor_submit').unbind().click(function(){

			        	 	var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey, patient_name, patient_address, patient_number;
			        	 	//clinic = $('#clinic option:selected').text();
			        	 	//service = $('#services option:selected').text();
			        	 	duration_time = $('#doctor_duration_time').val();
			        	 	schedule_time = $('#doctor_schedule_time').val();
			        	 	//console.log('schedule_time '+schedule_time);
			        	 	

			        	 	var service_name = $('#doctor_services option:selected').text();
							var service_id = $('#doctor_services option:selected').attr('service_id');
							var clinic_id  = $('#doctor_clinic option:selected').attr('value');
							var clinic_name = $('#doctor_clinic option:selected').text();
							notes = $('#doctor_notes').val();
							patient_name = $('#doctor_name').val();
							patient_address = $('#doctor_address').val();
							patient_number = $('#doctor_number').val();
							//console.log(doctor_number+""+doctor_address+""+doctor_name);

			        	 	//var price_value = $('#services option:selected').attr("price");			  
			        	 	
			        	 	price = $("#doctor_price").val();
				        	moment = $('#calendar').fullCalendar('getDate');
				        	allDay = $('#allDay').val();

				        	//console.log("servive name"+service_name+""+service_id+""+clinic_id+"clinic name "+clinic_name+""+duration_time+""+schedule_time+""+notes);				      
				        	//variable for all day
				        	
				        	
				        	var start_date = start.format()+"T"+duration_time;
				        	//START VALUE SETTING TIME
				        	//start_value = start.format("MM/DD/YYYY hh:mm");
				        	start_value = start.format("MM/DD/YYYY");
				        	start_value = start_value+" "+schedule_time;

				        	//console.log('setting data');
				        	//console.log(start_value);
				        	
				        	//end = $.fullCalendar.moment(start_value);
				        	
				        	end = $.fullCalendar.moment(end.format('MM/DD/YYYY')+" "+schedule_time);
				        	end.add(duration_time, 'minutes');
				        	end_value = end.format("MM/DD/YYYY hh:mm a");
				        	console.log(end_value);
				        	//CHECK IF THB NOTES IS NULL
				        	if(notes.length == 0) {				        	
								Materialize.toast('Empty Notes!', 3000, 'rounded');
				        	}
				        	else if(service_name.length == 0) {
								Materialize.toast('Empty Services!', 3000, 'rounded');
				        	}
				        	else if(price.length == 0) {
								Materialize.toast('Empty Price!', 3000, 'rounded');
				        	}
				        	else if(patient_name.length == 0) {
								Materialize.toast('Empty Name!', 3000, 'rounded');
				        	}
				        	else if(patient_number.length == 0) {
								Materialize.toast('Empty Number!', 3000, 'rounded');
				        	} 
				        	else if(patient_address.length == 0) {
								Materialize.toast('Empty Address!', 3000, 'rounded');
				        	}  
				        	/*else if(duration_time.length == 0) {
								Materialize.toast('Empty Duration Time!', 3000, 'rounded');
				        	}*/
				        	/*else if(schedule_time.length == 0) {
								Materialize.toast('Empty schedule Time!', 3000, 'rounded');
				        	}*/
				        	else {
					            //ADD TO FIREBASE
					            //SEACH IF VACANT
						        bookingSearch.child('schedule').orderByChild("start_value").startAt(start_value).endAt(start_value).once('value', function(snapshot){
					        		if(snapshot.val() == null) {
										//revertChanges(event.id, event.title, start_value, end_value, event.clinic, event.service, event.duration_time, event.schedule_time, event.price, "");
											 var newEvent = {
								                //start: '2016-11-22T12:30:00',
								                start: start_value,
								                end: end_value,
								                allDay: false,
								                title: notes,
								                clinic: clinic_name,
								                service: service,
								                duration_time: duration_time,
								                schedule_time: schedule_time,
								                price: price,
								                clinic_id: clinic_id,
								                service_id: service_id,
								                color : "#ccc",
								                patient_name: patient_name,
								                patient_address: patient_address,
								                patient_number: patient_number
								                //id: currentKey
								            };
								            //console.log("servive name"+service_name+""+service_id+""+clinic_id+"clinic name "+clinic_name+""+duration_time+""+schedule_time+""+notes);	
								            console.log(newEvent);
							            $('#calendar').fullCalendar('renderEvent', newEvent,true);
							            //ADD TO FIREBASE
						            	//add(price, start_value, end_value, notes, search_clinic, services_key, duration_time, schedule_time);
						            	//addDoctor(price, start_value, end_value, notes, CLINIC_ID, service_id, duration_time, schedule_time, patient_name, patient_address, patient_number);
						            	$('#doctor_modal').modal('close');
						            	clear();
									}
									else {
										alert("No Vacant. "+start_value);
													
									}
					        	});				    			        
				        	}
			        	 });

			        	}else{
			        		loginButton = false;
			        		console.log('selecta');
			        		$('#loginUser').modal('open');
			        	}
}

function addDoctor(price, start_value, end_value, notes, clinic, service, duration_time, schedule_time, doctor_name, doctor_address, doctor_number){
	//console.log(price+" "+start_value+" "+end_value+" "+notes+" "+clinic+" "+service+" "+duration_time+" "+schedule_time);
	var newBookingValue = bookingRef.child('schedule');
	newBookingValue.push().set({
		price: price,
		start_value: start_value,
		end_value: end_value,
		notes: notes,
		clinic: clinic,
		service: service,
		uid : UI_ID,
		duration_time: duration_time,
		schedule_time: schedule_time,
		patient_name: doctor_name,
		patient_address: doctor_address,
		patient_number: doctor_number
	});
	//var newKey = newBookingValue.push().key;
	//return newKey;
	//console.log(newBookingValue.key);
	 /*var newPostKey = firebase.database().ref().child('posts').push().key;*/
}
function selectDay(start, end, jsEvent, view){

	schedule_time = $('#schedule_time').val();

	//console.log(schedule_time);
		end = end.utc().subtract(1, 'days');
			        //console.log(start.format("MM/DD/YYYY hh:mm a"));
			        //console.log(end.format("MM/DD/YYYY hh:mm a"));
			        
			        //console.log('start '+start.format('dddd'));
			        //console.log('end '+end.format('dddd'));
			        var hasWeekend = false;
			        for(var m = $.fullCalendar.moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days') ){
			        	var dow_ = m.format('dddd');
			        	//console.log(dow_);
			        	if(dow_ == "Saturday" || dow_ == "Sunday"){
			        		hasWeekend = true;
			        		break;
			        	}
			        }
			        if(hasWeekend){
			        	alert('Cannot add appointment on weekends.');

			        	return false;
			        }

			        lastSelectedStart = start;
						lastSelectedEnd = end;

			        	if(UI_ID){
			       			$('#modal1').modal('open');
			        		//SETTING THE CLINIC
			        		clinicsRef.child(search_clinic).on('value', function(snapshot) {
			        			//console.log("reslut");
			        			//console.log(snapshot.val().name);
			        			$('#clinic').html('');
			        			$('#clinic').append($("<option></option>").attr("value",1).attr("id","clinic").attr("clinic", search_clinic).text(snapshot.val().name));
			        			$("select").material_select('update');
			        			//var services = bookingRef.child('services');
			        			//console.log(snapshot.key);
			        			var clinic_key = snapshot.key;
			        			var price_container = [];
			        			var duration_container = [];
			        			$('#services').html('');
			        			servicesRef.on('value', function(snapshot){
			        				snapshot.forEach(function(childSnapshot) {
			        					if(childSnapshot.val().clinic_id == clinic_key) {
			        						//console.log(childSnapshot.val().name);
			        						$("#services").append(
										      $("<option></option>").attr("value",childSnapshot.val().price).attr("service_id", childSnapshot.key).attr("id","services").text(childSnapshot.val().name)
										    );
										    $("select").material_select('update');
										    //NEED TO CHANGE TOMOROW
										    price_container.push(childSnapshot.val().price);
										    duration_container.push(childSnapshot.val().time);
										    /*console.log("the first value "+price_container[0]);
										     console.log("the first duration_time "+duration_container[0]);*/
										   /* $("#price").val(parseInt(childSnapshot.val().price));
											$('#duration_time').val(childSnapshot.val().time);	*/
											$("#price").val(parseInt(price_container[0]));
											$('#duration_time').val(duration_container[0]);	
			        					}
			        				});
			        			});
			        		});
							$('#services').on('change', function(){
								var service_name = $('#services option:selected').text();
								
								servicesRef.on('value', function(snapshot){
									snapshot.forEach(function(childSnapshot) {
										if(service_name == childSnapshot.val().name) {
											/*console.log(childSnapshot.val().time);
											console.log(childSnapshot.val().price);*/
											$("#price").val(parseInt(childSnapshot.val().price));
											$('#duration_time').val(childSnapshot.val().time);	
										}
									});
								});
							});
				        	//CHECK IF THE OPTIONS IS CHANGES FOR CLINIC
				        	
				        	
			        	 $('#delete').hide();
			        	 $('#day').text(start.format("MMM. D,YYYY"));
			        	$('#btn_cancel').on('click', function(){
								$('#modal1').modal('close');
								clear();
							});
			        	
			        	 $('#submit').unbind().click(function(){

			        	 	var price, moment, start_value, end_value, notes, clinic, service, duration_time, schedule_time, allDay, currentKey;
			        	 	//clinic = $('#clinic option:selected').text();
			        	 	service = $('#services option:selected').text();
			        	 	duration_time = $('#duration_time').val();
			        	 	schedule_time = $('#schedule_time').val();
			        	 	//console.log('schedule_time '+schedule_time);
			        	 	
			        	 	var clinic_key = $('#clinic option:selected').attr('clinic');				        	 
			        	 	var services_key = $('#services option:selected').attr('service_id');
			        	 	var price_value = $('#services option:selected').attr("price");			  
			        	 	
			        	 	price = $("#price").val();
				        	moment = $('#calendar').fullCalendar('getDate');
				        	allDay = $('#allDay').val();				      
				        	//variable for all day
				        	//console.log(allDay);
				        	//console.log(start.format()+"T"+duration_time);
				        	//var ampm = $('input[name="ampm"]:checked').val();
				        	
				        	var start_date = start.format()+"T"+duration_time;
				        	//START VALUE SETTING TIME
				        	//start_value = start.format("MM/DD/YYYY hh:mm");
				        	start_value = start.format("MM/DD/YYYY");
				        	start_value = start_value+" "+schedule_time;

				        	//console.log('setting data');
				        	//console.log(start_value);
				        	notes = $('#notes').val();
				        	//end = $.fullCalendar.moment(start_value);
				        	
				        	end = $.fullCalendar.moment(end.format('MM/DD/YYYY')+" "+schedule_time);
				        	end.add(duration_time, 'minutes');
				        	end_value = end.format("MM/DD/YYYY hh:mm a");
				        	console.log(end_value);
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
				        	/*else if(duration_time.length == 0) {
								Materialize.toast('Empty Duration Time!', 3000, 'rounded');
				        	}*/
				        	/*else if(schedule_time.length == 0) {
								Materialize.toast('Empty schedule Time!', 3000, 'rounded');
				        	}*/
				        	else {
					            //ADD TO FIREBASE
					            //SEACH IF VACANT
						        bookingSearch.child('schedule').orderByChild("start_value").startAt(start_value).endAt(start_value).once('value', function(snapshot){
					        		if(snapshot.val() == null) {
										//revertChanges(event.id, event.title, start_value, end_value, event.clinic, event.service, event.duration_time, event.schedule_time, event.price, "");
											 var newEvent = {
								                //start: '2016-11-22T12:30:00',
								                start: start_value,
								                end: end_value,
								                allDay: false,
								                title: notes,
								                clinic: search_clinic,
								                service: service,
								                duration_time: duration_time,
								                schedule_time: schedule_time,
								                price: price,
								                clinic_id: search_clinic,
								                service_id: services_key,
								                color : "#ccc"
								                //id: currentKey
								            };

								            console.log(newEvent);
							            $('#calendar').fullCalendar('renderEvent', newEvent,true);
							            //ADD TO FIREBASE
						            	add(price, start_value, end_value, notes, search_clinic, services_key, duration_time, schedule_time);

						            	clear();
						            	$('.modal').modal('close');
									}
									else {
										alert("No Vacant. "+start_value);
													
									}
					        	});				    			        
				        	}
			        	 });

			        	}else{
			        		loginButton = false;
			        		console.log('selecta');
			        		$('#loginUser').modal('open');
			        	}
}
function callBack(data) {
	//console.log(data);
	alert("data"+data);
}

//function to update in firebase
function revertChangesDoctor(id, title, start, end, clinic, service, duration_time, schedule_time, price, original_title, patient_name, patient_number, patient_address) {
	
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
				schedule_time: schedule_time,
				patient_name: patient_name,
				patient_address: patient_address,
				patient_number: patient_number
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
				schedule_time: schedule_time,
				patient_name: patient_name,
				patient_address: patient_address,
				patient_number: patient_number
			};
			//update firebase
			var bookingUpdateRef = firebase.database().ref('booking').child('schedule').child(snapshot.key);
			bookingUpdateRef.update(data);
		});
	}
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
		//console.log("FUNCTION FOR SEARCH");
		//console.log(title);
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
		//console.log("delete");
		//console.log(id+" "+title);
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
	//console.log("SEARCH DATA"+search_value);
	//THIS FUNCTION WHERE CHECK FIRE CHILD ONLY START_VALUE NO SEARCH SCHEDULE TIME INCLUDED
	var result;
	bookingSearch.child('schedule').orderByChild("start_value").startAt(search_value).endAt(search_value).once('value', function(snapshot){
		if(snapshot.val() == null) {
			result = false;
		}
		else {
			//console.log("EXIST");
			//console.log(snapshot.val());
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
	//console.log("result find"+result);
	return result;
}
