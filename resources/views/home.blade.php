@extends('layout')

@section('custom-css')
	<link rel="stylesheet" href="{{ asset('css/fullcalendar.min.css') }}">
	<style>
		#calendar table{
			background: #1e88e5;
		    color: #fff;
		    font-size: 16px;
		}
		#calendar thead{
			border:0px;
		}
		#calendar th{
			font-weight: normal;
			padding-top: 1em;
		}
		#calendar td, #calendar th{
			border-style: none;
			
		}

		#calendar .fc-head,
		#calendar .fc-head table{
			background: #1565c0;
		}

		/* #calendar .fc-day:hover{
			background:#0d47a1;
		} */
		#calendar .fc-state-highlight{
			background: #1976d2;
		}
	
		#calendar .fc-toolbar{
			background: #1565c0;
		    padding-bottom: 1em;
		    margin: 0;
		    color: #fff;
		}

		#calendar .fc-toolbar .fc-button-group button{
			background: #1565c0;
		    border: 0;
		    color: #fff;
		    text-transform: uppercase;
		    border-right: 2px solid #fff;
		    border-radius: 0;
		    height: 30px;
		    box-shadow : none;
		}

		#calendar .fc-toolbar .fc-left{
			width: 100%;
		}

		#calendar .fc-toolbar h2{
			font-size: 36px;
		}

		#doctor-nav{
			transform: translateX(0px);
		} 
	</style>
@endsection

@section('content')



<div class="row">
@include('home-navbar')
<div id="calendar"></div>

<!-- Modal Structure -->
  <div id="modal1" class="modal modal-fixed-footer">
    <div class="modal-content">
       <div class="input-field col s12" id="input-clinics">
	      <select id="clinic">
	      <option value="" disabled selected>Choose Clinic</option>
	      <option value="1">Clinic 1</option>
	      <option value="2">Clinic 2</option>
	      <option value="3">Clinic 3</option>
	    </select>
   		 <label>DENTAL CLINIC</label> 
      </div>

       <div class="input-field col s12" id="input-services">
	      <select id="services">
	      <option value="" disabled selected>Choose Services</option>
	      <option value="1">Service 1</option>
	      <option value="2">Service 2</option>
	      <option value="3">Service 3</option>
	    </select>
   		 <label>SERVICES</label> 
      </div>
      	<div class="inupt-field col s12">
      	<p>
	      <input type="checkbox" id="allDay" />
	      <label for="allDay">All Day</label>
	    </p>
      	</div>
       	 <div class="input-field col s6">
          <input id="price" type="number" class="validate">
        </div>
       	 <div class="input-field col s6">
          <input id="duration" type="number" class="validate">
        </div>
        <span id="schedule_error"></span>

       <div class="input-field col s6">
            <span id="day"></span>
        </div>
        <div class="input-field col s6">
          <div class="input-field col s4">
          	 <select>
	      		<option value="" disabled selected>00</option>
			      <option value="1">01</option>
			      <option value="2">02</option>
			      <option value="3">03</option>
			      <option value="4">04</option>
			      <option value="5">05</option>
			      <option value="6">06</option>
			      <option value="7">07</option>
			      <option value="8">08</option>
			      <option value="9">09</option>
			      <option value="10">10</option>
			      <option value="11">11</option>
			      <option value="12">12</option>
			    </select>
		    </div>
          	   <div class="input-field col s4">
          	 <select>
	      		<option value="0" selected>00</option>
			      <option value="15">15</option>
			      <option value="30">30</option>
			      <option value="45">45</option>
			    </select>
		    </div>
		    <div class="input-field col s4">
		    	<input name="ampm" type="radio" id="am" checked />
      			<label for="am">AM</label>
		    	<input name="ampm" type="radio" id="pm" />
      			<label for="pm">PM</label>
		    </div>
        </div>
        <div class="input-field col s12">
          <textarea id="notes" class="materialize-textarea" required=""></textarea>
          <label for="notes">NOTES</label>
        </div>

    </div>
    <div class="modal-footer bottom-button">
     <a href="#!" class="waves-effect waves-green btn-flat" id="submit">Submit</a>
     <a href="#!" class="waves-effect waves-green btn-flat" id="btn_cancel">Cancel</a> 
     <a href="#!" class="waves-effect waves-green btn-flat" id="delete">Delete</a> 
    </div>
  </div>

  <div id="loginUser" class="modal" style="max-width: 600px;">
		<div class="modal-head">
			<a href="#closeModal" class="close-modal">X</a>
		</div>
				<ul class="tabs" style="overflow: hidden;">
					<li class="tab col s6"><a href="#login_modal">LOGIN</a> </li>
					<li class="tab col s6"><a href="#new">NEW USER</a></li>
				</ul>
	      <div class="modal-content">
		      	<div class="row" id="login_modal">
		            <form action="" id="loginForm">
		            	  <div class="row">
					        <div class="input-field">
					          <input id="login_username" type="text" class="validate">
					          <label for="login_username">Username</label>
					        </div>
				      	</div>
		      			<div class="row">
					        <div class="input-field">
					          <input id="login_password" type="password" class="validate">
					          <label for="login_password">Password</label>
					        </div>
				      	</div>
				      	<p class="error_display"><a href="#">X</a> <span></span></p>
				      	<div class="row">
				      		<button type="submit" class="waves-effect waves-light btn" style="max-width: 180px; width:100%">
							<div class="preloader-wrapper small">
						    <div class="spinner-layer spinner-white-only">
						      <div class="circle-clipper left">
						        <div class="circle"></div>
						      </div><div class="gap-patch">
						        <div class="circle"></div>
						      </div><div class="circle-clipper right">
						        <div class="circle"></div>
						      </div>
						    </div>
						  </div>
						  <span>Submit</span>
				      		</button>
				      	</div>
		            </form>
		      </div>
		      <div id="new" class="row">
				<form action="" id="createUser">
					<input type="text" placeholder="Fullname" id="create_fullname">
						<input type="text" placeholder="Email Address" id="create_email">
						<input type="text" placeholder="Contact Number" id="create_contact_no">
						<input type="text" placeholder="Address" id="create_address">
						<input type="password" placeholder="Password" id="create_password">
						<input type="password" placeholder="Confirm Password" id="create_confirm_password">
						<p class="error_display"><a href="#">X</a> <span></span></p>
						<div class="row">
				      		<button type="submit" class="waves-effect waves-light btn" style="max-width: 180px; width:100%">
							<div class="preloader-wrapper small">
						    <div class="spinner-layer spinner-white-only">
						      <div class="circle-clipper left">
						        <div class="circle"></div>
						      </div><div class="gap-patch">
						        <div class="circle"></div>
						      </div><div class="circle-clipper right">
						        <div class="circle"></div>
						      </div>
						    </div>
						  </div>
						  <span>Submit</span>
				      		</button>
				      	</div>
					</form>
				</div>
	      </div>
<!-- 	    <div class="modal-footer">
  <a href="#!" class="modal-action modal-close waves-effect waves-light btn-flat">Cancel</a>
  <button type="submit" class="modal-action modal-close waves-effect waves-light btn-flat">Submit</button>
</div> -->
  </div>


@endsection

@section('auth-js')

<script async="true">

var uid = null;
		firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		$('#user_signout').text(user.displayName);
		uid = user.uid;
		$('#login').hide();
	  }else{
	  	$('#login').show();
	  }
	});
</script>
@endsection

@section('custom-js')
	<script type="text/javascript" src="{{ asset('js/moment.min.js') }}"></script>
	<script type="text/javascript" src="{{ asset('js/fullcalendar.min.js') }}"></script>
	<script>


	var search_clinic = "{{ Request::segment(2) }}";
	var filter_clinic = true;


	$(document).on('click','.error_display a', function(){
		$(this).parents('.error_display').removeClass('active');
		$(this).parents('.error_display').find('span').text('');
	});

	$('#login').on('click', function(){
		$('#loginUser').modal('open');
	});

	$('.close-modal').on('click', function(){
		$(this).parents('.modal').modal('close');
	});

	$('#signout').on('click', function(){
	
	firebase.auth().signOut().then(function() {
		  window.location.href="/";
		}, function(error) {
		  	console.log(error);
		});
	});

		$(document).on('ready', function(){
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
		  }else{
		  	$('#login').show();
		  }
		});

		/*$('#loginForm').on('submit', function(e){
			e.preventDefault();
			console.log('login');
		});


			//initalize modals
		$('.modal').modal();

		$('select').material_select();

			$('#calendar').fullCalendar({
				header : {
					left : 'agendaDay,agendaWeek,month',
					center : 'title',
					right : ''
				},
				dayClick: function(date, jsEvent, view) {

					console.log(date);

					if(uid){
						$('#addAppointment').modal('open');
					}else{
						$('#loginUser').modal('open');
					}

			        //alert('Clicked on: ' + date.format()) ex. 2016-11-09;

			        //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY) 1012,555;

			        //alert('Current view: ' + view.name) ex. month;

			        // change the day's background color just for fun
			        //$(this).css('background-color', 'red');

			    }
		        // put your options and callbacks here
		    });*/
		});

	</script>
		<script type="text/javascript" src="{{ asset('js/booking.js') }}"></script>
	
@endsection