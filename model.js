var mongodb = require('mongodb-lite');

exports.getCompanies = function getCompanies(req, res) {
	var server = new mongodb.Server('mongodb://localhost:27017');
	var db = server.getDatabase('test');
	var jobs = db.getCollection('jobs');

	var selector = {};

	var filter = req.query.filter;
	if (filter == 'pending') {
		selector = {
			$or: [
				{ status: { $exists: false } },
				{ status: null }
			]
		};
	} else if (filter != 'all') {
		selector = {
			status: filter
		};
	}

	jobs.find(selector, function (err, docs) {
		res.send(docs);
		server.close();
	});
};

exports.saveCompany = function saveCompany(req, res) {
	var server = new mongodb.Server('mongodb://localhost:27017');
	var db = server.getDatabase('test');
	var jobs = db.getCollection('jobs');

	var id = req.body._id;

	jobs.update({_id: id}, req.body, function (err) {
		if (err) {
			console.error(err);
			res.send(500, error);
		} else {
			res.send(200, {});
		}
		server.close();
	});
}
