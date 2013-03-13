$(function(){

	var COUNTRIES = ["America", "Canada", "Mexico", "Russia", "France"];
	
	$("#birthday").datepicker();
        
    $("#country").autocomplete({
            source: COUNTRIES
    });
        
    $('form').validate({
		onKeyup : true,
		eachValidField : function() {

			$(this).closest('div').removeClass('error').addClass('success');
		},
		eachInvalidField : function() {

			$(this).closest('div').removeClass('success').addClass('error');
		}
	});


});

