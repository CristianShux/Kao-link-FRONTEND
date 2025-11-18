import axios from "axios";

const API_URL= "https://kao-link-backend-gestion.onrender.com";

export const WS_URL = "wss://kaolinkwebsocket.duckdns.org/ws/"; // URL del WebSocket

// Instancia de Axios configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ModificarData {
  telefono: string;
  correo_electronico: string;
  calle: string;
  numero_calle: string;
  localidad: string;
  partido: string;
  provincia: string;
}

export interface RegistroHorario {
  tipo: string;
  fecha: string;
  hora: string | Date;
  estado_asistencia: string;
  turno_asistencia: string;
  puesto_del_asistente: string;
  vector_capturado: string;
}

export interface DatosBancarios {
  numero_cuenta: string;
  tipo_cuenta: string;
  nombre: string;
}

export interface DocumentoData {
  archivo: File;
  tipo: string;
  empleado_id: number;
  descripcion?: string;
}

export interface DatosLaboralesCompletos {
  id_empleado: number;
  id_departamento: number;
  id_puesto: number;
  id_categoria: number;
  fecha_ingreso: string;
  turno: string;
  hora_inicio_turno: string;
  hora_fin_turno: string;
  cantidad_horas_trabajo: number;
  tipo_contrato: string;
  estado: string;
  tipo_semana_laboral: string;
}

// 1. Listar empleados
export const listarEmpleados = async () => {
  const response = await api.get("/empleados/");
  return response.data;
};

// 2. Obtener empleado por número de identificación
export const obtenerEmpleadoPorIdentificacion = async (
  numeroIdentificacion: string
) => {
  const response = await api.get(`/empleados/${numeroIdentificacion}`);
  return response.data;
};

// 3. Actualizar datos personales del empleado con Put (reemplaza todo)
export const actualizarDatosEmpleado = async (
  empleadoId: string,
  nuevosDatos: ModificarData
) => {
  const response = await api.put(
    `/empleados/${empleadoId}/datos-personales`,
    nuevosDatos
  );
  return response.data;
};

// Actualizar empleados con Patch (reemplaza parcialmente los datos)
export const actualizarDatosPersonalesEmpleado = async (
  empleadoId: string,
  // usuarioId: string | number,
  nuevosDatos: ModificarData
) => {
  const response = await api.patch(
    `/empleados/${empleadoId}/datos-personales`,
    nuevosDatos
  );
  return response.data;
};

// 4. Obtener registro de asistencias del empleado
export const registroAsistenciasPorId = async (
  numeroId: string
) => {
  // const mes = new Date().getMonth() + 1;
  // const anio = new Date().getFullYear();

  const response = await api.get(
    // `/registros/${numeroId}?año=${anio}&mes=${mes}`
    `/registroscompleto/${numeroId}`
  );
  
  return response.data;
};


// 5. Obtener datos laborales del empleado
export const datosLabPorId = async (id_empleado: string) => {
  const response = await api.get(`empleados/${id_empleado}/informacion-laboral`);
  return response.data;
}

// 6. Crear empleado
export const crearEmpleado = async (nuevoEmpleado: any) => {
  console.log("Enviando a backend:", nuevoEmpleado);
  const response = await api.post("/crear-empleado/", nuevoEmpleado);
  return response.data;
};

export const crearEmpleado2 = async (nuevoEmpleado: any) => {
  console.log("Enviando a backend:", nuevoEmpleado);
  const response = await api.post("/crear-empleado2/", nuevoEmpleado);
  return response.data;
};



// Login
// 7. Iniciar sesión y obtener token + permisos
export const iniciarSesion = async (username: string, password: string) => {
  try {
    const response = await api.post("/login", {
      username,
      password,
    });

    // Devuelve toda la respuesta del login
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error en la respuesta:", error.response.data);
      return error.response.data;
    } else {
      console.error("Error de conexión:", error.message);
      return { error: error.message };
    }
  }
}

// Crear usuario
export const crearUsuario = async (
  id_empleado: number | string,
  id_rol: number | string,
  nombre_usuario: string,
  contrasena: string,
  motivo: string
) => {
  try {
    const response = await api.post("/crear-usuario/", {
      id_empleado,
      id_rol,
      nombre_usuario,
      contrasena,
      motivo,
    });

    return response.data;
  } catch (e: any) {
    console.error("Error detallado al crear usuario:", e.response?.data || e.message); 
    throw e; 
  }
};

export const enviarImg = async (imagen: File, usuario_id: string) => {
  const formData = new FormData();
  formData.append("image", imagen);
  formData.append("usuario_id", usuario_id);

  try {
    const response = await api.post(
      "/cargar-image/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error al enviar la imagen:", error.response?.data || error);
    console.log(error.response?.data);
    throw error;
  }
};


export const subirDocumentos = async ({
  archivo,
  tipo,
  empleado_id,
  descripcion,
}: DocumentoData): Promise<any> => {
  const formData = new FormData();
  formData.append("archivo", archivo);
  formData.append("tipo", tipo);
  formData.append("empleado_id", empleado_id.toString());

  if (descripcion) {
    formData.append("descripcion", descripcion);
  }

  try {
    const response = await api.post(
      "/api/documentos/subir-titulo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error al subir el documento: ", tipo, error);
    throw error;
  }
};

export const enviarMail = async (
  correo: string,
  asunto: string,
  mensaje: string
) => {
  try {
    const response = await api.post('/api/enviar-correo-manual/', {
    correo,
    asunto,
    mensaje
  });
    
    return response.data;
  } catch (error: any) {
    console.error("Error al enviar mail:", error);
    throw error;
  }
}
