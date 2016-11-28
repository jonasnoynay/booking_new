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
    <li><a href="{{ url('doctor/services') }}" class="waves-effect">Services</a></li>
    <li><div class="divider"></div></li>
    <li><a class="subheader">My Account</a></li>
    <li class="active"><a class="waves-effect" href="{{ url('doctor/profile') }}">My Profile</a></li>
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
          <h4 class="panel-title">Update Profile</h4>
        </div>

        <div class="row">
          <div class="row">
             <p>Personal Information</p>
          </div>
             <div class="row">
              <form action="" id="editProfileForm">
                <div class="row">

                <div class="row">
                  <div class="input-field updatePicWrapper">
                    <img src="http://materializecss.com/images/yuna.jpg" alt="" id="profilePreview">
                    <input type="hidden" id="profile_picture">
                    <input type="file" class="updatePicFile" id="profileFileUpload">
                    </div>
                  </div>

                  <div class="input-field">
                    <input id="fullname" type="text" class="validate">
                    <label for="fullname">Fullname</label>
                  </div>
                    <div class="input-field">
                    <input id="contact_no" type="text" class="validate">
                    <label for="contact_no">Contact Number</label>
                  </div>
                  <div class="input-field">
                    <input id="address" type="text" class="validate">
                    <label for="address">Address</label>
                  </div>
                  <!-- <div class="file-field input-field">
                    <div class="btn light-blue darken-3">
                      <span>File</span>
                      <input type="file">
                    </div>
                    <div class="file-path-wrapper">
                      <input class="file-path validate" type="text">
                      <input type="hidden" id="profile_picture">
                    </div>
                  </div> -->
              </div>
              <div class="row">
                  <button type="submit" class="waves-effect waves-light btn light-blue darken-4">Done</button>
              </div>
              </form>
             </div>


              <p>Change Password</p>
              <div class="row">
                <form action="" id="changePasswordForm">
                    <div class="input-field">
                      <input id="old_password" type="password" class="validate">
                      <label for="old_password">Old Password</label>
                    </div>

                    <div class="row">
                      <div class="input-field">
                        <input id="new_password" type="password" class="validate">
                        <label for="new_password">New Password</label>
                      </div>
                    </div>

                    <div class="row">
                      <div class="input-field">
                        <input id="confirm_new_password" type="password" class="validate">
                        <label for="confirm_new_password">Confirm New Password</label>
                      </div>
                    </div>
                    <button type="submit" class="waves-effect waves-light btn light-blue darken-4">Change Password</button>
                </form>
              </div>
      </div>
        </div>
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
      $('#profile_picture').val(user.photoURL);
      uid = user.uid;

      if(user.photoURL){
          storageRef.child(user.photoURL).getDownloadURL().then(function(url){
              if(url){
                  $('#profilePic').attr('src', url);
                  $('#profilePreview').attr('src', url);
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
  
  <script type="text/javascript">

  var database = firebase.database();
  var toastDuration = 3000;
  var storageRef = firebase.storage().ref();

  var usersRef = database.ref('users');

  $(document).on('ready', function(){


      $('#editProfileForm').on('submit', function(e){
        e.preventDefault();

          var fullname = $('#fullname').val();
          var contact_no = $('#contact_no').val();
          var email_address = $('#email_address').val();
          var address = $('#address').val();
          var profile_picture = $('#profile_picture').val();
          if($('#profileFileUpload').val() != ""){
            var file = $('#profileFileUpload').prop('files')[0];

            if(file){
              var uploadRef = storageRef.child('uploads/'+file.name);
                uploadRef.put(file).then(function(snap){
                  profile_picture = uploadRef.fullPath;
                  doUpdate();
                });
            }
          }else{
            doUpdate();
          }

          
          
        function doUpdate(){
            var user = firebase.auth().currentUser;
            user.updateProfile({
              displayName : fullname,
              photoURL : profile_picture
            }).then(function(){

              var userRef = usersRef.child(user.uid);
                userRef.set({
                  contact_no : contact_no,
                  address : address
                }, function(){

                  if(profile_picture){
                    storageRef.child(profile_picture).getDownloadURL().then(function(url){
                      if(url){
                        $('#profilePic').attr('src', url);
                      }
                    }).catch(function(error){
                      console.log(error);
                    });
                  }


                   /*storageRef.child(user.photoURL).getDownloadURL().then(function(url){
                      if(url){
                          $('#profilePic').attr('src', url);
                          $('#profilePreview').attr('src', url);
                        }
                  }).catch(function(error){
                      console.log(error);
                    });*/
                  Materialize.toast('Profile Info Updated.', toastDuration);
                });

            });
          }

      });


/*profilePreview*/

$('#profileFileUpload').on('change', function(){

    if(this.files && this.files[0]){
      var reader = new FileReader();
      reader.onload = function(e){
          $('#profilePreview').attr('src', e.target.result);
      }
      reader.readAsDataURL(this.files[0]);
    }
});


      $('#changePasswordForm').on('submit', function(e){
        e.preventDefault();
        var old_password = $('#old_password').val();
        var new_password = $('#new_password').val();
        var confirm_new_password = $('#confirm_new_password').val();
        if(new_password == confirm_new_password){
          // proceed to update password
        }
      });

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          uid = user.uid;
          var userRef = usersRef.child(user.uid);
          userRef.once('value', function(snap){
            console.log(snap.val());
              if(snap.val()){
                  $('#contact_no').val(snap.val().contact_no);
                  $('#address').val(snap.val().address);
              }
              $('#fullname').val(user.displayName);
              stopPreloader();
              Materialize.updateTextFields();
          });

        }else{
          window.location.href="/";
        }
      });

  });


  </script>

@endsection