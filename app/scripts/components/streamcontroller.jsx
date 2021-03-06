import React, { Component, PropTypes } from 'react';
import Game from './game';

export default class StreamController extends Component {
  constructor(props) {
    super(props);
    this.state = { gamelist: [] };
  }
  // get initial component state
  componentDidMount() {
    this.fetchGameList();
  }
  // fetch list of games from twitch
  fetchGameList() {
    const xml = new XMLHttpRequest();
    xml.open('GET', 'https://api.twitch.tv/kraken/games/top?limit=20', true);
    xml.setRequestHeader('Content-Type', 'application/json');
    xml.send(null);
    xml.onreadystatechange = function onreadystatechange() {
      if (xml.readyState === 4) {
        if (xml.status === 200) {
          this.setState({gamelist: JSON.parse(xml.response).top});
        }
      }
    }.bind(this);
  }
  // add a stream to app state
  addStream(event) {
    if (event.which === 13) {
      event.preventDefault();
      this.props.onAddClick(event.target.value);
      event.target.value = '';
    }
  }

  toggleSideBar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('hidden');
    sidebar.scrollTop = 0;
  }

  render() {
    return (
        <div className="sidebar">
          <button type="button" className="togglebutton" onClick={()=>this.toggleSideBar()}>Streamcontrol</button>
          <div className="sidebar-content">
        <div className="controllbuttons">
        <input type="search" className="search" placeholder="Add Stream" onKeyDown={(event)=>this.addStream(event)}></input>
        <button type="button" className="refreshbutton" onClick={()=>this.fetchGameList()}>
        <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
        </svg></button>
        </div>
        {this.state.gamelist.map((data)=>
        <Game gamename = {data.game.name} viewer={data.viewers} key={data.game._id} onAddClick = {this.props.onAddClick}/>
        )}

        </div>
      </div>
    );
  }
}

StreamController.propTypes = {
  onAddClick: PropTypes.func.isRequired
};
