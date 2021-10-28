import '../Styles/Home.css' 
import background from '../Images/homeimg.jpg'

function Wallpaper (props) {
    const locationsData = props.locationsData    
    
    let locationChange =(event) =>{
        let locId=event.target.value;    
        sessionStorage.setItem("locationId",locId)
        console.log(sessionStorage.getItem("locationId"))
    }
   

    return(        
        <div>
         
          <div className="header">
                <div class="logo">V!</div>
                <div class="HomeLogin_options">
                    <div class="login"> Login</div>
                    <div class="new_account"> Create an account </div>
                </div>
            </div>

            <img class="homeImage"src={background} alt="no-ie" height="500px" />

            <div class = "top_elements">
                <div class="logo_top">V!</div>
                <div class="heading_top">Find the best restaurants, cafés, and bars</div>
                <select class="Homedd" onChange={(e)=>{locationChange(e)}}>
                    <option>Select a location</option>

                     {locationsData.map((data)=>{
                         return <option value={data.location_id}>{data.name+', '+data.city}</option>
                     })}
                     
                </select>
                <input class="input" type="text"placeholder="Search for a restaurant"></input>
            </div>

            <div className="Qsheading">Quick Searches</div>
            <div className="sub-heading">Discover restaurants by type of meal</div>
       </div>
    )
}

export default Wallpaper