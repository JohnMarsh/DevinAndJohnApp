$(function(){

	var COUNTRIES = ["America", "Canada", "Mexico", "Russia", "France"];
	
	$("#birthday").datepicker({dateFormat: 'yy-mm-dd'});
        
    $("#country").autocomplete({
            source: COUNTRIES
    });

    $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
        
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

