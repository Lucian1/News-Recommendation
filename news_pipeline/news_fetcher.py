import logging
import os
import sys

from newspaper import Article

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

from cloudAMQP_client import CloudAMQPClient

DEDUPE_NEWS_TASK_QUEUE_URL = #TODO: use your own config.
DEDUPE_NEWS_TASK_QUEUE_NAME = #TODO: use your own config.
SCRAPE_NEWS_TASK_QUEUE_URL = #TODO: use your own config.
SCRAPE_NEWS_TASK_QUEUE_NAME = #TODO: use your own config.

SLEEP_TIME_IN_SECONDS = 5

logger_format = '%(asctime)s - %(message)s'
logging.basicConfig(format=logger_format)
logger = logging.getLogger('news_fetcher')
logger.setLevel(logging.DEBUG)

dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)
scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)


def handle_message(msg):
    if msg is None or not isinstance(msg, dict):
        logger.warning('message is broken')
        return
    
    article = Article(msg['url'])
    article.download()
    article.parse()
    msg['text'] = article.text

    # TODO: re-connect if lost.
    dedupe_news_queue_client.sendMessage(msg)


def run():
    while True:
        if scrape_news_queue_client is not None:
            msg = scrape_news_queue_client.getMessage()
            if msg is not None:
                # Parse and process the msg.
                try:
                    handle_message(msg)
                except Exception as e:
                    logger.warning(e)
                    pass
            scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)


if __name__ == '__main__':
    run()