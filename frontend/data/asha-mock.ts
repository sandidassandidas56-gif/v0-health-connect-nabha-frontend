const mockPrescriptions = [
  {
    _id: 'presc1',
    patient: 'Ram Kumar',
    medicines: [
      { name: 'Paracetamol', dosage: '500mg', instructions: 'Twice a day after food' },
      { name: 'Amoxicillin', dosage: '250mg', instructions: 'Three times a day' }
    ],
    location: 'Nabha Central',
  },
  {
    _id: 'presc2',
    patient: 'Sita Devi',
    medicines: [
      { name: 'Iron Syrup', dosage: '10ml', instructions: 'Once daily' }
    ],
    location: 'Rajpura',
  },
  {
    _id: 'presc3',
    patient: 'Mohinder Singh',
    medicines: [
      { name: 'Cough Syrup', dosage: '10ml', instructions: '3 times daily' }
    ],
    location: 'Samana',
  }
];

const mockPatients = [
  {
    id: 'p1',
    name: 'Ram Kumar',
    age: '45',
    gender: 'male',
    village: 'Nabha Central',
    phone: '9998887777',
    condition: 'Hypertension',
    vitals: { bp: '140/90', temperature: '98.6', weight: '70', height: '170', heartRate: 82, bloodSugar: 140 }
  },
  {
    id: 'p2',
    name: 'Sita Devi',
    age: '29',
    gender: 'female',
    village: 'Rajpura',
    phone: '8887776666',
    condition: 'Anemia',
    vitals: { bp: '110/70', temperature: '98.4', weight: '55', height: '158', heartRate: 76, bloodSugar: 95 }
  },
  {
    id: 'p3',
    name: 'Mohinder Singh',
    age: '60',
    gender: 'male',
    village: 'Samana',
    phone: '7776665555',
    condition: 'Chronic cough',
    vitals: { bp: '130/85', temperature: '99.1', weight: '68', height: '168', heartRate: 88, bloodSugar: 110 }
  }
];

const mockASHAProfile = {
  name: 'Sunita Devi',
  address: { street: 'Ward 3', city: 'Nabha', state: 'Punjab', pincode: '147201' },
  assignedPrescriptions: mockPrescriptions.map(p => p._id)
};

export { mockPrescriptions, mockPatients, mockASHAProfile };
