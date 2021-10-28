import React from "react"
import { withRouter } from 'react-router-dom';
import { useHistory } from "react-router";

function QuickSearchItem (props) {

    const history = useHistory();
    var qsData = props.qsData
    
    const locId = props.locationId;
    

    var handleNavigate = (mealTypeId) => {
        console.log(locId)
        history.push(locId?`/filter?mealtype=${mealTypeId}&location=${locId}`:`/filter?mealtype=${mealTypeId}`)       
    }

    return(
      <div className=" col-xl-3 col-lg-5 col-md-5 col-sm-10 qs-options" onClick={() => handleNavigate(qsData.meal_type)} >
          
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" />
        
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"></script>

               <div class="foodImage">
                        <img src={`./${qsData.image}`} alt="Error!" width="100%" height="100%" />
                    </div>
                
                <div class="foodInfo">              
                    <div class="foodType ">{qsData.name}</div> 
                    <div class="description">{qsData.content}</div>
                </div>
       </div>
    )
}

export default withRouter(QuickSearchItem)