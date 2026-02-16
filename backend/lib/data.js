export const USERS = [
  { id: 1, email: 'ejecutivo1@parque.cl', password: 'demo123', name: 'Ejecutivo 1' },
  { id: 2, email: 'ejecutivo2@parque.cl', password: 'demo123', name: 'Ejecutivo 2' },
  { id: 3, email: 'ejecutivo3@parque.cl', password: 'demo123', name: 'Ejecutivo 3' }
];

export const CLIENTS = [
  {
    id: '1',
    name: 'Juan Pérez',
    rut: '10.111.222-3',
    debt: 2500000,
    daysOverdue: 120,
    vinsonScore: 95,
    product: 'Sepultura Parque Américo Vespucio',
    sector: 'A-22',
    debtType: 'Crédito',
    warning: 'judicial',
    lastContact: '2023-10-15',
    status: 'mora_severa',
    deceasedName: 'María Pérez (Madre)',
    sensitiveDate: '10-27',
    isSensitiveDate: false,
    beneficiaries: [
      { name: 'Pedro Pérez', relation: 'Hijo', phone: '+56 9 1111 2222' },
      { name: 'Ana Pérez', relation: 'Hija', phone: '+56 9 3333 4444' }
    ]
  },
  {
    id: '2',
    name: 'María González',
    rut: '11.222.333-4',
    debt: 1800000,
    daysOverdue: 90,
    vinsonScore: 85,
    product: 'Nicho Columbario',
    sector: 'B-15',
    debtType: 'Crédito',
    warning: 'dicom',
    lastContact: '2023-11-01',
    status: 'mora_media',
    deceasedName: 'Carlos González (Esposo)',
    sensitiveDate: '12-15',
    isSensitiveDate: false,
    beneficiaries: [
      { name: 'Laura González', relation: 'Hija', phone: '+56 9 5555 6666' }
    ]
  },
  {
    id: '3',
    name: 'Roberto Silva',
    rut: '12.333.444-5',
    debt: 3200000,
    daysOverdue: 150,
    vinsonScore: 98,
    product: 'Sepultura Premium',
    sector: 'C-08',
    debtType: 'Crédito',
    warning: 'exhumacion',
    lastContact: '2023-09-20',
    status: 'mora_critica',
    deceasedName: 'Elena Silva (Madre)',
    sensitiveDate: '11-05',
    isSensitiveDate: false,
    beneficiaries: [
      { name: 'Daniela Silva', relation: 'Hija', phone: '+56 9 7777 8888' },
      { name: 'Marcos Silva', relation: 'Hijo', phone: '+56 9 9999 0000' }
    ]
  }
];

export const WARNINGS = {
  seguro: { label: 'Pérdida de Seguro' },
  uso: { label: 'Pérdida Derecho Uso' },
  castigo: { label: 'Paso a Castigo' },
  dicom: { label: 'Ingreso a DICOM' },
  externa: { label: 'Cobranza Externa' },
  judicial: { label: 'Aviso Judicial' },
  resciliacion: { label: 'Resciliación' },
  exhumacion: { label: 'Riesgo Exhumación' }
};

export const SOLUTIONS = [
  { id: 'renegociacion', label: 'Renegociación' },
  { id: 'refinanciamiento', label: 'Refinanciamiento' },
  { id: 'menor_valor', label: 'Cambio Menor Valor' },
  { id: 'cambio_titular', label: 'Cambio de Titular' },
  { id: 'descuento', label: 'Descuento Intereses' },
  { id: 'fecha_corta', label: 'Fecha Corta' }
];

export const OBJECTIONS = [
  { id: 'no_dinero', text: 'No tengo dinero ahora', category: 'economica' },
  { id: 'esperar', text: 'Prefiero esperar', category: 'tiempo' },
  { id: 'no_interesa', text: 'No me interesa el servicio', category: 'valor' },
  { id: 'consultar', text: 'Debo consultarlo con la familia', category: 'decision' },
  { id: 'muy_caro', text: 'Es muy caro', category: 'precio' },
  { id: 'otra_opcion', text: 'Tengo otra opción', category: 'competencia' }
];
