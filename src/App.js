import {BrowserRouter,Route} from 'react-router-dom';
import Dashboard from './Dashboard';


export default function App(){
    return(
    <BrowserRouter>
        <Route exact path='/' component={Dashboard}></Route>
    </BrowserRouter>
    )
}