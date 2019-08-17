import jsonrpclib

URL = 'http://localhost:5050/'

client = jsonrpclib.ServerProxy(URL)

def getPreferenceForUser(userId):
    return client.getPreferenceForUser(userId)
