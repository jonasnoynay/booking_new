<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('find-clinic');
});


Route::get('/clinic/{name}', function () {
    return view('home');
});


Route::get('/doctor/', function () {
    return view('doctor-login');
});

Route::get('/doctor/dashboard', function () {
    return view('dashboard');
});
Route::get('/doctor/clinics', function () {
    return view('clinics');
});
Route::get('/doctor/services', function () {
    return view('services');
});
Route::get('/doctor/profile', function () {
    return view('profile');
});
