@extends('layout')

@section('content')

<div class="row">
@include('navbar')
<ul id="doctor-nav" class="side-nav fixed">
    <li><div class="userView">
      <div class="background">
        <img src="http://materializecss.com/images/office.jpg">
      </div>
      <a href="#!user"><img class="circle" src="http://materializecss.com/images/yuna.jpg" id="profilePic"></a>
      <a href="#!name"><span class="white-text name" id="user_name"></span></a>
      <a href="#!email"><span class="white-text email" id="user_email"></span></a>
    </div></li>
    <li><a href="{{ url('doctor/dashboard') }}" class="waves-effect">Dashboard</a></li>
    <li class="active"><a href="{{ url('doctor/clinics') }}" class="waves-effect">Clinics</a></li>
    <li><a href="{{ url('doctor/services') }}" class="waves-effect">Services</a></li>
    <li><div class="divider"></div></li>
    <li><a class="subheader">My Account</a></li>
    <li><a class="waves-effect" href="{{ url('doctor/profile') }}">My Profile</a></li>
    <li><a class="waves-effect" href="#!" id="sidebar_signout">Sign Out</a></li>
  </ul>
	<div class="col s12" id="main-panel">
	
		<div class="card" style="max-width: 800px;">
		 	<div class="card-content">
			 	<div class="preloader-container">
		            <div class="preloader-wrapper big active">
		            <div class="spinner-layer spinner-blue-only">
		              <div class="circle-clipper left">
		                <div class="circle"></div>
		              </div><div class="gap-patch">
		                <div class="circle"></div>
		              </div><div class="circle-clipper right">
		                <div class="circle"></div>
		              </div>
		            </div>
		          </div>
		        </div>
		 		<div class="row">
		 			<h4 class="panel-title">Clinics</h4>  <a class="waves-effect waves-light btn light-blue darken-4 right" href="#addClinic">ADD</a>
		 		</div>
		 		<div class="row">
		 			<table class="bordered highlight styleTable">
			        <thead>
			          <tr>
			              <th data-field="id">Name</th>
			              <th data-field="name">Address</th>
			              <th data-field="action" width="50"></th>
			          </tr>
			        </thead>

			        <tbody id="clinicsTable">
			        </tbody>
			      </table>
		 		</div>
		 		<div class="row">
		 			<div id="pagination"></div>
		 		</div>
		 	</div>
	      </div>
	</div>

</div>

  <div id="addClinic" class="modal" style="max-width: 600px;">
    <form action="" id="addClinicForm">
    	<div class="modal-content">
	      <h5>Add Clinic</h5>
	      <div class="row">
	      			<div class="row">
				        <div class="input-field">
				          <input id="clinic_name" type="text" class="validate">
				          <label for="clinic_name">Clinic Name</label>
				        </div>
			      	</div>
	      			<div class="row">
				        <div class="input-field">
				          <input id="clinic_address" type="text" class="validate">
				          <label for="clinic_address">Clinic Address</label>
				        </div>
			      	</div>
	      </div>
	    </div>
	    <div class="modal-footer">
	      <a href="#!" class="modal-action modal-close waves-effect waves-light btn-flat">Cancel</a>
	      <button type="submit" class="modal-action modal-close waves-effect waves-light btn-flat">Submit</button>
	    </div>
    </form>
  </div>
  <div id="editClinic" class="modal" style="max-width: 600px;">
    <form action="" id="updateClinicForm">
    	<div class="modal-content">
	      <h5>Edit Clinic</h5>
	      <div class="row">
	      			<div class="row">
				        <div class="input-field">
				          <input id="edit_clinic_name" type="text" class="validate">
				          <label for="edit_clinic_name" class="active">Clinic Name</label>
				        </div>
			      	</div>
	      			<div class="row">
				        <div class="input-field">
				          <input id="edit_clinic_address" type="text" class="validate">
				          <label for="edit_clinic_address" class="active">Clinic Address</label>
				        </div>
			      	</div>
			      	<input type="hidden" id="edit_clinic_id">
	      </div>
	    </div>
	    <div class="modal-footer">
	      <a href="#!" class="modal-action modal-close waves-effect waves-light btn-flat">Cancel</a>
	      <button type="submit" class="modal-action modal-close waves-effect waves-light btn-flat">Submit</button>
	    </div>
    </form>
  </div>

  <div id="confirmDelete" class="modal" style="max-width: 300px;">
    <div class="modal-content">
      <h5>Delete Item?</h5>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-action modal-close waves-effect waves-light btn-flat">Cancel</a>
	   <a href="#!" class="modal-action modal-close waves-effect waves-light btn-flat" id="doDelete">Delete</a>
    </div>
  </div>

@endsection


@section('auth-js')

<script async="true">

var uid = null;

		firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	$('#user_name').text(user.displayName);
		$('#user_email').text(user.email);
		$('#user_signout').text(user.displayName);
			uid = user.uid;

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
	<script type="text/javascript" src="{{ asset('js/materialize-pagination.min.js') }}"></script>
	<script>


	var database = firebase.database();
	var toastDuration = 3000;
	 var storageRef = firebase.storage().ref();

	//Firebase reference for clinics
	var clinicsRef = database.ref("booking").child('clinics');

	$(document).on('ready', function(){

		//initalize modals
		$('.modal').modal();

		$('#user_signout').dropdown({
		      inDuration: 300,
		      outDuration: 225,
		      constrain_width: true, // Does not change width of dropdown to that of the activato
		      gutter: 0, // Spacing from edge
		      belowOrigin: true, // Displays dropdown below the button
		      alignment: 'left' // Displays dropdown with edge aligned to the left of button
		    });

		$('#addClinicForm').on('submit', function(e){
			e.preventDefault();

			// Get Data
			var clinic_name = $('#clinic_name').val();
			var clinic_address = $('#clinic_address').val();
			
			//Check if not null
			if(clinic_name && clinic_address && uid){

				//push data to clinics/uid
				var newClinicRef = clinicsRef.push();
				
				//put value to new clinic key
				newClinicRef.set({
					name : clinic_name,
					address : clinic_address,
					uid : uid
				}).then(function(){
					$('#clinic_name').val('');
					$('#clinic_address').val('');
					Materialize.toast('Clinic Added.', toastDuration);
				});

			}

		});

		function addClinicElement(key, name, address){
			$('#clinicsTable')
				.append(
					$('<tr>').attr('id', key).data('id', key)
						.append( $('<td>').text(name) )
						.append( $('<td>').text(address) )
						.append( $('<td>').addClass('actions')
							.append( $('<i>').addClass('material-icons edit').text('mode_edit').css('width', '50%') )
							.append( $('<i>').addClass('material-icons delete').text('delete') )
						 )
					);

				//Materialize.toast('Clinic Added.', toastDuration);
		}


		function initPagination(){

				var maxPerPage = 10;

				clinicsRef.orderByChild('uid').equalTo(uid).on('value', function(dataSnapshot){

					var dataList = dataSnapshot.val();

					stopPreloader();

					//console.log(dataList[Object.keys(dataList)[1]]);

					var lastPage = Math.ceil(dataSnapshot.numChildren() / maxPerPage);
						lastPage = lastPage	== 0 ? 1 : lastPage;
						console.log(dataList);
					$('#pagination').html('');
					$('#pagination').materializePagination({
					    align: 'left',
					    lastPage:  lastPage,
					    firstPage:  1,
					    useUrlParameter: false,
					    onClickCallback: function(requestedPage){
					        var end = requestedPage * maxPerPage;	
					        var start = (end - maxPerPage) + 1;
					        $('#clinicsTable').html('');
					        if(dataList){
					    		for(i=start;i<=end;i++){
						        	var key = Object.keys(dataList)[i - 1];
						        	var val = dataList[key];
						        	if(key && val){
						        		addClinicElement(key, val.name, val.address );
						        		//addClinicElement(data.key, data.val().name, data.val().address );
						        	}
						        	

						        }
					        }

					    }
					});
				});
		}


		var initiated = false;
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user && !initiated) {
		  	initiated = true;
		    	uid = user.uid;

		    	initPagination();

		    	/*clinicsRef.child(uid).on('child_added', function(data){
					addClinicElement(data.key, data.val().name, data.val().address );
				});*/

		    	clinicsRef.orderByChild('uid').equalTo(uid).on('child_removed', function(data){
					Materialize.toast('Clinic Removed.', toastDuration);
				});
		    	clinicsRef.orderByChild('uid').equalTo(uid).on('child_changed', function(data){
		    		Materialize.toast('Clinic Updated.', toastDuration);
				});
		  }
		});

		$(document).on('click', '.material-icons.delete', function(){
			var tr = $(this).parents('tr');
			var clinic_key = $(tr).data('id');
			if(clinic_key){
				$('#confirmDelete').modal('open');
				$('#doDelete').off('click').on('click', function(){
					$('#confirmDelete').modal('close');
					clinicsRef.child(clinic_key).remove();
				});
			}
		});
		$(document).on('click', '.material-icons.edit', function(){
			var tr = $(this).parents('tr');
			var clinic_key = $(tr).data('id');
			if(clinic_key){
				$('#edit_clinic_id').val(clinic_key);
				$('#edit_clinic_name').val($(tr).find('td').eq(0).text());
				$('#edit_clinic_address').val($(tr).find('td').eq(1).text());
				$('#editClinic').modal('open');
				Materialize.updateTextFields();
			}
		});

		$('#updateClinicForm').on('submit', function(e){
			e.preventDefault();
			var edit_clinic_id = $('#edit_clinic_id').val();
			var edit_clinic_name = $('#edit_clinic_name').val();
			var edit_clinic_address = $('#edit_clinic_address').val();
			if(edit_clinic_id){
				clinicsRef.child(edit_clinic_id).update({ name : edit_clinic_name, address : edit_clinic_address });
			}

		});


	});
	</script>
@endsection