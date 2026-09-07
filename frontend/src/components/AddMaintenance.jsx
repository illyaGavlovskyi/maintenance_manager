import {useEffect, useState} from 'react'

const API_URL = import.meta.env.VITE_API_URL

function AddMaintenance({setMaintenanceRefresh }) {
    const [error, setError] = useState('')

    const [vehicles, setVehicles] = useState([])

    const [vehicle, setVehicle] = useState('')
    const [serviceType, setServiceType] = useState('')
    const [date, setDate] = useState('')
    const [mileage, setMileage] = useState('')
    const [cost, setCost] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        setError('')
        const token = localStorage.getItem('token')

        fetch(`${API_URL}/vehicles/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setVehicles(data.vehicles || [])
        })
        .catch((error) => {
            console.error(error)
            setError('Failed to load vehicles')
        })
    }, [])

    const handleAddMaintenance = () => {
        setError('')

        if (!vehicle || !serviceType || !date || !mileage || !cost) {
            setError('Please fill in all required maintenance fields')
            return
        }

        if (mileage < 0) {
            setError('Mileage cannot be negative')
            return
        }

        if (cost < 0) {
            setError('Cost cannot be negative')
            return
        }

        const token = localStorage.getItem('token')

        fetch(`${API_URL}/maintenance/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                vehicle: vehicle,
                service_type: serviceType,
                date: date,
                mileage: mileage,
                cost: cost,
                notes: notes
            })
        })

        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to add maintenance record')
            }

            return response.json()
        })
        .then((data) => {
            console.log(data)

            setVehicle('')
            setServiceType('')
            setDate('')
            setMileage('')
            setCost('')
            setNotes('')

            setMaintenanceRefresh((current) => current + 1)
        })
        .catch((error) => {
            console.error(error)
            setError('Failed to add maintenance record')
        })
    }

    return (
        <section>
            <h2>Add Maintenance Record</h2>

            <select
                value={vehicle}
                onChange={(event) => setVehicle(event.target.value)}
            >
                <option value="">Select a vehicle</option>

                {vehicles.map((vehicleItem) => (
                    <option key={vehicleItem.id} value={vehicleItem.id}>
                        {vehicleItem.year} {vehicleItem.make} {vehicleItem.model}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Service Type"
                value={serviceType}
                onChange={(event) => setServiceType(event.target.value)}
            />
            <input
                type="date"
                placeholder="Date" 
                value={date}
                onChange={(event) => setDate(event.target.value)}
            />
            <input
                type="number"
                placeholder="Mileage"
                value={mileage}
                onChange={(event) => setMileage(event.target.value)}
            />
            <input
                type="number"
                placeholder="Cost"
                value={cost}
                onChange={(event) => setCost(event.target.value)}
            />
            <textarea
                placeholder="Notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
            />

            <button
                type="button"
                onClick={handleAddMaintenance}
            >
                Add Record
            </button>
            {error && <p>{error}</p>}
        </section>
    )
}

export default AddMaintenance