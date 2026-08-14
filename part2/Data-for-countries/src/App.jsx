import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryInfo = ({ country, weather }) => {
  console.log(weather)
  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} width="200" />

      <h2>Weather in {country.capital}</h2>

      {weather && (
        <div>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

const ShowCountries = ({
  searchedCountries,
  setSelectedCountry,
  selectedCountry,
  weather
}) => {

  if (searchedCountries.length === 0) {
    return null
  }

  if (searchedCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (searchedCountries.length === 1) {
    return (
      <CountryInfo
        country={searchedCountries[0]}
        weather={weather}
      />
    )
  }

  return (
    <div>
      {!selectedCountry &&
        searchedCountries.map(country => (
          <div key={country.cca3}>
            {country.name.common}{' '}
            <button onClick={() => setSelectedCountry(country)}>
              Show
            </button>
          </div>
        ))}

      {selectedCountry && (
        <CountryInfo
          country={selectedCountry}
          weather={weather}
        />
      )}
    </div>
  )
}

const SearchFilter = ({
  searchValue,
  handleSearch,
  handleSearchFocus
}) => {
  return (
    <div>
      find countries{' '}
      <input
        value={searchValue}
        onChange={handleSearch}
        onFocus={handleSearchFocus}
      />
    </div>
  )
}

const App = () => {
  const [searchValue, setSearchValue] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (!selectedCountry) {
      return
    }

    const lat = selectedCountry.capitalInfo.latlng[0]
    const lon = selectedCountry.capitalInfo.latlng[1]

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`
      )
      .then(response => {
        setWeather(response.data)
      })
  }, [selectedCountry])

  const handleSearchFocus = () => {
    setSelectedCountry(null)
    setWeather(null)
  }

  const handleSearch = (event) => {
    setSearchValue(event.target.value)
  }

  const searchedCountries = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  )

  return (
    <div>
      <SearchFilter
        handleSearch={handleSearch}
        handleSearchFocus={handleSearchFocus}
        searchValue={searchValue}
      />
      <ShowCountries
        searchedCountries={searchedCountries}
        setSelectedCountry={setSelectedCountry}
        selectedCountry={selectedCountry}
        weather={weather}
      />
    </div>
  )
}

export default App