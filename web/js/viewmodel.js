define(['jquery', 'knockout'], function ($, ko) {
	var LOCATION_REGEX = /, ([^,]+), United Kingdom/;

	function CompanyModel(company, onChange) {
		this._company = company;
		this._onChange = onChange;

		this.name = company.name;
		this.address = company.formatted_address || company.vicinity;

		this.status = ko.observable(company.status);
		this.status.subscribe(this._fireOnChange.bind(this))

		var match = LOCATION_REGEX.exec(this.address);
		var town = match ? match[1] : 'software';

		this.url = 'http://google.co.uk/search?btnI=I&q=' + company.name + '+' + town;
	}

	CompanyModel.prototype = {
		yes: function () {
			this._updateStatus('yes');
		},

		no: function () {
			this._updateStatus('no');
		},

		irrelevant: function () {
			this._updateStatus('irrelevant');
		},

		_updateStatus: function(status) {
			if (this.status() == status) {
				this.status(null);
			} else {
				this.status(status);
			}
		},

		_fireOnChange: function () {
			this._company.status = this.status();
			this._onChange && this._onChange(this._company);
		}
	}

	function ViewModel(onFilterChanged) {
		this.companies = ko.observableArray();
		this.filter = ko.observable();
		this.filter.subscribe(onFilterChanged);
	}

	ViewModel.prototype = {
		updateCompanies: function updateCompanies(companies, onChange) {
			this.companies(companies.map(function (company) { return new CompanyModel(company, onChange); }));
		},

		showAll: function showAll() {
			this.filter('all');
		},

		showPending: function showPending() {
			this.filter('pending');
		}
	};

	return ViewModel;	
});
