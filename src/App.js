import React, { Component } from 'react';
import './App.css';
import request from 'superagent';


class App extends Component {
  constructor(){
    super();

    this.state = {
      checked: false,
      show: false,
      city: {},
      country: '',
      weather: '',
      date: '',
      humidity: '',
      temperature: '',
      pressure: '',
      wind: '',
      cities: [{
        id: 1,
        name: 'France'
      },{
        id:2,
        name: 'Canada'
      }]
    }
  }

  checkBtn = (e) => {
    e.preventDefault();
    this.setState({
      checked: true
    })
  }

  updateInput = (e) => {
    e.preventDefault();
    let value = this.refs.inputLocation.value;
    if (value !== '') {
      let newState = this.state;
      newState.city = {id: this.state.cities.length + 1, name: value.replace(value[0], value[0].toUpperCase())};
      this.setState(newState);
      newState.cities.push(newState.city);
      newState.checked = false;
      this.setState(newState);
    }
  }

  weather = (location) => {
     console.log(location);
     const API_URL = `https://api.darksky.net/forecast/7b99d5e089197748e933189d8174655f/${location.lat},${location.lng}`;

     request
        .get(API_URL)
        .then(response => { 
          console.log(response.body.currently);
          let date = new Date(response.body.currently.time * 1000);
          console.log(date);
          this.setState({
            weather: response.body.currently.summary,
            humidity: response.body.currently.humidity,
            pressure: response.body.currently.pressure,
            temperature: response.body.currently.temperature,
            wind: response.body.currently.windSpeed
          })
        });
  }  
  
  getWeather = (e) => {
    e.preventDefault();
    let country = e.target.innerText;
    const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${country}`;

    request
      .get(API_URL)
      .then(function(response){
        let location = {};
        let countryData = response.body.results;
        countryData.forEach(function(data){
          location = data.geometry.location;
        })
        return location;
      })
      .then(this.weather);
    this.setState({
      show: true,
      country: country
    })
   }


  render() {
    let cities = this.state.cities;
    return (
      <div className='app'>
        <header className='app__header'>
          <button className='app__add' onClick={ this.checkBtn }>
            <i className="fa fa-plus-circle"></i>
            New city
          </button>
        </header>
        <div className='grid'>
          <aside className='app__aside'>
            <h1 className='app__title'>All countries</h1>
            {cities.map((city) => {  
              return <a href='#' onClick={ this.getWeather } className='app__country'>{ city.name }</a>
            })}
            { this.state.checked &&
              <form onSubmit={ this.updateInput }> 
                <input autoFocus type='text' ref="inputLocation" placeholder='Location' className='app__input' />
              </form>
            }
          </aside>
          <section className='app__view'>
               <p className='app__view__title'>{ this.state.country }</p>
               <p className='app__view__date'>{ this.state.date }</p>
               <p className='app__view__weather'>{ this.state.weather }</p>
               { this.state.show &&
                 <div className='app__view__data'>
                    <ul>
                      <li><div className="li-data">Humidity</div><div className="span-data">{ this.state.humidity }</div></li>
                      <li><div className="li-data">Pressure</div><div className="span-data">{ this.state.pressure }</div></li>
                      <li><div className="li-data">Temperature</div><div className="span-data">{ this.state.temperature }</div></li>
                      <li><div className="li-data">Wind</div><div className="span-data">{ this.state.wind }</div></li>
                    </ul>
                 </div>
                }
          </section>
  
        </div>
      </div>
    );
  }
}

export default App;
