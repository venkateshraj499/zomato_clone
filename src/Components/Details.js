import {useEffect, useState} from 'react'
import axios from 'axios'
import '../Styles/Details.css'
import {useLocation} from "react-router-dom";
import Modal from "react-modal"
import queryString from 'query-string';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import nodata from "../Images/noData.png"
import { useHistory } from "react-router";


function Details(){
   const [restaurant,setRestaurant] = useState({})
   const [menuItems,setMenuItems] = useState([])
   const [itemModal,setItemModal] = useState(false)
   const [imageModal,setImageModal] = useState(false)
   const [subTotal, setSubTotal] = useState(0)
   const [formModal,setFormModal] = useState(false)
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [number, setNumber] = useState('')
   const [address, setAddress] = useState('')
   
   const history = useHistory();
   

   const search = useLocation().search 
   const qs = queryString.parse(search);
   const resId = qs.restaurant
   const customStyles = {
    content: {
        bottom: 'auto',
        left:"1%",
        backgroundColor: 'white',
        border: '1px solid black',
        height: '600px',
        width:'98%'
    },
   };
   const customStyles2 = {
    content: {
        bottom: 'auto',
        left:"1%",
        backgroundColor: '#FFFF',
        border: '1px solid black',
        height: '600px',
        padding: '3% 5% 0 5%',
        width:'98%'
    }
   };
   function fetchRestaurant(){
    
        axios({
            url: `https://vast-basin-30737.herokuapp.com/restaurant/${resId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res=>{
            setRestaurant(res.data.restaurant)
        })
        .catch(error=>{
            
            console.log(error)
        }) 
    
   }
   function fetchMenuItems(){

        axios({
            url: `https://vast-basin-30737.herokuapp.com/menuitems/${resId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res=>{
            setMenuItems(res.data.items)
        })
        .catch(error=>{
            
            console.log(error)
        }) 
        setItemModal(true)

   }

   function addItem(operation , index){
       let total = 0;
       const duplicate = menuItems;
       const selection = duplicate[index];
       (operation === "add") ? selection.qty+=1 : selection.qty-=1;
       
       duplicate.map(item =>{
           total+=item.qty*item.price;
       })

       setMenuItems(duplicate);
       setSubTotal(total);
   }
  
   // Payment Integration Functions
   const isDate=(val)=> {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === '[object Date]'
 }

   const isObj = (val) => {
    return typeof val === 'object'
    }

   const stringifyValue = (val) => {
    if (isObj(val) && !isDate(val)) {
        return JSON.stringify(val)
    } else {
        return val
    }
   }

   const buildForm = ({ action, params }) => {
    const form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', action)

    Object.keys(params).forEach(key => {
        const input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', key)
        input.setAttribute('value', stringifyValue(params[key]))
        form.appendChild(input)
    })
    return form
   }

   const post = (details) => {
    const form = buildForm(details)
    document.body.appendChild(form)
    form.submit()
    form.remove()
    }

   const getData = (data) => {
    return fetch(`https://vast-basin-30737.herokuapp.com/payment`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).catch(err => console.log(err))
   }

   const payments = () =>{
    
    const paymentObj = {
        amount: subTotal,
        email
    };

    getData(paymentObj).then(response => {
        var information = {
            action: "https://securegw-stage.paytm.in/order/process",
            params: response
        }
        post(information)
    })
   }
   // End of Payment Integration Functions 
   useEffect(()=>{
        fetchRestaurant();    
        console.log(restaurant)    
   },[])

   return(
    <div>
        <div style = {{textAlign:"center"}}>
            <img className="resImg" src={`./${restaurant.image}`} alt="No Image, Sorry for the Inconvinience" width="70%" height="500px" />

            <button className="button" onClick={()=>{ setImageModal(true) }}>Click to see Image Gallery</button>
        </div>
        
        <div className="heading">{restaurant.name}</div>
        <button className="btn-order" onClick={()=>{ fetchMenuItems() }}>Place Online Order</button>

        <div className="tabs">
            <div className="tab">
                <input type="radio" id="tab-1" name="tab-group-1" checked />
                <label for="tab-1">Overview</label>

                <div className="content">
                    <div className="about">About this place</div>
                    <div className="head">Cuisine</div>
                    <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(item => `${item.name}, `)}</div>
                    <div className="head">Average Cost</div>
                    <div className="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                </div>
            </div>

            <div className="tab">
                <input type="radio" id="tab-2" name="tab-group-1" />
                <label for="tab-2">Contact</label>
                <div className="content">
                    <div className="head">Phone Number</div>
                    <div className="value">{restaurant.contact_number}</div>
                    <div className="head">{restaurant.name}</div>
                    <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                </div>
            </div>
        </div>
        <Modal
            isOpen={itemModal}
            style={customStyles}            
        >
              <div>
                        <div style={{ float: 'right' }} className="fas fa-times" onClick={() => setItemModal(false)}></div>
                        <div >
                            <h3 className="restaurant-name">{restaurant.name}</h3>
                            <h3 className="total">SubTotal : {subTotal}</h3>
                            <button className="btn btn-danger order-button" onClick={() => {subTotal>0?setFormModal(true): alert('Select some Items')}}> Pay </button>
                            {menuItems.length > 1 ? 
                            menuItems.map((item, index) => {
                                return <div className="mainBox" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', }}>
                                    <div className="card" >
                                        <div className="row" style={{ paddingLeft: '10px',border:"none", paddingBottom: '10px',paddingTop: '20px', display:'flex' }}>
                                            <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 items " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <span className="card-body">
                                                    <i class="far fa-plus-square square"></i>
                                                    <h5 className="name">{item.name}</h5>
                                                    <h5 className="price">&#8377;{item.price}</h5>
                                                    <p className="descp">{item.description}</p>
                                                </span>
                                            </div>
                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                                <img className="card-img-center title-img" src={`../${item.image}`} />
                                                {item.qty == 0 ? <div>
                                                    <button className="add" onClick={() => addItem("add", index) }>Add</button>
                                                </div> :
                                                    <div className="add-number">
                                                        <button className="plus"onClick={() => addItem("sub", index) }>-</button>
                                                        <span style={{ color:" #61b246",margin:"5px",fontWeight:"500" }}>{item.qty}</span>
                                                        <button  className="plus"onClick={() => addItem("add", index) }>+</button>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }) : <img className="no" src={nodata} alt="No Image" height="400" width="400" />}
                            <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                            </div>
                        </div>
                    </div>
        </Modal>
        <Modal
         isOpen={imageModal}
         style={customStyles2}
         
     >
         <div >
               <div style={
                   { float: 'right',
                   color:'#192f60',
                   marginBottom:'15px',
                  textAlign:'center',fontSize:'25px' }} 
                  className="fas fa-times"onClick={() => setImageModal(false)}></div>
                 <Carousel
                 showThumbs={false}
                 showStatus={false}
                 showIndicators={true}>
                            {restaurant && restaurant.thumb && restaurant.thumb.map((image) => {
                                return <div>
                                    <img src={`./${image}`} height="400px"/>
                                </div>
                            })}
                </Carousel>
              </div>
         </Modal>
         <Modal
            isOpen={formModal}
            style={customStyles}
                >
                    <div>
                        <div style={{ float: 'right' }} className="fas fa-times" onClick={() =>setFormModal(false)}></div>
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <div>
                            <label className="form-label">Name</label>
                            <input required style={{ width: '90%' }} className="form-control" type="text" placeholder="Enter Your Name" onChange={(event) => {setName(event.target.value)}} />
                        </div>
                        <div>
                            <label className="form-label">Email</label>
                            <input required style={{ width: '90%' }} className="form-control" type="text" placeholder="Enter Your Email" onChange={(event) => {setEmail(event.target.value)}} />
                        </div>
                        <div>
                            <label className="form-label">Contact Number</label>
                            <input required="true" style={{ width: '90%' }} className="form-control" type="tel" placeholder="Enter Your Number" onChange={(event) => {setNumber(event.target.value)}} />
                        </div>
                        <div>
                            <label className="form-label">Address</label>
                            <textarea required className="form-control textArea" placeholder="Enter Your Address" onChange={(event) =>{setAddress(event.target.value)}} />
                        </div>
                        <button onClick={()=>{(name===''||email===''||number===''||address==='')? alert('Fill all the details'):payments()}} className="btn btn-danger" style={{ marginTop: '15px',marginLeft:"30px" }} >Proceed</button>
                    </div>
                </Modal>
            
    </div>
   )
}

export default Details