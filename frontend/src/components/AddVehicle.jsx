import {useState} from 'react'

const API_URL = import.meta.env.VITE_API_URL

function AddVehicle({setVehicleRefresh}) {
    const [error, setError] = useState('')

    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [year, setYear] = useState('')

    const handleAddVehicle = () => {
        setError('')

        if (!make || !model || !year) {
            setError('Please fill in all vehicle fields')
            return
        }

        if (year < 1886) {
            setError('Please enter a valid vehicle year')
            return
        }

        const token = localStorage.getItem('token')

        fetch(`${API_URL}/vehicles/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                make: make,
                model: model,
                year: year
            })
        })

        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to add vehicle')
            }

            return response.json()
        })

        .then((data) => {
            console.log(data)

            setMake('')
            setModel('')
            setYear('')

            setVehicleRefresh((current) => current + 1)
        })
        .catch((error) => {
            console.error(error)
            setError('Failed to add vehicle')
        })
    }
    


    return (
        <div>
            <h2>Add Vehicle</h2>
            <input
                type="text"
                placeholder="Make"
                value={make}
                onChange={(event) => setMake(event.target.value)}
            />

            <input
                type="text"
                placeholder="Model"
                value={model}
                onChange={(event) => setModel(event.target.value)}
            />

            <input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(event) => setYear(event.target.value)}
            />

            <button type="button" onClick = {handleAddVehicle}>
                Add Vehicle
            </button>
            {error && <p>{error}</p>}
        </div>
    )
}

export default AddVehicle