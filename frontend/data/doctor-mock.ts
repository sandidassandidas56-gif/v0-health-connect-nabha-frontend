const isoDate = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return isoDate(d);
};

export const mockDoctorProfile = {
  id: 'd1',
  name: 'Dr. Arjun Mehta',
  email: 'arjun.mehta@example.com',
  role: 'doctor',
  phone: '+91-9876543210',
  specialization: 'General Practitioner',
};

export const mockAppointments = [
  { id: 'a1', patientName: 'Sita Devi', date: addDays(0), time: '09:30', status: 'confirmed' },
  { id: 'a2', patientName: 'Ramesh Kumar', date: addDays(0), time: '10:15', status: 'pending' },
  { id: 'a3', patientName: 'Meena Patel', date: addDays(5), time: '14:00', status: 'confirmed' },
];

export const mockPatients = [
  { id: 'p1', name: 'Sita Devi', condition: 'Hypertension', status: 'active' },
  { id: 'p2', name: 'Ramesh Kumar', condition: 'Diabetes', status: 'active' },
  { id: 'p3', name: 'Meena Patel', condition: 'Migraine', status: 'inactive' },
];

export const mockReports = [
  { id: 'r1', patientName: 'Sita Devi', type: 'Blood Test', status: 'pending', date: addDays(-1) },
  { id: 'r2', patientName: 'Ramesh Kumar', type: 'X-Ray', status: 'reviewed', date: addDays(-6) },
];

export const mockPrescriptions = [
  { id: 'pr1', patientName: 'Sita Devi', medication: 'Amlodipine', dosage: '5mg', frequency: 'once-daily', duration: '30 days', date: addDays(0) },
  { id: 'pr2', patientName: 'Ramesh Kumar', medication: 'Metformin', dosage: '500mg', frequency: 'twice-daily', duration: '60 days', date: addDays(-6) },
  { id: 'pr3', patientName: 'Meena Patel', medication: 'Sumatriptan', dosage: '50mg', frequency: 'as-needed', duration: 'as-needed', date: addDays(-1) },
];
