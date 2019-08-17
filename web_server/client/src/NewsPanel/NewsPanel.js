import './NewsPanel.css';

import Auth from '../Auth/Auth';
import NewsCard from '../NewsCard/NewsCard';
import React from 'react';
import _ from 'lodash';

class NewsPanel extends React.Component {
	constructor() {
		super();
		this.state = {news:null, pageNum:1, loadedAll:false};
	}

	componentDidMount() {
		this.loadMoreNews();
		this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
		window.addEventListener('scroll', () => this.handleScroll());
	}

	handleScroll() {
		let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
		if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
			console.log('Loading more news.');
			this.loadMoreNews();
		}
	}

	loadMoreNews() {
		console.log('Actually triggered loading more news.');
		
		if (this.state.loadedAll == true) {
			return;
		}

		const news_url = 'http://' + window.location.hostname
				+ ':8080/news/userId=' + Auth.getEmail()
				+ '&pageNum=' + this.state.pageNum;

		const request = new Request(news_url, { 
			method: 'GET',
			headers: { 
				'Authorization': 'bearer ' + Auth.getToken(),
			}
		});

		fetch(request)
			.then(res => res.json())
			.then(news => {
				if (!news || news.length == 0) {
					this.setState({ loadedAll:true });
				}

				this.setState({
					news: this.state.news ? this.state.news.concat(news) : news,
					pageNum: this.state.pageNum + 1,
				});
			});
	}

	renderNews() {
		const news_list = this.state.news.map(one_news => {
			return(
				<a className='list-group-item' href="#">
					<NewsCard news={one_news} />
				</a>
			);
		});

		return(
			<div className='container-fluid'>
				<div className='list-group'>
					{news_list}
				</div>
			</div>
		);
	}

	render() {
		if (!this.state.news) {
			return(
				<div id='msg-app-loading'>
					Loading...
				</div>
			);
		} else {
			return(
				<div>
					{this.renderNews()}
				</div>
			);
		}
	}
}

export default NewsPanel;