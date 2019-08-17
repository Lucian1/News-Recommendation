""" Backend service """
import json
import logging
import operations
import os
import sys

from bson.json_util import dumps
from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer

# import utils dir.
sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))

import mongodb_client  # pylint: disable=import-error, wrong-import-position

SERVER_HOST = 'localhost'
SERVER_PORT = 4040

LOGGER_FORMAT = '%(asctime)s - %(message)s'
logging.basicConfig(format=LOGGER_FORMAT)
LOGGER = logging.getLogger('backend_server')
LOGGER.setLevel(logging.DEBUG)


def add(num1, num2):
    """ Test method. """
    LOGGER.debug("add is called with %s and %s", str(num1), str(num2))
    return operations.add(num1, num2)

def get_one_news():
    """ Test method to get one news. """
    LOGGER.debug('getOneNews is called.')
    return operations.get_one_news()

def get_news_summaries_for_user(user_id, page_num):
    """ Get news summaries for a user with a page number. """
    LOGGER.debug('get_news_summaries_for_user is called with %s and %s', user_id, str(page_num))
    return operations.get_news_summaries_for_user(user_id, page_num)

def log_news_click_for_user(user_id, news_id):
    """ Log news click for a user with a news id. """
    LOGGER.debug('log_news_click_for_user is called with %s and %s', user_id, news_id)
    return operations.log_news_click_for_user(user_id, news_id)


# Threading RPC server.
RPC_SERVER = SimpleJSONRPCServer((SERVER_HOST, SERVER_PORT))
RPC_SERVER.register_function(add, 'add')
RPC_SERVER.register_function(get_one_news, 'getOneNews')
RPC_SERVER.register_function(get_news_summaries_for_user, 'getNewsSummariesForUser')
RPC_SERVER.register_function(log_news_click_for_user, 'logNewsClickForUser')


LOGGER.info("Starting RPC server on %s:%d", SERVER_HOST, SERVER_PORT)

RPC_SERVER.serve_forever()
