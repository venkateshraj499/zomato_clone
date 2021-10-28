import {BrowserRouter , Route} from 'react-router-dom'
import Homepage from './Homepage'
import FIlterpage from './Filterpage'
import Details from './Details'
import Header from './Header'

function Router () {
    return(
        <div>
            <BrowserRouter>
                <Header />
                <Route exact path='/' component={Homepage} />
                <Route exact path='/filter' component={FIlterpage} />
                <Route exact path='/details' component={Details} />
            </BrowserRouter>
         </div>
    )
}


export default Router