@extends('layout')


@section('custom-css')
	<link rel="stylesheet" href="{{ asset('css/fullcalendar.min.css') }}">
	<style>
body{
			background: #00d2ff; /* fallback for old browsers */
			background: -webkit-linear-gradient(to left, #00d2ff , #928DAB); /* Chrome 10-25, Safari 5.1-6 */
			background: linear-gradient(to left, #00d2ff , #928DAB); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		}
		@media only screen and (min-width: 601px){
			.navbar-fixed {
			    height: 45px;
			}
			nav, nav .nav-wrapper i, nav a.button-collapse, nav a.button-collapse i {
			    height: 45px;
			    line-height: 45px;
			}
		}
		.primary-bg-1 {
		    background: #1a70d2;
		}
		nav .brand-logo{
			font-weight: 300;
		}
		input:not([type]):focus:not([readonly]), input[type=text]:focus:not([readonly]), input[type=password]:focus:not([readonly]), input[type=email]:focus:not([readonly]), input[type=url]:focus:not([readonly]), input[type=time]:focus:not([readonly]), input[type=date]:focus:not([readonly]), input[type=datetime]:focus:not([readonly]), input[type=datetime-local]:focus:not([readonly]), input[type=tel]:focus:not([readonly]), input[type=number]:focus:not([readonly]), input[type=search]:focus:not([readonly]), textarea.materialize-textarea:focus:not([readonly]){
			border-bottom: 1px solid #88d5e8;
			box-shadow: 0 0 0 0;
		}
		textarea.materialize-textarea{
			border: none;
		}
		#calendar table{
			background: #00d2ff;
			background: -webkit-linear-gradient(to left, #00d2ff , #928DAB);
			background: linear-gradient(to left, #00d2ff , #928DAB);
			cursor: pointer;
		}
		.fc-ltr .fc-basic-view .fc-day-top .fc-day-number {
		    float: left;
		    margin: 5px 8px;
		    color: #d9fffd;
		    font-size: 20px;
		    font-weight: 300;
		}
		.fc td, .fc th{
			margin: 10px;
		}
		.fc-unthemed .fc-content, .fc-unthemed .fc-divider, .fc-unthemed .fc-list-heading td, .fc-unthemed .fc-list-view, .fc-unthemed .fc-popover, .fc-unthemed .fc-row, .fc-unthemed tbody, .fc-unthemed td, .fc-unthemed th, .fc-unthemed thead{
			border-color: #79d1e8;
		}
		.fc-row .fc-content-skeleton td, .fc-row .fc-helper-skeleton td{
			border-color: #a1a9c7;	
		}
		.fc-row .fc-bgevent-skeleton td, .fc-row .fc-highlight-skeleton td {
		    border-color: #5f98d8;
		}
		input:not([type]), input[type=text], input[type=password], input[type=email], input[type=url], input[type=time], input[type=date], input[type=datetime], input[type=datetime-local], input[type=tel], input[type=number], input[type=search], textarea.materialize-textarea{
			border-bottom: 1px solid #88d5e8;
		}
		input:not([type]):focus:not([readonly])+label, input[type=text]:focus:not([readonly])+label, input[type=password]:focus:not([readonly])+label, input[type=email]:focus:not([readonly])+label, input[type=url]:focus:not([readonly])+label, input[type=time]:focus:not([readonly])+label, input[type=date]:focus:not([readonly])+label, input[type=datetime]:focus:not([readonly])+label, input[type=datetime-local]:focus:not([readonly])+label, input[type=tel]:focus:not([readonly])+label, input[type=number]:focus:not([readonly])+label, input[type=search]:focus:not([readonly])+label, textarea.materialize-textarea:focus:not([readonly])+label{
			color: #88d5e8;
		}
		input:not([type]).valid, input:not([type]):focus.valid, input[type=text].valid, input[type=text]:focus.valid, input[type=password].valid, input[type=password]:focus.valid, input[type=email].valid, input[type=email]:focus.valid, input[type=url].valid, input[type=url]:focus.valid, input[type=time].valid, input[type=time]:focus.valid, input[type=date].valid, input[type=date]:focus.valid, input[type=datetime].valid, input[type=datetime]:focus.valid, input[type=datetime-local].valid, input[type=datetime-local]:focus.valid, input[type=tel].valid, input[type=tel]:focus.valid, input[type=number].valid, input[type=number]:focus.valid, input[type=search].valid, input[type=search]:focus.valid, textarea.materialize-textarea.valid, textarea.materialize-textarea:focus.valid{
			border-bottom: 1px solid #88d5e8;
			box-shadow: 0 1px 0 0 #2bb7ae;
		}
		input.select-dropdown, input[type=text], input[type=number], input[type=password], textarea {
		    font-size: 1.5em!important;
		    color: #ffffff;
		    font-weight: 500;
		    margin: 0 0 10px 0!important;
		}
		.select-wrapper input.select-dropdown{
			border-bottom: 1px solid #88d5e8;
		}
		.select-wrapper span.caret{
			color: #d7f7ff;
		}
		#calendar .fc-head, #calendar .fc-head table {
		    background: rgba(159, 236, 230, 0.14);
		}
		#calendar th{
			color: #fff;
		}
		#calendar thead{
			border:0px;
		}
		#calendar th{
			font-weight: normal;
			padding: 10px;
		}

		#calendar .fc-toolbar{
		    background: #0c3a46;
		    margin: 0;
		    color: #fff;
		    /*padding-right: 36%;*/
		}
		.fc-button-group{
			margin-right: 20px;
		}
		#calendar .fc-toolbar .fc-button-group button{
		    border: none;
		    color: #6a97a2;
		    text-transform: uppercase;
		    height: 45px;
		    box-shadow: none;
		    margin-top: 24px;
		    background: transparent;
		    font-weight: 300;
		    text-shadow: 0 0 0;
		    padding: 9px 20px;
		    font-weight: 200;
		    font-size: 1.3em;
		    text-transform: capitalize;
		}
		.fc-toolbar .fc-state-active, .fc-toolbar .ui-state-active{
		    background: rgb(36, 89, 103)!important;
		    color: #96c7d4!important;
		    border-radius: 2px;
		}
		#calendar .fc-toolbar h2{
			font-weight: 200;
		    font-size: 3em;
		    margin: 20px;
		}
		.fc-event{
		    font-weight: 400;
		    font-size: 1em;
		}
		.fc-day-grid-event {
		    margin: 1px 2px 0;
		    padding: 3px 15px;
		    border-radius: 0;
		}
		.fc-event, .fc-event-dot {
		    background-color: rgb(0, 114, 142);
		    border: none;
		    margin: 1px 4px;
		    padding: 5px 15px;
		    /*border-left: 4px solid #245b69;*/
		}
		.fc-day-grid-event .fc-time {
			font-weight: 600;
			display: block;
			text-transform: uppercase;
			font-size: 0.7em;
			margin: 1px 0 0 0;
			color: #42aed0;
		}
		.fc-widget-content{
			background: rgba(61, 216, 202, 0.25);
		}
		.fc-row .fc-content-skeleton td, .fc-row .fc-helper-skeleton td{
			border-color: transparent;		
		}
		.fc-content-skeleton table{
			background: transparent!important;
		}
		.fc-unthemed .fc-today {
		    background: #dae088;
		}
		a.fc-more {
		    margin: 3px 10px;
		    font-size: .85em;
		    cursor: pointer;
		    text-decoration: none;
		    background: #ecfcff;
		    border-radius: 50px;
		    padding: 2px 10px;
		    display: inline-block;
		    color: #50bdd2;
		    font-weight: 500;
		}
		#doctor-nav{
			transform: translateX(0px);
		} 


		.modal{
		    background-color: rgb(42, 183, 175);
		    width: 30%;
		}
		.modal .row{
			margin-bottom: 0;
		}
		.modal .modal-content {
		    padding: 15px 20px;
		}
		.modal.modal-fixed-footer{
			height: 55%;
		}
		.modal .modal-footer{
			background-color: #0fb3aa;
		}
		.modal.modal-fixed-footer .modal-footer{
			border: none;
		}
		.input-field label{
			color: #88fff4;	
		}
		.dropdown-content{
			max-height: 200px;
		}
		.modal-content h3{
		    font-size: 2em;
		    padding: 10px 8px;
		    color: #fff;
		    font-weight: 200;
		    margin-bottom: 5px;
		}
		[type="radio"]:not(:checked)+label, [type="radio"]:checked+label{
			margin-top: 0;
		}
		#btn_cancel, #delete{
		    font-size: 1em;
		    text-transform: capitalize;
		    color: #bcdee6;
		}
		.modal .modal-footer .btn, .modal .modal-footer .btn-large, .modal .modal-footer .btn-flat{
			float: none;
		}
		.modal-overlay{
			display: none;
		}
		#addClinicForm h5{
			margin-left: 10px;
			font-weight: 200;
			color: #fff;
			font-size: 3em;
		}
		@media only screen and (max-width: 1366px){
			.modal {
			    width: 30%;
			    height: 65%;
			    max-height: 65%;
			}
		

			label{
				margin-top: 13px;
			}
			.modal textarea{
				margin-top: 20px;
			}
			.textnote{
				 margin-top: 35px;
			}
		}

		::-webkit-input-placeholder { /* Chrome/Opera/Safari */
		  color: #54c5bf;
		}
		::-moz-placeholder { /* Firefox 19+ */
		  color: #54c5bf;
		}
		:-ms-input-placeholder { /* IE 10+ */
		  color: #54c5bf;
		}
		:-moz-placeholder { /* Firefox 18- */
		  color: #54c5bf;
		}
		.tabs{
			background: rgb(26, 169, 160);
			height: 55px;
		}
		.tabs .indicator{
			height: 1px;
			background-color: #1ad4c9;
			display: none;
		}
		.tabs .tab{
			line-height: 55px;
			height: 55px;
		}
		.tabs .tab a{
			font-size: 2em;
			font-weight: 200;
			text-transform: capitalize;
			color: #62d4cd;
		}
		.tabs .tab a.active{
			background-color: rgb(42, 183, 175);
			color: #fff;
		}
		.tabs .tab a:hover{
			color: #fff;
		}
		.error_display span{
			color: #fff5d9!important;
		}
		.topbar{
			position: absolute;
			top: 3.5%;
			right: 2%;
		}
		.topbar a{
			margin-right: 10px;
			color: #5ab5ce;
		}
		.topbar a span{
			position: relative;
			top: -7px;
		}
		#day{
			position: absolute;
			font-size: 1.5em!important;
			color: #ffffff;
			font-weight: 500;
			top: 7px;
			display: block;
		}

		/* LEFT SIDE */
			.collection{
	/*		height: 500px;
			overflow-x: hidden;
			overflow-y: auto;*/
		}
		.collection .collection-item.avatar a{
		    color: #f3f3f3;
		    font-weight: 300;
		}
		.collection, .collection .collection-item{
			border: none;
			background: none;
		}
		.collection .collection-item.avatar {
		    min-height: 57px;
		}
		.collection .collection-item.avatar .title {
		    font-size: 19px;
		    font-weight: 300;
		    display: inline-block;
		    margin-top: 12px;
		}
		.collection .collection-item.avatar p {
		    margin: 0;
		    color: #b7e1ec;
		    font-size: 14px;
		    font-weight: 300;
		}
		.collection .collection-item.avatar i.circle{
			background-color: #666e8c;
		}
		.bottomshadow{
			background: -moz-linear-gradient(top,  rgba(255,255,255,0) 0%, rgba(242,251,253,1) 100%);
			background: -webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(242,251,253,1) 100%);
			background: linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(242,251,253,1) 100%);
			filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#ffffff',GradientType=0 );
			position: absolute;
			width: 100%;
			bottom:0;
			height: 200px;
			left: 0;

		}
		input[type=text]{
		    font-size: 1.5em;
		    text-align: center;
		    font-weight: 300;
		    border-bottom: 1px solid #76d5ef;
		    color: #def2f7;
		}
		h1{
			font-weight: 200;
			font-size: 3rem;
		    color: #def2f7;	    
		    text-align: center;
		}
		.bluetext{
			color: #9ee0f3;
			font-weight: 300;
		}
		.patient-page{
		    background: transparent;
		    box-shadow: 0 0 0 0;
		    position: relative;
		    margin-top: 20px;
		}
		h2{
			font-weight: 200;
			color: #9cd6e8;
			font-size: 2.5em;
			margin-top: 50px;
		}
		.patient-page p{
			font-weight: 300;
		}
		.profileImg{
			text-align: center;
		}
		.profileImg a{
			display: block;
			margin: 20px 50px;
		}

		.profileImg img{
			/*border-radius: 50%;*/
			width: 100%;
		}
		.subusers .collection{
			height: 500px;
			overflow-x: hidden;
			overflow-y: auto;
		}
		.aduser{
		    font-size: 1.2em;
		    color: #f3f1a5;
		    font-weight: 300;
		    margin-left: 15px;
		}
		.aduser span{
			position: relative;
			top: -8px;
			left: 4px;
		}
		#btn {
			border: none;
			background: rgba(106, 223, 255, 0.31);
			color: #fff;
			font-size: 1.3em;
			font-weight: 200;
			padding: 5px 20px;
			border-radius: 2px;
			display: inline-block;
			width: 41%;
			text-align: center;
		}
		::-webkit-input-placeholder { /* Chrome/Opera/Safari */
		  color: #def2f7;
		}
		::-moz-placeholder { /* Firefox 19+ */
		  color: #def2f7;
		}
		:-ms-input-placeholder { /* IE 10+ */
		  color: #def2f7;
		}
		:-moz-placeholder { /* Firefox 18- */
		  color: #def2f7;
		}
		@media only screen and (max-width: 1500px){
			.collection{
				height: 400px;
			}
			h1{
				font-size: 3.2em;
			}
		}
		@media only screen and (max-width: 1366px){
			.patient-page{
				margin-top: 10px;
			}
			h1 {
			    font-size: 3em;
			}
		}
		@media only screen and (max-width: 991px){
			.collection{
				height: 340px;
			}	
		}

		.leftbox{
			height: 100vh;
			-moz-box-shadow: 5px 0 17px -11px #1f535f;
			-webkit-box-shadow: 5px 0 17px -11px #1f535f;
			box-shadow: 5px 0 17px -11px #1f535f;
			position: relative;
			z-index: 2;
		}
		.nopadding{
			padding: 0!important;
		}
	</style>
@endsection

@section('content')



<div class="row">



  	<div class="col l2 leftbox">
	
		<div class="patient-page">			 
			<div class="profileImg">
				<a href="#!user"><img src="http://www.westpointdental.com.au/wp-content/uploads/2015/05/logo.png"></a>
			</div>
			<!-- <p class="bluetext" style="text-align:center;"> or select below: </p> -->
			<ul class="collection">
			    <li class="collection-item avatar">
			    	 <a href="{{ url('doctor/dashboard') }}">
				      <i class="material-icons circle">dashboard</i>
				      <span class="title"> Dashboard </span>
				   
				      </p>			      
			        </a>
			    </li>
			    <li class="collection-item avatar">
			    	<a href="{{ url('doctor/clinics') }}">
				      <i class="material-icons circle">business</i>
				      <span class="title"> Clinics </span>
				   
				      </p>			      
				    </a>
			    </li>
			    <li class="collection-item avatar">
			    	<a href="{{ url('doctor/services') }}">
				       <i class="material-icons circle">contact_phone</i>
				      <span class="title"> Services </span>
				   
				      </p>		
				    </a>	      
			    </li>
			    <li class="collection-item avatar">
			    	<a href="{{ url('doctor/profile') }}">
				       <i class="material-icons circle">assignment_ind</i>
				      <span class="title"> My Profile </span>
				      
				      </p>		
				      </a> 	      
			    </li>
			    <li class="collection-item avatar">
			    	<a href="#!"  id="sidebar_signout">
				       <i class="material-icons circle">vpn_key</i>
				      <span class="title"> Sign Out </span>
				     
				      </p>			      
				     </a>
			    </li>
			</ul>
			

			<div class="forLoggedIn" style="display:none">
				<a href="/user-dashboard"> <i class="material-icons circle">assignment_ind</i> <span> Dashboard </span> </a>
				<a href="javascript:;" id="logout"> <i class="material-icons circle">input</i> <span> Logout </span> </a>
			</div>
			<div class="forLoggedOut" style="display:none">
				<a href="javascript:;" id="loginButton"> <i class="material-icons circle">input</i> <span> Login </span> </a>
			</div>

			<!-- <div class="bottomshadow"></div> -->
		</div>
	</div>


	<div class="col l10 nopadding" id="main-panel">
		<div id="calendar"></div>
	</div>

	
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
      	
      	</div>
       	 <div class="input-field col s6">
          <input id="price" type="number" class="validate">
         <!--  <label for="price">PRICE</label> -->
        </div>
        <span id="schedule_error"></span>
        <div class="input-field col s6">
          <input id="duration_time" type="time">
        </div>

       <div class="input-field col s6">
            <span id="day"></span>
        </div>
        <div class="input-field col s6">
          <input id="schedule_time" type="time">
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
   


 <!-- Modal Structure -->
  <div id="doctor_modal" class="modal modal-fixed-footer">
    <div class="modal-content">
       <!-- <div class="input-field col s12" id="input-clinics">
	      <select id="doctor_clinic">
	      <option value="" disabled selected>Choose Clinic</option>
	      <option value="1">Clinic 1</option>
	      <option value="2">Clinic 2</option>
	      <option value="3">Clinic 3</option>
	    </select>
   		 <label>DENTAL CLINIC</label> 
      </div>
 -->
       <div class="input-field col s12" id="input-services">
	      <select id="doctor_services">
	      <option value="" disabled selected>Choose Services</option>
	      <option value="1">Service 1</option>
	      <option value="2">Service 2</option>
	      <option value="3">Service 3</option>
	    </select>
   		 <label>SERVICES</label> 
      </div>
      	<div class="inupt-field col s12">
      	
      	</div>
       	 <div class="input-field col s6">
          <input id="doctor_price" type="text" class="validate">
         <!--  <label for="price">PRICE</label> -->
        </div>
        <span id="schedule_error"></span>
        <div class="input-field col s6">
          <input id="doctor_duration_time" type="text">
        </div>

       <div class="input-field col s6">
            <span id="doctor_day"></span>
        </div>

         <div class="col l6">
			       	<div class="input-field">
			       		<i class="material-icons prefix">schedule</i>
						<select id="doctor_schedule_time">
							      <option>01:00 am</option>
							      <option>01:30 am</option>
							      <option>02:00 am</option>
							      <option>02:30 am</option>
							      <option>03:00 am</option>
							      <option>03:30 am</option>
							      <option>04:00 am</option>
							      <option>04:30 am</option>
							      <option>05:00 am</option>
							      <option>05:30 am</option>
							      <option>06:00 am</option>
							      <option>06:30 am</option>
							      <option>07:00 am</option>
							      <option>07:30 am</option>
							      <option>08:00 am</option>
							      <option>08:30 am</option>
							      <option>09:00 am</option>
							      <option>09:30 am</option>
							      <option>10:00 am</option>
							      <option>10:30 am</option>
							      <option>11:00 am</option>
							      <option>11:30 am</option>
							      <option>12:00 am</option>
							      <option>12:30 am</option>
						     	  <option>01:00 pm</option>
							      <option>01:30 pm</option>
							      <option>02:00 pm</option>
							      <option>02:30 pm</option>
							      <option>03:00 pm</option>
							      <option>03:30 pm</option>
							      <option>04:00 pm</option>
							      <option>04:30 pm</option>
							      <option>05:00 pm</option>
							      <option>05:30 pm</option>
							      <option>06:00 pm</option>
							      <option>06:30 pm</option>
							      <option>07:00 pm</option>
							      <option>07:30 pm</option>
							      <option>08:00 pm</option>
							      <option>08:30 pm</option>
							      <option>09:00 pm</option>
							      <option>09:30 pm</option>
							      <option>10:00 pm</option>
							      <option>10:30 pm</option>
							      <option>11:00 pm</option>
							      <option>11:30 pm</option>
							      <option>12:00 pm</option>
							      <option>12:30 pm</option>
					    </select>
						<label> Time </label>
			        </div>
			    </div>

         <div class="input-field col s6">
          <input id="doctor_name" type="text">
        </div>

         <div class="input-field col s6">
          <input id="doctor_number" type="number">
        </div>

        <div class="input-field col s12">
          <textarea id="doctor_address"  required=""></textarea>
          <label for="doctor_address">ADDRESS</label>
        </div>

        <div class="input-field col s12">
          <textarea id="doctor_notes" class="materialize-textarea" required=""></textarea>
          <label for="notes">NOTES</label>
        </div>

    </div>
    <div class="modal-footer bottom-button">
     <a href="#!" class="waves-effect waves-green btn-flat" id="doctor_submit">Submit</a>
     <a href="#!" class="waves-effect waves-green btn-flat" id="doctor_btn_cancel">Cancel</a> 
     <a href="#!" class="waves-effect waves-green btn-flat" id="doctor_delete">Delete</a> 
    </div>
  </div>      

   <div id="doctor_modal" class="modal modal-fixed-footer">
    <div class="modal-content" > 
       <ul class="collection" id="content-booking-list">
    	</ul>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-action waves-effect waves-green btn-flat" id="cancel">Cancel</a>
      <a href="#!" class="waves-effect waves-green btn-flat" id="delete_doctor">Delete</a> 
    </div>
  </div>       

         
  
</div>

@endsection


@section('auth-js')

<script async="true">
		firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	$('#user_name').text(user.displayName);
		$('#user_email').text(user.email);
		$('#user_signout').text(user.displayName);

		if(user.photoURL){
          storageRef.child(user.photoURL).getDownloadURL().then(function(url){
              if(url){
                  $('#profilePic').attr('src', url);
                }
          }).catch(function(error){
              console.log(error);
            });
          }

	  }else{
	  	window.location.href="/";
	  }

	});
</script>
@endsection

@section('custom-js')

	<script type="text/javascript" src="{{ asset('js/moment.min.js') }}"></script>
	<script type="text/javascript" src="{{ asset('js/fullcalendar.min.js') }}"></script>
	<script type="text/javascript" src="{{ asset('js/booking.js') }}"></script>
	
	<script>

	var storageRef = firebase.storage().ref();

		$(document).ready(function() {

			$('#user_signout').dropdown({
		      inDuration: 300,
		      outDuration: 225,
		      constrain_width: true, // Does not change width of dropdown to that of the activato
		      gutter: 0, // Spacing from edge
		      belowOrigin: true, // Displays dropdown below the button
		      alignment: 'left' // Displays dropdown with edge aligned to the left of button
		    });

    // page is now ready, initialize the calendar...

	   

	});
	</script>
@endsection