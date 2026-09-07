import './App.css'

import VehicleList from './components/VehicleList'
import MaintenaceList from './components/MaintenaceList'

import Login from './components/Login'
import AddVehicle from './components/AddVehicle'
import AddMaintenance from './components/AddMaintenance'

import {useState} from 'react'

function App() {
  const [vehicleRefresh, setVehicleRefresh] = useState(0)
  const [maintenanceRefresh, setMaintenanceRefresh] = useState(0)

  return (
    <div>
      <h1>Maintenance Manager</h1>
      <p>Track your vehicles and maintenance records.</p>

      <Login />
      <AddVehicle setVehicleRefresh = {setVehicleRefresh} />
      <VehicleList vehicleRefresh = {vehicleRefresh} />
      <AddMaintenance setMaintenanceRefresh = {setMaintenanceRefresh} />
      <MaintenaceList 
        maintenanceRefresh = {maintenanceRefresh}
        setMaintenanceRefresh = {setMaintenanceRefresh}  
      />
    </div>
  )
}

export default App