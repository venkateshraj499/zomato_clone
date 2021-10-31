import background from '../Images/homeimg.jpg'
import QuickSearch from "./QuickSearch";
import axios from 'axios'
import '../Styles/Home.css' 
import {useEffect, useState} from 'react';
import { useHistory } from "react-router";

function Homepage(){

    const [locations, setLocations] = useState([]);
    const [quickSearch, setQuickSearch] = useState([]);
    const [locId, setLocId] = useState(undefined);
    const [restaurantList, setRestaurantList] = useState([])
    const [searchText, setSearchText] = useState(undefined)
    const [suggestions,setSuggestions] = useState([])
    
    let history = useHistory();

    let locationChange =(event) =>{
        setLocId(event.target.value)
        console.log('changed location')
              
    }

    function fetchData(){
        if (locId!==undefined){
            axios({
                url: `https://wicked-village-80388.herokuapp.com/restaurants/${locId}`,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => {
                   setRestaurantList(res.data.restaurants)
                })
                .catch()        
        }
        axios({
            url: 'https://wicked-village-80388.herokuapp.com/locations',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
           .then(res=>{
            setLocations(res.data.locations)
        })
        .catch(error=>{
            console.log(error)
        })

        axios({
            url: 'https://wicked-village-80388.herokuapp.com/mealtypes',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
           .then(res=>{
            setQuickSearch(res.data.mealTypes)
        })
        .catch(error=>{
            console.log(error)
        })
    }
   
    const handleInputChange = (event) => {
        const searchText = event.target.value;

        let searchRestaurants = [];
        if (searchText) {
            searchRestaurants = restaurantList.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        setSuggestions(searchRestaurants)
        setSearchText(searchText)
        
    }

    const selectedText = (resObj) => {
        history.push(`/details?restaurant=${resObj._id}`);
    }

    const renderSuggestions = () => {

        if (suggestions.length === 0 && searchText === "") {
            return <ul className="suggestions">
                <li>No Search Results Found</li>
            </ul>
        }
        return (
            <ul   >
                {
                    suggestions.map((item, index) => (<li className="suggestions" key={index} onClick={() => selectedText(item)}>{`${item.name} -   ${item.locality},${item.city}`}</li>))
                }
            </ul>
        );
    }

    useEffect(() => {
        
        fetchData();
    },[locId])

    return(
        <div>
            <div>
         
                
                    <img class="homeImage"src={background} alt="no-ie" height="500px" />

                    <div class = "top_elements">
                        <div class="logo_top">V!</div>
                        <div class="heading_top">Find the best restaurants, cafés, and bars</div>
                        <select class="Homedd" onChange={(e)=>{locationChange(e)}}>
                            <option value="0">Select a location</option>

                                {locations.map((data,i)=>{
                                    return <option key={i+1} value={data.location_id}>{data.name+', '+data.city}</option>
                                })}
                                
                        </select>
                        <div id="notebooks">
                          <input class="input" type="text"placeholder="Search for a restaurant" onChange={handleInputChange} />
                           {renderSuggestions()}
                        </div>      
                    </div>

                    <div className="Qsheading">Quick Searches</div>
                    <div className="sub-heading">Discover restaurants by type of meal</div>
                </div>
            {/*<Wallpaper locationsData = {locations}/>*/}
            <QuickSearch quickSearchData = {quickSearch} locId={locId}/>
        </div>
    )
}

export default Homepage;