var express = require('express');
var rpc_client = require('../rpc_client/rpc_client');
var router = express.Router();

/* GET news. */
router.get('/userId=:userId&pageNum=:pageNum', function(req, res, next) {
	console.log('Fetching news...');
	userId = req.params['userId'];
	pageNum = req.params['pageNum'];

	rpc_client.getNewsSummariesForUser(userId, pageNum, function(news) {
		res.json(news);
	});
});

/* Lpg news click. */
router.get('/userId=:userId&newsId=:newsId', function(req, res, next) {
	console.log('Logging news click...');
	userId = req.params['userId'];
	newsId = req.params['newsId'];

	rpc_client.logNewsClickForUser(userId, newsId);
	res.status(200);
});

module.exports = router;
