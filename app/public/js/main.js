(function(jQuery){
	function bindEvents(){
		//$('#invoiceForm form').on('submit', postForm);
	};

	function postForm(evt){
		evt.preventDefault();
		var self = $(evt.target).parent();

		$.ajax('api/clients', {
			type : 'post',
			data : $(evt.target).serialize(),
			success: successMessage(self)
		})
	}

	function successMessage($container){
		//var $container = $('#invoiceForm');
		$container.find('form').remove();
		$container.append($('<p />', {
			text: 'Success, your invoice has been submitted',
			class: 'success'
		}))
	}

	$(document).ready(function($) {
		bindEvents();
	});
})($);
