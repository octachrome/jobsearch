requirejs.config({
	baseUrl: 'js',

	paths: {
		jquery: '../lib/jquery',
		knockout: '../lib/knockout-latest.debug'
	}
});

requirejs(['jquery', 'knockout', 'viewmodel'], function ($, ko, ViewModel) {
	function saveCompany(company) {
		$.ajax('/rest/companies/' + company._id, {
			type: 'POST',
			data: JSON.stringify(company),
			contentType: 'application/json'
		});
	}

	function loadCompanies() {
		var filter = vm.filter();

		$.get('/rest/companies?filter=' + filter)
			.done(function (companies) {
				vm.updateCompanies(companies, saveCompany);
			});
	}

	var vm = new ViewModel(loadCompanies);
	ko.applyBindings(vm);

	vm.filter('all');
});
