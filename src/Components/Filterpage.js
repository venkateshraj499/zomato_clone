import '../Styles/Filter.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import nodata from "../Images/noData.png"
import {useLocation} from "react-router-dom";
import queryString from 'query-string'
import { useHistory } from "react-router";



function FIlterpage () {
    // location, cuisine, mealtype, lcost, hcost, sort, page 
    let history = useHistory();
    const search = useLocation().search;
    const qs = queryString.parse(search);
    const locId = parseInt(qs.location)

    const [restaurants , setRestaurant] = useState([]);
    const [locations, setLocations] = useState([]);
    const [pages, setPages] = useState([]);
    const [location, setLocation] = useState(locId?locId:undefined);
    const [cuisine, setCuisine] = useState([]);
    const [lcost, setLcost] = useState(undefined);
    const [hcost, setHcost] = useState(undefined);
    const [sort, setSort] = useState(undefined);
    const [page, setPage] = useState(1)
    const [collapseOpen, setCollapse] = useState(true)
    

    function fetchData(){
          
        const filterObject ={
            mealtype: parseInt(qs.mealtype),
            location: location,
            cuisine:cuisine.length>0 ? cuisine : undefined,
            lcost:lcost,
            hcost:hcost,
            sort:sort,
            page:page
        }
      console.log(filterObject)
      axios({
            url: 'https://lit-plains-73441.herokuapp.com/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObject
        })
        .then(res =>{
            setRestaurant(res.data.restaurants)
            setPages(res.data.pageCount)
        })
        .catch(error=>{
            console.log(error)
        })   

        axios({
            url: 'https://lit-plains-73441.herokuapp.com/locations',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
           .then(res=>{
            setLocations(res.data.locations)
        })
        .catch(error=>{
            console.log(error)
        })
        
    }

    async function locationChange(event){
        await setLocation(event.target.value)
        
    }
    function cuisineChange(event){
        const cuisineId = parseInt(event.target.value)
        const index = cuisine.indexOf(cuisineId)
        index>=0 ? cuisine.splice(index,1) : setCuisine([...cuisine,cuisineId])
        fetchData()
    }
    
    useEffect(()=>{
        fetchData();        
    },[location,cuisine,hcost,sort,page])


    return(
    <div>

        <div className="body">
            
        <div className="heading1">Restaurants for you</div>
        
            <div  onClick={() => collapseOpen?setCollapse(false):setCollapse(true)}  className="filterCollapse" data-bs-toggle="collapse" data-bs-target="#left" >FILTERS / SORT 
                        {collapseOpen?<i style={{marginLeft:"15%"}}class="fas fa-angle-up"></i>
                        :<i style={{marginLeft:"15%"}}class="fas fa-angle-down"></i>}</div>

            <div className="left collapse show" id="left">
                        
                        <div className="left_heading_1">Filters</div>
                        <div className="left_heading_2">Select Location</div>
                        <div>
                            <select class="dd" onChange={(e) => {
                                locationChange(e)
                            }} >
                                <option>Select a location</option>

                                {locations.map((data)=>{
                                    return <option value={data.location_id}>{data.name+', '+data.city}</option>
                                })}
                        
                            </select>
                        </div>
     
                        <div className="left_heading_3">Cuisine</div>
                        <div className="checkbox">
                            <input value="1" type="checkbox" onChange={(e) => {
                                cuisineChange(e)
                            }}/>   North Indian <br/>
                            <input value="2" type="checkbox"onChange={(e) => {
                                cuisineChange(e)
                            }}/>   South Indian<br/>
                            <input value="3" type="checkbox"onChange={(e) => {
                                cuisineChange(e)
                            }}/>   Chinese <br/>
                            <input  value="4" type="checkbox"onChange={(e) => {
                                cuisineChange(e)
                            }}/>   Fast food <br/>
                            <input value="5" type="checkbox"onChange={(e) => {
                                cuisineChange(e)
                            }}/>   Street food <br/>
                        </div>

                        <div className="left_heading_3">Minimum Cost</div>
                        
                        <div className="radio_1">
                            <input name="cost" type="radio"onChange={(e) => {
                                setLcost(100)
                                setHcost(500)
                            }}/> Less than Rs: 500 <br/>
                            <input name="cost" type="radio"onChange={(e) => {
                                setLcost(500)
                                setHcost(1000)
                            }}/> Rs: 500 to Rs:1000 <br/>
                            <input name="cost" type="radio"onChange={(e) => {
                                setLcost(1000)
                                setHcost(1500)
                            }}/> Rs: 1000 to Rs:1500 <br/>
                            <input name="cost" type="radio"onChange={(e) => {
                                setLcost(1500)
                                setHcost(2000)
                            }}/> Rs: 1500 to Rs:2000 <br/>
                            <input name="cost" type="radio"onChange={(e) => {
                                setLcost(2000)
                                setHcost(10000)
                            }}/> Rs: 2000 + <br/>
                              <input name="cost" type="radio"onChange={(e) => {
                                setLcost(10)
                                setHcost(10000)
                            }}/> All <br/>
                        </div>
                        <div className="left_heading_4">Sort</div>
                        <div className="radio_2">
                            <input name="price" type="radio" onChange={(e) => {
                                setSort(1)
                            }}/>Price low to high <br/>
                            <input name="price" type="radio"onChange={(e) => {
                                setSort(-1)
                            }}/>Price high to low <br/>
                        </div>
                    </div>

        
            <div className="right">

            {restaurants.length>0? 
                           
                           restaurants.map(restaurant => {
                               return (
                                <div className="item" onClick={()=>{
                                    history.push(`/details?restaurant=${restaurant._id}`)
                                }}>
                    
                                <div className="item_top">
                                   
                                    <div className="image"><img src={`./${restaurant.image}`} alt="" width="80%" height="80%"/></div>
                                    <div className="description">
                                        <div className="title">{restaurant.name}</div>
                                        <div className="address_1">{restaurant.locality} </div>
                                        <div className="address_2">{restaurant.city}</div>
                                    </div>
                        
                                </div>
                                     <div className="line"></div>
                                <div className="item_bottom">
                                    <div className="question">
                                        <div>CUISINES:</div>
                                        <div>MINIMUM COST:</div>
                                    </div>
                                    <div className="ans">
                                        <div>{restaurant.cuisine.map(Eachcuisine => {
                                            return Eachcuisine.name+", "
                                        })}</div>
                                        <div>{restaurant.min_price}</div>
                                    </div>
                          
                                  </div>
                            
                               </div> 
                               )
                              
                           })
                           
                :  
                      <img className="no" src={nodata} alt="No Image" height="400" width="400" />
                }
                    
                {restaurants.length>0? 
                  <div className="page">
                  <div className="page_no" onClick={ (e)=>{
                      setPage(page-1)
                  }}> {'<'}</div>  
                      {pages.map(eachPage =>{
                          return <div className="page_no"onClick={ (e)=>{
                             setPage(eachPage)
                          }}>{eachPage}</div>
                      })
                     }
                      <div className="page_no"onClick={ (e)=>{
                      setPage(page+1)
                  }}> {'>'} </div>
               </div> :
               <div></div>
               
            }
              
            
        </div>

    </div>
    </div>
    )
}

export default FIlterpage