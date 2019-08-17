var client = require('./rpc_client');

// invoke 'add'
client.add(1, 2, function(result) {
    console.assert(result == 3);
});

// invoke 'getNewsSummariesForUser'
client.getNewsSummariesForUser('test_user', 1, function(response) {
   console.assert(response != null); 
});