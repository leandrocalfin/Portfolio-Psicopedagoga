import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import mongoose from "mongoose";
import Hero from "../models/Hero.js";
import SobreMi from "../models/SobreMi.js";
import Servicio from "../models/Servicio.js";
import Articulo from "../models/Articulo.js";
import FAQ from "../models/FAQ.js";
import DatosContacto from "../models/DatosContacto.js";
import HorariosAtencion from "../models/HorariosAtencion.js";
import Turno from "../models/Turno.js";
import Anuncio from "../models/Anuncio.js";
import Config from "../models/Config.js";
import Usuario from "../models/Usuario.js";
import { connectDB } from "../config/db.js";

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      Hero.deleteMany({}),
      SobreMi.deleteMany({}),
      Servicio.deleteMany({}),
      Articulo.deleteMany({}),
      FAQ.deleteMany({}),
      DatosContacto.deleteMany({}),
      HorariosAtencion.deleteMany({}),
      Turno.deleteMany({}),
      Anuncio.deleteMany({}),
      Config.deleteMany({}),
      Usuario.deleteMany({}),
    ]);
    console.log("Colecciones limpiadas");

    // Hero
    await Hero.create({
      titulo: "Para comprender el lenguaje de los otros no es suficiente comprender las palabras; es necesario entender su pensamiento.",
      descripcion: "Atención a niños, adolescentes y adultos con desafíos en el desarrollo.",
      imagenes: [],
    });
    console.log("✓ Hero creado");

    // Sobre Mí
    await SobreMi.create({
      titulo: "Aprender es un puente que se cruza de a dos",
      descripcion: "Soy Estefani, psicopedagoga. Acompaño a niños, adolescentes y adultos con desafíos en el desarrollo. Inspirada en la convicción de que el aprendizaje sucede en comunidad y a través de los vínculos, diseño intervenciones clínicas, inclusivas y respetuosas de la singularidad de cada mente.",
      imagen: "",
      items: [
        { texto: "Matrícula profesional MPRN 886", orden: 1 },
        { texto: "Lic. en Psicopedagogía · Cert. Profesional Profectum Nivel I (2024)", orden: 2 },
        { texto: "ADOS-2 Clinical Workshop (HNBCS · Children's Hospital Boston)", orden: 3 },
        { texto: "Especialización en Terapia Cognitivo Conductual Nivel I (ARITA)", orden: 4 },
        { texto: "Método TEACCH (2022) · Diplomada en prácticas inclusivas en CEA (FACSO)", orden: 5 },
        { texto: "II° Congreso Internacional Autismo Santa Cruz (2023)", orden: 6 },
        { texto: "Autora del libro «¿Y por qué no a mí?»", orden: 7 },
      ],
      certificados: [
        { titulo: "Certificado Profesional Profectum Nivel 1", organizacion: "Profectum Foundation · 2024", imagen: "", año: 2024 },
        { titulo: "ADOS-2 Clinical Workshop", organizacion: "HNBCS · Children's Hospital Boston", imagen: "", año: 2023 },
        { titulo: "Especialización en Terapia Cognitivo Conductual Nivel I", organizacion: "ARITA", imagen: "", año: 2022 },
        { titulo: "Método TEACCH", organizacion: "Curso 2022", imagen: "", año: 2022 },
        { titulo: "II° Congreso Internacional Autismo Santa Cruz", organizacion: "Fundación T.E.A. · 2023", imagen: "", año: 2023 },
        { titulo: "Primeros pasos en la Clínica Psicopedagógica", organizacion: "Espacio Psicope · Lic. Guillermina Ferrá", imagen: "", año: 2021 },
      ],
    });
    console.log("✓ Sobre Mí creado");

    // Servicios
    const servicios = [
      { titulo: "Evaluación Psicopedagógica", descripcion: "Valoración integral del desarrollo, los procesos de aprendizaje y la cognición.", icono: "Brain", orden: 1 },
      { titulo: "Abordaje Temprano", descripcion: "Intervención en los primeros años de la infancia y apoyo en los hitos del desarrollo.", icono: "Baby", orden: 2 },
      { titulo: "DIR Floortime", descripcion: "Abordaje clínico basado en el juego, el vínculo y el desarrollo emocional.", icono: "HeartHandshake", orden: 3 },
      { titulo: "Prácticas Inclusivas", descripcion: "Acompañamiento escolar y estrategias de integración en contextos educativos.", icono: "GraduationCap", orden: 4 },
      { titulo: "Adolescentes y Adultos", descripcion: "Apoyo en las demandas de aprendizaje, autonomía y proyectos de vida.", icono: "MessageCircleHeart", orden: 5 },
    ];
    await Servicio.insertMany(servicios);
    console.log("✓ Servicios creados");

    // Artículos (Información)
    const articulos = [
      { titulo: "¿Quiénes pueden asistir al psicopedagog@?", tag: "Rompiendo mitos", imagen: "", descripcion: "Todas las personas en situación de aprendizaje pueden asistir.", cuerpo: ["Rompiendo mitos. Todas las personas pueden asistir al psicopedagog@.", "Acompañamos en el aprendizaje de TODAS las personas."], orden: 1 },
      { titulo: "Autismo: desarrollo simbólico e indicadores tempranos", tag: "Detección", imagen: "", descripcion: "Indicadores clave que pueden ser señales de riesgo hacia los 18 meses.", cuerpo: ["¿Cuáles son los indicadores clave que pueden ser señales de riesgo hacia los 18 meses?", "No señala para mostrar.", "No hace juego de simulación (simbólico) como por ejemplo: hacer de cuenta que come torta sin torta.", "No muestra miradas de referencia conjunta (mirar un juguete y mirarte)."], orden: 2 },
      { titulo: "Evaluación rutinaria del desarrollo", tag: "Enfoque", imagen: "", descripcion: "Enfoques en la evaluación del desarrollo: médico, psicológico y neuropsicológico.", cuerpo: ["El acercamiento médico hace hincapié en la descripción de los síntomas que presenta un niño para la determinación de una etiología y, en este caso, de una terapia adecuada.", "El enfoque psicológico intenta buscar los procesos cognitivos que se encuentran en la base de los comportamientos observados y proponer procesos educativos para reducir las consecuencias en el desarrollo posterior.", "Enfoque neuropsicológico: este planteamiento supone contemplar tanto el desarrollo normal como su alteración como un producto de la interacción del sustrato neurológico en evolución (mielinización) con la experiencia del niño a través del aprendizaje."], orden: 3 },
      { titulo: "Los navegantes: fábula con reflexión", tag: "Reflexión", imagen: "", descripcion: "No hay tormenta que no haya pasado: serenidad frente a los malos momentos.", cuerpo: ["Les comparto esta hermosa fábula con una reflexión.", "En la vida, vamos a pasar por momentos maravillosos, pero también otros que serán terribles. Y es precisamente en estos últimos cuando debemos mantener serenidad suficiente para afrontarlos, pues no hay tormenta que no haya pasado.", "Los malos momentos, aunque no lo crean, nos dejan enseñanzas y nos hacen más fuertes frente a futuras situaciones. La fe y la esperanza son también una gran ayuda para sobrellevarlo. ¡A no desesperar!"], orden: 4 },
      { titulo: "Reconocimiento de la Legislatura de Río Negro a mi libro", tag: "Libro", imagen: "", descripcion: "Declaración de interés educativo y social N° 138/2025 por “¿Y por qué no a mí?”", cuerpo: ["Siento una profunda emoción y gratitud al recibir el reconocimiento de la Legislatura de la Provincia de Río Negro por mi libro “¿Y por qué no a mí? Caminando por la vereda de la calle autismo”.", "Este libro nació desde la experiencia, el amor y la necesidad de poner en palabras un camino que muchas veces es solitario, pero que también está lleno de aprendizajes y de encuentros. Cada página refleja no solo mi voz, sino la de tantas familias y profesionales que día a día transitan junto a personas autistas, aprendiendo a mirar la vida desde otra vereda, con otros tiempos y otras lógicas.", "Este reconocimiento no es solo para mí: es para todas esas historias que muchas veces permanecen en silencio, y que merecen ser visibilizadas. Caminar por la vereda del autismo es caminar hacia un mundo más empático, más justo y más humano."], orden: 5 },
    ];
    await Articulo.insertMany(articulos);
    console.log("✓ Artículos creados");

    // FAQs
    const faqs = [
      { pregunta: "¿Las sesiones son online o presenciales?", respuesta: "Ambas. Presencial para quienes buscan un encuentro cercano, y online con la misma calidad clínica desde cualquier lugar.", orden: 1 },
      { pregunta: "¿Trabajan con padres?", respuesta: "Sí. Incluimos espacios de orientación a padres cada 4-6 sesiones, sin romper la confidencialidad con el niño/adolescente.", orden: 2 },
      { pregunta: "¿Cuánto dura el proceso?", respuesta: "Depende de cada caso, pero en la primera entrevista definimos objetivos y tiempos estimados. Promedio: 3 a 6 meses.", orden: 3 },
      { pregunta: "¿Cómo reservo un turno?", respuesta: "Tocás el botón Solicitar turno, nos contás tu caso por WhatsApp y coordinamos la primera escucha gratuita.", orden: 4 },
    ];
    await FAQ.insertMany(faqs);
    console.log("✓ FAQs creadas");

    // Datos de contacto
    await DatosContacto.create({
      whatsapp: "5491100000000",
      email: "hola@estefanisalaya.com",
      direccion: "Tucumán 445, General Roca, Río Negro 8332",
      instagram: "https://instagram.com/",
      horariosTexto: "Lun a Vie · 9 a 18 hs",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tucum%C3%A1n+445+General+Roca+R%C3%ADo+Negro",
    });
    console.log("✓ Datos de contacto creados");

    // Horarios
    await HorariosAtencion.create({
      dias: [
        { dia: "Lun", horas: ["09:00", "10:00", "11:00", "12:00", "13:00"] },
        { dia: "Mar", horas: ["09:00", "10:00", "11:00", "12:00", "13:00"] },
        { dia: "Mié", horas: ["14:00", "15:00", "16:00", "17:00"] },
        { dia: "Jue", horas: ["09:00", "10:00", "11:00", "12:00", "13:00"] },
        { dia: "Vie", horas: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"] },
      ],
    });
    console.log("✓ Horarios creados");

    // Turnos demo
    const turnos = [
      { dia: "Lun", hora: "09:00", nombre: "Juan Pérez", detalle: "Evaluación", estado: "pendiente" },
      { dia: "Lun", hora: "10:00", nombre: "Diego Torres", detalle: "Seguimiento", estado: "pendiente" },
      { dia: "Lun", hora: "11:00", nombre: "Carlos Ruiz", detalle: "Seguimiento", estado: "pendiente" },
      { dia: "Mar", hora: "09:00", nombre: "Lucía Díaz", detalle: "Primera escucha", estado: "pendiente" },
      { dia: "Mar", hora: "10:00", nombre: "María Gómez", detalle: "Seguimiento", estado: "pendiente" },
      { dia: "Mar", hora: "11:00", nombre: "Sofía Méndez", detalle: "Online", estado: "pendiente" },
      { dia: "Mié", hora: "15:00", nombre: "Lucía Díaz", detalle: "Primera escucha", estado: "confirmado" },
      { dia: "Mié", hora: "16:00", nombre: "María Gómez", detalle: "Online", estado: "confirmado" },
      { dia: "Mié", hora: "17:00", nombre: "Sofía Méndez", detalle: "Evaluación", estado: "confirmado" },
    ];
    await Turno.insertMany(turnos);
    console.log("✓ Turnos creados");

    // Config del sitio
    await Config.create({});
    console.log("✓ Config creada");

    // Anuncio de ejemplo (pausado para no molestar hasta que lo activen)
    await Anuncio.create({
      titulo: "17 de septiembre · Día de la Psicopedagogía",
      mensaje: "¡Feliz día a todos los profesionales!",
      imagen: "",
      activo: false,
      orden: 1,
    });
    console.log("✓ Anuncio de ejemplo creado");

    // Usuario admin
    await Usuario.create({
      nombre: "Estefani",
      email: "estefani@psicopedagoga.com",
      password: "admin123",
    });
    console.log("✓ Usuario admin creado (email: estefani@psicopedagoga.com, pass: admin123)");

    console.log("\n✅ Seed completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  }
};

seedData();