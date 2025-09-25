"use client"

import doctors from "@/data/doctors"

export default function DoctorsList() {
  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold">Meet Our Doctors</h3>
        <p className="text-muted-foreground">Experienced doctors available for teleconsultation</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
        {doctors.map((d, i) => (
          <a href="/doctors" key={d.id} className="text-center doctor-card">
            <img src={d.image} alt={d.name} className="mx-auto rounded-full w-24 h-24 object-cover doctor-img" />
            <div className="mt-2 text-sm font-medium">{d.name}</div>
            <div className="text-xs text-muted-foreground">{d.specialization}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
