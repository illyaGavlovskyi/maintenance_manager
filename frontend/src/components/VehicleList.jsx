import {useEffect, useState} from 'react'

function VehicleList({vehicleRefresh}) {
    const [vehicles, setVehicles] = useState([])
    // const vehicles = [
    //     {id: 1, make: "Toyota", model: "Camry", year: 2020}, 
    //     {id: 2, make: "Honda", model: "Civic", year: 2022}
    // ]

    useEffect(() => {
        const token = localStorage.getItem('token')

        fetch('http://127.0.0.1:8000/vehicles/',{
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then((response) => response.json())
        .then((data) => setVehicles(data.vehicles || []))
    }, [vehicleRefresh])

    const habdleDelete = (vehicleId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this vehicle?'
        )

        if (!confirmed) {
            return
        }

        const token = localStorage.getItem('token')

        fetch(`http://127.0.0.1:8000/vehicles/${vehicleId}/`,{
            method: "DELETE",
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to delete vehicle')
            }
            setVehicles((currentVehicles) => currentVehicles.filter((vehicle) => vehicle.id !== vehicleId))
        })
        .catch((error) => {
            console.error(error) 
        })
    }

    return(
        <section>
            <h2>My Vehicles</h2>
            {vehicles.map((vehicle) => (
                <div key={vehicle.id}>
                    <h3>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <button type = "button">
                        Delete
                    </button>
                </div>
            ))}
        </section>
    )
}

export default VehicleList