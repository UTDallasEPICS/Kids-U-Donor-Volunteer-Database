'use client'
import { useState, useEffect } from 'react'

export default function AddOrientation() {
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    schedule: '',
    capacity: '',
    locationId: '',
    bgCheckRequired: false,
  })

  useEffect(() => {
    fetch('/api/locations/get')
      .then((res) => res.json())
      .then((data) => setLocations(data))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/orientations/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      alert('Orientation created!')
      setForm({ name: '', description: '', schedule: '', capacity: '', locationId: '', bgCheckRequired: false })
    } else {
      alert('Failed to create orientation')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg border rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create Orientation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="datetime-local" name="schedule" value={form.schedule} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} className="w-full p-2 border rounded" required />
        <select name="locationId" value={form.locationId} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Location</option>
          {locations.map((loc: any) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="bgCheckRequired"
            checked={form.bgCheckRequired}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300"
          />
          Requires Background Check
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Create</button>
      </form>
    </div>
  )
}
