export const INITIAL_PROFESSORS = [
    { nombres: "Alan", apellidos: "Turing", email: "alan@turing.com", dni: "00000001", especialidad: "Criptografía" },
    { nombres: "Grace", apellidos: "Hopper", email: "grace@hopper.com", dni: "00000002", especialidad: "Compiladores" },
    { nombres: "Richard", apellidos: "Feynman", email: "richard@fisica.com", dni: "00000003", especialidad: "Física Cuántica" },
    { nombres: "Marie", apellidos: "Curie", email: "marie@quimica.com", dni: "00000004", especialidad: "Química" },
    { nombres: "Nikola", apellidos: "Tesla", email: "nikola@electro.com", dni: "00000005", especialidad: "Electromagnetismo" }
];

export const INITIAL_COURSES = [
    { nombre: "Introducción a la IA", descripcion: "Fundamentos de Inteligencia Artificial", creditos: 5, estado: true },
    { nombre: "Arquitectura de Software", descripcion: "Patrones y diseño limpio", creditos: 4, estado: true },
    { nombre: "Cálculo I", descripcion: "Límites y derivadas", creditos: 3, estado: true },
    { nombre: "Física Mecánica", descripcion: "Leyes de Newton", creditos: 4, estado: false }, // Inactivo para probar filtro
    { nombre: "Ética Profesional", descripcion: "Valores en la ingeniería", creditos: 2, estado: true },
    { nombre: "Historia de la Computación", descripcion: "De Babbage a la Nube", creditos: 2, estado: false } // Inactivo
];

export const INITIAL_STUDENTS = [
    { nombres: "Marty", apellidos: "McFly", email: "marty@future.com", dni: "10000001", codigo: "ST-001" },
    { nombres: "Emmett", apellidos: "Brown", email: "doc@future.com", dni: "10000002", codigo: "ST-002" },
    { nombres: "Biff", apellidos: "Tannen", email: "biff@bully.com", dni: "10000003", codigo: "ST-003" },
    { nombres: "Lorraine", apellidos: "Baines", email: "lorraine@past.com", dni: "10000004", codigo: "ST-004" },
    { nombres: "George", apellidos: "McFly", email: "george@past.com", dni: "10000005", codigo: "ST-005" }
];