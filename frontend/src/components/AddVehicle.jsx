function AddVehicle({setVehicleRefresh}) {
    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [year, setYear] = useState('')

    const handleAddVehicle = () => {
        const token = localStorage.getItem('token')

        fetch('http://127.0.0.1:8000/vehicles/', {
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
        </div>
    )
}

export default AddVehicle