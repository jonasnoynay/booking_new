<html>
<head>
    <title>Booking System - @yield('title')</title>


   <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
<script src="https://www.gstatic.com/firebasejs/3.6.1/firebase.js"></script>
<script>
  // Initialize Firebase
 /* var config = {
    apiKey: "AIzaSyATaM_gG4MxfpNxPHcJ0J1V8o7oh2Di7_A",
    authDomain: "laravel-firebase-dd443.firebaseapp.com",
    databaseURL: "https://laravel-firebase-dd443.firebaseio.com",
    storageBucket: "laravel-firebase-dd443.appspot.com",
    messagingSenderId: "213828532935"
  };
  firebase.initializeApp(config);*/

   // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDGiQJynepFHHklFA7pnkY0y43TcsG72r0",
    authDomain: "booking-system-78210.firebaseapp.com",
    databaseURL: "https://booking-system-78210.firebaseio.com",
    storageBucket: "booking-system-78210.appspot.com",
    messagingSenderId: "1018659616316"
  };
  firebase.initializeApp(config);
</script>


    @yield('auth-js')


     	<link rel="stylesheet" href="{{ asset('css/materialize.min.css') }}">
     	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
		<link rel="stylesheet" href="{{ asset('css/style.css') }}">

		@yield('custom-css')

	
    </head>

	<body>
		@yield('nav')
		@yield('content')
		</body>


	<script type="text/javascript" src="{{ asset('js/materialize.min.js') }}"></script>
	
	<script>
	$('#signout, #sidebar_signout').on('click', function(){
			firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		}, function(error) {
		  	console.log(error);
		});
	});

	function stopPreloader(){
        $('.preloader-container').remove();
      }
	</script>

	@yield('custom-js')
		
	

	</html>