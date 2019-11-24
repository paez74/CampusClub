var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();
var chaiHttp = require('chai-http');
var app = require('../app');
chai.use(chaiHttp);

var functionPromise = function() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, 300);
	});
};

describe('promises', function() {
	it('example should return true', function() {
		return functionPromise().should.eventually.be.true;
	});
});

describe('App', () => {
	describe('GET /', () => {
		// Test to app version
		it('should get app version', (done) => {
			chai
				.request(app)
				.get('/api/version')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					done();
				});
		});
	});
});
