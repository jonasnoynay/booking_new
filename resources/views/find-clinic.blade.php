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
</style>
@endsection

@section('content')

 <div class="row">
        <div class="col s12 m6">
          <div class="card teal darken-1">
            <div class="card-content white-text">
              <span class="card-title">Search clinic or type address</span>
     		<input type="text" id="searchClinicBox">
     		<button type="button" class="teal darken-3" id="search">Search</button>
          </div>
        </div>
      </div>

@endsection

@section('custom-js')
<script>
	$(document).on('ready', function(){

		var searchText = "";

		$('#searchClinicBox').on('keyup', function(){
			searchText = $(this).val();
		});

		$('#search').on('click', function(){

			if(searchText){

				window.location.href="/clinic/"+searchText;
			}else{
				alert('Please input a keyword');
			}

		});


	});
</script>
@endsection