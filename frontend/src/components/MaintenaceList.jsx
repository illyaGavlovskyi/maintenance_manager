import {useEffect, useState} from 'react'

const API_URL = import.meta.env.VITE_API_URL

function MaintenaceList({maintenanceRefresh, setMaintenanceRefresh }) {
    const [error, setError] = useState('')

    const [records, setRecords] = useState([])

    const [editingRecordId, setEditingRecordId] = useState(null)

    const [editServiceType, setEditServiceType] = useState('')
    const [editDate, setEditDate] = useState('')
    const [editMileage, setEditMileage] = useState('')
    const [editCost, setEditCost] = useState('')
    const [editNotes, setEditNotes] = useState('')

    useEffect(() => {
        setError('')

        const token = localStorage.getItem('token')

        fetch(`${API_URL}/maintenance/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to load maintenance records')
            }

            return response.json()
        })
        .then((data) => {
            setRecords(data.maintenance_records || [])
        })
        .catch((error) => {
            console.error(error)
            setError('Failed to load maintenance records')
        })
    }, [maintenanceRefresh])

    const handleDelete = (recordId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this maintenance record?'
        )

        if (!confirmed) {
            return
        }

        const token = localStorage.getItem('token')

        fetch(`${API_URL}/maintenance/${recordId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to delete maintenance record')
            }

            setMaintenanceRefresh((current) => current + 1)
        })
        .catch((error) => {
            console.error(error)
            setError('Failed to delete maintenance record')
        })
    }

    const handleEdit = (record) => {
        setEditingRecordId(record.id)

        setEditServiceType(record.service_type)
        setEditDate(record.date)
        setEditMileage(record.mileage)
        setEditCost(record.cost)
        setEditNotes(record.notes)
    }

    const handleSave = (recordId) => {
        setError('')

        const token = localStorage.getItem('token')

        fetch(`${API_URL}/maintenance/${recordId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                service_type: editServiceType,
                date: editDate,
                mileage: editMileage,
                cost: editCost,
                notes: editNotes
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to update maintenance record')
            }

            return response.json()
        })
        .then(() => {
            setEditingRecordId(null)
            setMaintenanceRefresh((current) => current + 1)
        })
        .catch((error) => {
            console.error(error)
            setError('Failed to update maintenance record')
        })
    }

    return (
        <section>
            {error && <p>{error}</p>}

            {records.map((record) => (
                <div key={record.id}>
                    {editingRecordId === record.id ? (
                        <div>
                            <input
                                type="text"
                                value={editServiceType}
                                onChange={(event) => setEditServiceType(event.target.value)}
                            />

                            <input
                                type="date"
                                value={editDate}
                                onChange={(event) => setEditDate(event.target.value)}
                            />

                            <input
                                type="number"
                                value={editMileage}
                                onChange={(event) => setEditMileage(event.target.value)}
                            />

                            <input
                                type="number"
                                value={editCost}
                                onChange={(event) => setEditCost(event.target.value)}
                            />

                            <textarea
                                value={editNotes}
                                onChange={(event) => setEditNotes(event.target.value)}
                            />
                            
                            <button
                                type="button"
                                onClick={() => handleSave(record.id)}
                            >
                                Save
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditingRecordId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h3>{record.service_type}</h3>
                            <p>Date: {record.date}</p>
                            <p>Mileage: {record.mileage}</p>
                            <p>Cost: {record.cost}</p>
                            <p>Notes: {record.notes}</p>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick = {() => handleDelete(record.id)}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </section>
    )
}

export default MaintenaceList