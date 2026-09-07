import {useEffect, useState} from 'react'

const API_URL = import.meta.env.VITE_API_URL

function VehicleList({vehicleRefresh}) {
    const [error, setError] = useState('')

    const [vehicles, setVehicles] = useState([])

    const [editingVehicleId, setEditingVehicleId] = useState(null)
    const [editMake, setEditMake] = useState('')
    const [editModel, setEditModel] = useState('')
    const [editYear, setEditYear] = useState('')

    useEffect(() => {
        setError('')
        const token = localStorage.getItem('token')

        fetch(`${API_URL}/vehicles/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to load vehicles')
            }

            return response.json()
        })
        .then((data) => {
            setVehicles(data.vehicles || [])
        })
        .catch((error) => {
            console.error(error)
            setError('Failed to load vehicles')
        })
    }, [vehicleRefresh])

    const handleDelete = (vehicleId) => {
        setError('')

        const confirmed = window.confirm(
            'Are you sure you want to delete this vehicle?'
        )

        if (!confirmed) {
            return
        }

        const token = localStorage.getItem('token')

        fetch(`${API_URL}/vehicles/${vehicleId}/`,{
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
            setError('Failed to delete vehicle')
        })
    }

    const handleEdit = (vehicle) => {
        setEditingVehicleId(vehicle.id)
        setEditMake(vehicle.make)
        setEditModel(vehicle.model)
        setEditYear(vehicle.year)
    }

    const handleSave = (vehicleId) => {
        setError('')

        const token = localStorage.getItem('token')

        fetch(`${API_URL}/vehicles/${vehicleId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                make: editMake,
                model: editModel,
                year: editYear
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to save vehicle')
            }
            return response.json()
        })
        .then((updatedVehicle) => {
            setVehicles((currentVehicles) =>
                currentVehicles.map((vehicle) =>
                    vehicle.id === updatedVehicle.id
                        ? updatedVehicle
                        : vehicle
                )
            )

            setEditingVehicleId(null)
        })
        .catch((error) => {
            console.error(error)
            setError('Failed to save vehicle')
        })
    }

    return(
        <section>
            <h2>My Vehicles</h2>
            {error && <p>{error}</p>}
            {vehicles.map((vehicle) => (
                <div key={vehicle.id}>
                    {editingVehicleId === vehicle.id ? (
                        <div>
                            <input
                                type="text"
                                value={editMake}
                                onChange={(event) => setEditMake(event.target.value)}
                            />

                            <input
                                type="text"
                                value={editModel}
                                onChange={(event) => setEditModel(event.target.value)}
                            />

                            <input
                                type="number"
                                value={editYear}
                                onChange={(event) => setEditYear(event.target.value)}
                            />
                            <button 
                                type="button"
                                onClick={() => handleSave(vehicle.id)}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingVehicleId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <h3>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                    )}
                    <button type = "button" onClick={() => handleEdit(vehicle)}>
                        Edit
                    </button>
                    <button type = "button" onClick={() => handleDelete(vehicle.id)}>
                        Delete
                    </button>
                </div>
            ))}
        </section>
    )
}

export default VehicleList