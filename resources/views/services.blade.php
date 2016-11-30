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
    <li><a href="{{ url('doctor/clinics') }}" class="waves-effect">Clinics</a></li>
    <li class="active"><a href="{{ url('doctor/services') }}" class="waves-effect">Services</a></li>
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
          <h4 class="panel-title">Services</h4>  <a class="waves-effect waves-light btn light-blue darken-4 right" href="#addService">ADD</a>
        </div>
        <div class="row">
          <table class="bordered highlight styleTable">
              <thead>
                <tr>
                    <th data-field="id">Name</th>
                    <th data-field="name">Price</th>
                    <th data-field="name">Duration</th>
                    <th data-field="name">Clinic</th>
                    <th data-field="action" width="50"></th>
                </tr>
              </thead>

              <tbody id="serviceTable">
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


<div id="addService" class="modal" style="max-width: 600px;">
    <form action="" id="addServiceForm">
      <div class="modal-content">
        <h5>Add Service</h5>
        <div class="row">
              <div class="row">
                <div class="input-field">
                  <select id="addServiceSelectClinic">
                        <option value="" disabled selected>Choose a clinic</option>
                    <!-- 
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option> -->
                  </select>
                  <label>Clinic</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field">
                  <input id="service_name" type="text" class="validate">
                  <label for="service_name">Service Name</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field">
                  <input id="service_price" type="text" class="validate">
                  <label for="service_price">Service Price</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field">
                  <input id="service_duration" type="number" class="validate">
                  <label for="service_duration">Service Duration (In Minutes)</label>
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
  <div id="editService" class="modal" style="max-width: 600px;">
    <form action="" id="updateServiceForm">
      <div class="modal-content">
        <h5>Edit Service</h5>
        <div class="row">
              <div class="row">
                <div class="input-field">
                  <select id="editServiceSelectClinic">
                        <option value="" disabled selected>Choose a clinic</option>
                    <!-- 
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option> -->
                  </select>
                  <label>Clinic</label>
                </div>
              </div>

              <div class="row">
                <div class="input-field">
                  <input id="edit_service_name" type="text" class="validate">
                  <label for="edit_service_name" class="active">Service Name</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field">
                  <input id="edit_service_price" type="text" class="validate">
                  <label for="edit_service_price" class="active">Service Price</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field">
                  <input id="edit_service_duration" type="number" class="validate">
                  <label for="edit_service_duration">Service Duration (In Minutes)</label>
                </div>
              </div>

              <input type="hidden" id="edit_service_id">
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

      if(user.photoURL){

        var storage = firebase.storage();

        var storageRef = storage.ref();

        storageRef.child(user.photoURL).getDownloadURL().then(function(url){
          if(url){
            $('#profilePic').attr('src', url);
          }
        }).catch(function(error){
          console.log('error in storage');
          console.log(error);
        });
      }
      uid = user.uid;

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

  //Firebase reference for clinics
  var servicesRef = database.ref("booking").child('services');
  var clinicsRef = database.ref("booking").child('clinics');

  $(document).on('ready', function(){


    $('.modal').modal();

     $('select').material_select();

    $('#user_signout').dropdown({
          inDuration: 300,
          outDuration: 225,
          constrain_width: true, // Does not change width of dropdown to that of the activato
          gutter: 0, // Spacing from edge
          belowOrigin: true, // Displays dropdown below the button
          alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });

        $('#addServiceForm').on('submit', function(e){
          e.preventDefault();

          // Get Data
          var service_name = $('#service_name').val();
          var service_price = $('#service_price').val();
          var service_duration = $('#service_duration').val();
          var clinic_id = $('#addServiceSelectClinic').val();

          if(service_name && service_price && uid && clinic_id && service_duration){

            var newServiceRef = servicesRef.push();


            newServiceRef.set({
              name : service_name,
              price : service_price,
              uid : uid,
              clinic_id : clinic_id,
              time : service_duration 
            }).then(function(){

              var serviceKey = newServiceRef.key;

              var updateData = {};

              updateData[serviceKey] = true;              

              clinicsRef.child(clinic_id).child('services').update(updateData).then(function(){
                  $('#service_name').val('');
                  $('#service_price').val('');
                  Materialize.toast('Service Added.', toastDuration);
              });

            });

          }

        });


        function addServiceElement(key, name, price, duration, clinic_id){

          var time = duration ? parseInt(duration) : 0;
          var tr =  $('<tr>').attr('id', key).data('id', key).data('clinic_id', clinic_id)
                .append( $('<td>').text(name) )
                .append( $('<td>').text(price) )
                .append( $('<td>').data('duration', time).text(time+" mins") )
                .append( $('<td>').addClass('clinic') )
                .append( $('<td>').addClass('actions')
                  .append( $('<i>').addClass('material-icons edit').text('mode_edit').css('width', '50%') )
                  .append( $('<i>').addClass('material-icons delete').text('delete') )
                 );

          $('#serviceTable')
            .append(tr);


            var clinicName = $('#addServiceSelectClinic').find('option[value="'+clinic_id+'"]').text();

            if(clinicName){
              tr.find('.clinic').text(clinicName);
            }

            /* clinicsRef.child(clinic_id).once('value', function(dataSnapshot){
              console.log(dataSnapshot.val().name);
                        tr.find('.clinic').text(dataSnapshot.val().name);
                      });*/



            //Materialize.toast('Clinic Added.', toastDuration);
        }


        function initPagination(){

        var maxPerPage = 10;

        clinicsRef.orderByChild('uid').equalTo(uid).once('value', function(dataSnapshot){

            //<option value="" disabled selected>Choose your option</option>
            var addServiceSelectClinic = $('#addServiceSelectClinic').html('');
            var editServiceSelectClinic = $('#editServiceSelectClinic').html('');
            addServiceSelectClinic.append( $('<option value="" disabled selected>').text('Choose a clinic') );
            editServiceSelectClinic.append( $('<option value="" disabled selected>').text('Choose a clinic') );


            dataSnapshot.forEach(function(childSnap){
              addServiceSelectClinic.append( $('<option value="'+childSnap.key+'">').text(childSnap.val().name) );
              editServiceSelectClinic.append( $('<option value="'+childSnap.key+'">').text(childSnap.val().name) );
            });
            $(addServiceSelectClinic).material_select();
            $(editServiceSelectClinic).material_select();

            startServices();

        });

        function startServices(){

          servicesRef.orderByChild('uid').equalTo(uid).on('value', function(dataSnapshot){

            var dataList = dataSnapshot.val();

            //console.log(dataList[Object.keys(dataList)[1]]);

            stopPreloader();

            var lastPage = Math.ceil(dataSnapshot.numChildren() / maxPerPage);
              lastPage = lastPage == 0 ? 1 : lastPage;
            $('#pagination').html('');
            $('#pagination').materializePagination({
                align: 'left',
                lastPage:  lastPage,
                firstPage:  1,
                useUrlParameter: false,
                onClickCallback: function(requestedPage){
                    var end = requestedPage * maxPerPage; 
                    var start = (end - maxPerPage) + 1;
                    $('#serviceTable').html('');
                    if(dataList){
                    for(i=start;i<=end;i++){
                        var key = Object.keys(dataList)[i - 1];
                        var val = dataList[key];
                        if(key && val){
                          addServiceElement(key, val.name, val.price, val.time, val.clinic_id );
                          //addClinicElement(data.key, data.val().name, data.val().address );
                        }
                        

                      }
                    }

                }
            });

          });
        }

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

            servicesRef.orderByChild('uid').equalTo(uid).on('child_removed', function(data){
            Materialize.toast('Service Removed.', toastDuration);
          });
            servicesRef.orderByChild('uid').equalTo(uid).on('child_changed', function(data){
              Materialize.toast('Service Updated.', toastDuration);
          });
        }
      });

          $(document).on('click', '.material-icons.delete', function(){
          var tr = $(this).parents('tr');
          var service_key = $(tr).data('id');
          var clinic_id = $(tr).data('clinic_id');
          if(service_key){
            $('#confirmDelete').modal('open');
            $('#doDelete').off('click').on('click', function(){
              $('#confirmDelete').modal('close');
              servicesRef.child(service_key).remove();
              clinicsRef.child(clinic_id).child("services").child(service_key).remove();
            });
          }
        });
        $(document).on('click', '.material-icons.edit', function(){
          var tr = $(this).parents('tr');
          var service_key = $(tr).data('id');
          var clinic_id = $(tr).data('clinic_id');
          if(service_key){
            $('#edit_service_id').val(service_key);
            $('#edit_service_name').val($(tr).find('td').eq(0).text());
            $('#edit_service_price').val($(tr).find('td').eq(1).text());
            $('#edit_service_duration').val($(tr).find('td').eq(2).data('duration'));
            $('#editServiceSelectClinic').val(clinic_id);
            $('#editService').modal('open');
            $('#editServiceSelectClinic').material_select();
            Materialize.updateTextFields();
          }
        });

        $('#updateServiceForm').on('submit', function(e){
            e.preventDefault();
            var edit_service_id = $('#edit_service_id').val();
            var edit_service_name = $('#edit_service_name').val();
            var edit_service_price = $('#edit_service_price').val();
            var edit_service_duration = $('#edit_service_duration').val();
            var edit_clinic_id = $('#editServiceSelectClinic').val();
            if(edit_service_id){
              servicesRef.child(edit_service_id).update({ name : edit_service_name, price : edit_service_price, time : edit_service_duration, clinic_id : edit_clinic_id });
              clin
            }

          });

  });
  </script>
  </script>
  @endsection