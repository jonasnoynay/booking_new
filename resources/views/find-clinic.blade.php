@extends('layout')


@section('custom-css')

<style>
	
	input[type="text"]{
		border: 0;
	    background: #fff;
	    color: #000;
	    font-size: 20px;
	}

	button{
		border: 0;
	    padding: 4px;
	    font-size: 24px;
	    max-width: 181px;
	    width: 100%;
	    margin: auto;
    	display: block;
	}

	.searchbox{
		position: absolute;
	    width: 100%;
	    top: 45px;
	    margin: 0;
	    display: none;
	}
	.searchbox.active{
		display: block;
	}

	.searchbox li{
		color:#000;
	}

	.searchbox li:hover{
		background: #b2dfdb;
	}

	.remove{
		position: absolute;
    right: 0;
    top: 0;
    padding: 2px 10px;
    font-size: 28px;
    color: #000;
    display: none;
	}

	.remove.active{
		display: block;
	}


</style>
@endsection

@section('content')

 <div class="row">
        <div class="col s12 m6">
          <div class="card teal darken-1">
            <div class="card-content white-text">
              <span class="card-title">Search clinic or type address</span>
     		<div style="position:relative">
     			<input type="text" id="searchClinicBox">
     			<a href="#" class="remove">X</a>
	     		<ul class="collection searchbox">
			     <!--  <li class="collection-item" value="ha">Alvin</li>
			     <li class="collection-item" value="he">Alvin</li>
			     <li class="collection-item" value="hi">Alvin</li>
			     <li class="collection-item" value="ho">Alvin</li> -->
			    </ul>
     		</div>
     		<button type="button" class="teal darken-3" id="search">Search</button>
          </div>
        </div>
      </div>

@endsection

@section('custom-js')
<script>


var database = firebase.database();

var clinicsRef = database.ref("booking").child("clinics");

	$(document).on('ready', function(){

		var clinic_id = "";

		var intervalSearch;

		$('#searchClinicBox').on('focusin', function(){
			$('.searchbox').addClass('active');
		});
		$('#searchClinicBox').on('focusout', function(e){
			$('.searchbox').removeClass('active');
		});


		$('.searchbox').on('mousedown', 'li', function(){

			$('#searchClinicBox').val($(this).text());

			clinic_id = $(this).attr('value');
			
		});

		$('#searchClinicBox').on('keyup', function(){
			var search_val = $(this).val();
			clearInterval(intervalSearch);
			if(search_val){

				$('.remove').addClass('active');

				intervalSearch = setTimeout(function(){

					clinicsRef.orderByChild('name')
	                 .startAt(search_val)
	                 .endAt(search_val+"\uf8ff")
	                 .once("value").then(function(snap){

	                 	clearSearch();

	                 	if(snap.val()){
	                 		snap.forEach(function(childSnap){
	                 			//console.log(childSnap.val().name);
	                 			$('.searchbox').append( $('<li>').addClass('collection-item').attr('value', childSnap.key).text(childSnap.val().name) );
	                 		});
	                 	}
	                 });
				}, 200);

			
			}else{
				$('.remove').click();
				clearSearch();
			}
			

		});

		$('.remove').on('click', function(){
			$('.remove').removeClass('active');
			$('.searchbox').html('');
			$('#searchClinicBox').val('');
			clinic_id = "";
		});

		function clearSearch(){
			$('.searchbox').html('');
		}

		$('#search').on('click', function(){

			if(clinic_id){

				window.location.href="/clinic/"+clinic_id;
			}else{
				alert('Please input a keyword');
			}

		});


	});
</script>
@endsection