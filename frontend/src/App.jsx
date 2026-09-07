import './App.css'
import VehicleList from './components/VehicleList'
import Login from './components/Login'
import AddVehicle from './components/AddVehicle'
import {useState} from 'react'

function App() {
  const [vehicleRefresh, setVehicleRefresh] = useState(0)

  return (
    <div>
      <h1>Maintenance Manager</h1>
      <p>Track your vehicles and maintenance records.</p>

      <Login />
      <AddVehicle setVehicleRefresh = {setVehicleRefresh} />
      <VehicleList vehicleRefresh = {vehicleRefresh} />
    </div>
  )
}

export default App