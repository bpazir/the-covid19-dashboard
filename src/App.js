import React,{useState, useEffect} from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import { sortData, prettyPrintStat } from "./util";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table'
import LineGraph from './LineGraph'
import Footer from './Footer';
import './App.css';
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
import Widgets from "./Widgets";

function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState("worldWide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData] =useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    });
  }, []);

  useEffect(()=>{
    const getCountriesData = async () => {
    	await fetch ("https://disease.sh/v3/covid-19/countries")
    		.then((response)=>response.json())
    		.then((data)=>{
    			const countries=data.map((country) => ({
						name:country.country,
						value:country.countryInfo.iso2
      		}));
    		let sortedData=sortData(data)
				setTableData(sortedData);
				setMapCountries(data);
				setCountries(countries);
     	});
    };
    getCountriesData();
	}, []);

  const onCountryChange =async (e) => {
    const countryCode=e.target.value;
		
		const url = 
			countryCode ==="worldWide" 
    		? 'https://disease.sh/v3/covid-19/all' 
    		:`https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
			.then(response=>response.json())
			.then(data=>{
				setCountry(countryCode);
				setCountryInfo(data)
				setMapCenter(data.countryInfo?.lat ? [data.countryInfo.lat, data.countryInfo.long] : { lat: 34.80746, lng: -40.4796 })
    	});
 	 };

  return (
    <div className="app">
      <div className="app_left">
      <div className="app_header">
        <h1>COVID-19 Dashboard</h1>
      <FormControl className="app__dropdown">
				<Select 
					variant="outlined"
          onChange={onCountryChange}
          value={country}
        >
          <MenuItem value="worldWide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>

  <div className="app__stats">
    <InfoBox
      isRed
      active={casesType === "cases"}
      onClick={(e) => setCasesType("cases")}
      title="Cases"
      total={numeral(countryInfo.cases).format("0,0")}
    />
    <InfoBox
      title="Recovered"
      active={casesType === "recovered"}
      onClick={(e) => setCasesType("recovered")}
      total={numeral(countryInfo.recovered).format("0,0")}
    />
    <InfoBox
      isRed
      active={casesType === "deaths"}
      onClick={(e) => setCasesType("deaths")}
      title="Deaths"
      total={numeral(countryInfo.deaths).format("0,0")}
    />
  </div>
    <Map
      casesType={casesType}
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}
    />

  </div>

  <div className="app__right">
    <Card >
      <CardContent>
        <h3>Total Cases by Country</h3>
        <Table countries={tableData}/>
          <h3 className="app__graphTitle">Worldwide {casesType}</h3>
        <LineGraph className="app__graph" casesType={casesType}/>
      </CardContent>
    </Card>
    <Footer/>
  </div>
  <div className="app__middle">
    <Widgets/>
  </div>

    </div>
  );
}

export default App;