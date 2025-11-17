import { useEffect, useState } from "react";
import "../../estilos/datosLaborales.css";
import { CircularProgress } from "@mui/material";
import { useUser } from "../../context/UserContext";
import type { PersonalDataType } from "./EditarDatosLaborales";
import CalendarioInput from "../../components/Calendario";
import HoraInput from "../../components/Hora";

interface DatosLaborales {
  departamento: string;
  puesto: string;
  turno: string;
  horario_entrada: string;
  horario_salida: string;
  fecha_ingreso: string;
  tipo_contrato: string;
}

interface Departamento {
  id_departamento: number;
  nombre: string;
}

interface Puesto {
  id_puesto: number;
  nombre: string;
}

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

export const DatosLaboralesDescrip = () => {
  // const [datos, setDatos] = useState<DatosLaborales | null>(null);
  const [cargando, setCargando] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [personalData, setPersonalData] = useState<PersonalDataType>({
    departamento: "",
    puesto: "",
    categoria: "",
    fechaAlta: "",
    horaIngreso: "",
    horaSalida: "",
    cantidadHoras: "",
    tipoContrato: "",
    estado: "",
    tipoSemana: "",
    turno: "",
  });
  const { usuario } = useUser();
  const idEmpleado = usuario?.id_empleado;
  const cargarOpciones = async () => {
    try {
      const [depRes, pueRes, catRes] = await Promise.all([
        fetch("https://kao-link-backend-gestion.onrender.com/api/departamentos/"),
        fetch("https://kao-link-backend-gestion.onrender.com/api/puestos/"),
        fetch("https://kao-link-backend-gestion.onrender.com/api/categorias/"),
      ]);
      const [depData, pueData, catData] = await Promise.all([
        depRes.json(),
        pueRes.json(),
        catRes.json(),
      ]);
      setDepartamentos(depData);
      setPuestos(pueData);
      setCategorias(catData);
    } catch (err) {
      console.error("Error al cargar opciones", err);
    }
  };

  const opcionesTipoContrato = [
    "Tiempo indeterminado",
    "Tiempo parcial",
    "A plazo fijo",
    "Por temporada",
    "Eventual",
    "Pasantia",
  ];

  const opcionesEstado = [
    "Activo",
    "Suspendido",
    "Desafectado",
    "Licencia",
    "En formación",
    "Jubilado",
    "Vacaciones",
  ];

  const opcionesSemanaLaboral = ["Normal", "Extendida", "Completa"];
  const opcionesTurno = ["Mañana", "Tarde", "Noche"];

  const cargarDatos = async () => {
    try {
      // Cargar opciones
      setCargando(true);
      const [depRes, pueRes, catRes] = await Promise.all([
        fetch("https://kao-link-backend-gestion.onrender.com/api/departamentos/"),
        fetch("https://kao-link-backend-gestion.onrender.com/api/puestos/"),
        fetch("https://kao-link-backend-gestion.onrender.com/api/categorias/"),
      ]);

      const [depData, pueData, catData] = await Promise.all([
        depRes.json(),
        pueRes.json(),
        catRes.json(),
      ]);

      setDepartamentos(depData.departamentos || []);
      setPuestos(pueData.puestos || []);
      setCategorias(catData.categorias || []);

      // Datos laborales del empleado (con IDs)
      const res = await fetch(
        `https://kao-link-backend-gestion.onrender.com/empleados/${idEmpleado}/informacion-laboral-completa`
      );
      const data = await res.json();

      // Mapear IDs a nombres
      const departamentoObj = depData.find(
        (d: Departamento) => d.id_departamento === data.id_departamento
      );
      const puestoObj = pueData.find(
        (p: Puesto) => p.id_puesto === data.id_puesto
      );
      const categoriaObj = catData.find(
        (c: Categoria) => c.id_categoria === data.id_categoria
      );

      setPersonalData({
        departamento: departamentoObj ? departamentoObj.nombre : "",
        puesto: puestoObj ? puestoObj.nombre : "",
        categoria: categoriaObj ? categoriaObj.nombre_categoria : "",
        fechaAlta: data.fecha_ingreso,
        horaIngreso: data.hora_inicio_turno,
        horaSalida: data.hora_fin_turno,
        cantidadHoras: data.cantidad_horas_trabajo?.toString() || "",
        tipoContrato: data.tipo_contrato,
        estado: data.estado,
        tipoSemana: data.tipo_semana_laboral,
        turno: data.turno,
      });
      setCargando(false);
    } catch (err) {
      console.error("Error al cargar datos laborales y opciones", err);
    }
  };

  useEffect(() => {
    if (!isNaN(idEmpleado as number)) {
      cargarDatos();
    }
  }, [idEmpleado]);

  const handleChange = (e: { target: { name?: string; value: string } }) => {
    const { name, value } = e.target;
    if (!name) return;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const departamentoSeleccionado = departamentos.find(
        (d) => d.nombre === personalData.departamento
      );
      const puestoSeleccionado = puestos.find(
        (p) => p.nombre === personalData.puesto
      );
      const categoriaSeleccionada = categorias.find(
        (c) => c.nombre_categoria === personalData.categoria
      );

      if (
        !departamentoSeleccionado ||
        !puestoSeleccionado ||
        !categoriaSeleccionada
      ) {
        alert("Seleccione valores válidos.");
        return;
      }

      const payload = {
        id_empleado: idEmpleado,
        id_departamento: departamentoSeleccionado.id_departamento,
        id_puesto: puestoSeleccionado.id_puesto,
        id_categoria: categoriaSeleccionada.id_categoria,
        fecha_ingreso: personalData.fechaAlta,
        turno: personalData.turno,
        hora_inicio_turno: personalData.horaIngreso,
        hora_fin_turno: personalData.horaSalida,
        cantidad_horas_trabajo: parseInt(personalData.cantidadHoras),
        tipo_contrato: personalData.tipoContrato,
        estado: personalData.estado,
        tipo_semana_laboral: personalData.tipoSemana,
      };
      console.log("Payload que se envía:", payload);
      let res;
      if (
        !payload.id_categoria ||
        !payload.id_departamento ||
        !payload.id_puesto ||
        !payload.fecha_ingreso ||
        !payload.turno ||
        !payload.hora_inicio_turno ||
        !payload.hora_fin_turno ||
        !payload.cantidad_horas_trabajo ||
        !payload.tipo_contrato ||
        !payload.estado ||
        !payload.tipo_semana_laboral
      ) {
        res = await fetch(
          "https://kao-link-backend-gestion.onrender.com/api/informacion-laboral/agregar",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch(
          "https://kao-link-backend-gestion.onrender.com/api/informacion-laboral/modificar",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err.detail || "No se pudo actualizar"));
        return;
      }

      alert("Información laboral actualizada correctamente");
      await cargarDatos();
      setIsEditable(false);
    } catch (error) {
      console.error("Error al guardar cambios", error);
    }
  };

  return (
    <div className="datos-laborales-box" style={{ position: "relative" }}>
      {cargando && (
        <div className="datos-laborales-overlay">
          <CircularProgress />
        </div>
      )}
      <div
        className="datos-laborales-content"
        style={{ filter: cargando ? "blur(2px)" : "none" }}
      >
        <h2 className="datos-laborales-title">Datos laborales</h2>
        <div className="datos-laborales-grid">
          <div className="datos-laborales-item">
            <p className="label">Departamento:</p>
            {isEditable ? (
              <select
                name="departamento"
                value={personalData.departamento}
                onChange={handleChange}
                className="value"
              >
                <option value="">Seleccione una opción</option>
                {departamentos.map((dep) => (
                  <option key={dep.id_departamento} value={dep.nombre}>
                    {dep.nombre}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={personalData.departamento}
                readOnly
                className="value"
              />
            )}
          </div>
          <div className="datos-laborales-item">
            <p className="label">Puesto:</p>
            {isEditable ? (
              <select
                name="puesto"
                value={personalData.puesto}
                onChange={handleChange}
                className="value"
              >
                <option value="">Seleccione una opción</option>
                {puestos.map((pue) => (
                  <option key={pue.id_puesto} value={pue.nombre}>
                    {pue.nombre}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={personalData.puesto}
                readOnly
                className="value"
              />
            )}
          </div>
          <div className="datos-laborales-item">
            <p className="label">Categoria:</p>
            {isEditable ? (
              <select
                name="categoria"
                value={personalData.categoria}
                onChange={handleChange}
                className="value"
              >
                <option value="">Seleccione una opción</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.nombre_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={personalData.categoria}
                readOnly
                className="value"
              />
            )}
          </div>
          <div className="datos-laborales-item">
            <p className="label">Turno:</p>
            {isEditable ? (
              <select
                name="turno"
                value={personalData.turno}
                onChange={handleChange}
                className="value"
              >
                <option value="">Seleccione una opción</option>
                {opcionesTurno.map((turno) => (
                  <option key={turno} value={turno}>
                    {turno}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={personalData.turno}
                readOnly
                className="value"
              />
            )}
          </div>
          <div className="datos-laborales-item">
            <p className="label">Horario de entrada:</p>
            <HoraInput
              name="horaIngreso"
              value={personalData.horaIngreso}
              onChange={handleChange}
              disabled={!isEditable} // Deshabilitado si no es editable
            />
            <p className="label">Horario de salida:</p>
            <HoraInput
              name="horaSalida"
              value={personalData.horaSalida}
              onChange={handleChange}
              disabled={!isEditable} // Deshabilitado si no es editable
            />
          </div>
          <div className="datos-laborales-item">
            <p className="label">Cant. horas laborales:</p>
            <input
              type="number"
              name="cantidadHoras"
              min={1}
              max={12}
              value={personalData.cantidadHoras}
              onChange={handleChange}
              className="value"
              placeholder="Ej: 8"
              disabled={!isEditable} // Deshabilitado si no es editable
            />
          </div>
          <div className="datos-laborales-item">
            <p className="label">Fecha de ingreso:</p>
            <CalendarioInput
              value={personalData.fechaAlta}
              onChange={(fecha) =>
                setPersonalData((prev) => ({ ...prev, fechaAlta: fecha }))
              }
              disabled={!isEditable} // Deshabilitado si no es editable
            />
          </div>
          <div className="datos-laborales-item">
            <p className="label">Tipo de contrato:</p>
            {isEditable ? (
              <select
                name="tipoContrato"
                value={personalData.tipoContrato}
                onChange={handleChange}
                className="value"
              >
                <option value="">Seleccione una opción</option>
                {opcionesTipoContrato.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={personalData.tipoContrato}
                readOnly
                className="value"
              />
            )}
          </div>
          <div className="datos-laborales-item">
            <p className="label">Estado:</p>
            {isEditable ? (
              <select
                name="estado"
                value={personalData.estado}
                onChange={handleChange}
                className="value"
              >
                <option value="">Seleccione una opción</option>
                {opcionesEstado.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={personalData.estado}
                readOnly
                className="value"
              />
            )}
          </div>
          <div className="datos-laborales-item">
            <p className="label">Semana laboral:</p>
            {isEditable ? (
              <select
                name="tipoSemana"
                value={personalData.tipoSemana}
                onChange={handleChange}
                className="value"
              >
                <option value="">Seleccione una opción</option>
                {opcionesSemanaLaboral.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={personalData.tipoSemana}
                readOnly
                className="value"
              />
            )}
          </div>
          <div className="datos-laborales-item">
            <p className="label">Turno:</p>
            {isEditable ? (
              <select
                name="turno"
                value={personalData.turno}
                onChange={handleChange}
                className="value"
              >
                <option value="">Seleccione una opción</option>
                {opcionesTurno.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={personalData.turno}
                readOnly
                className="value"
              />
            )}
          </div>
        </div>
        {usuario?.rol === "2" && (
          <div className="botones-edicion">
            {!isEditable ? (
              <button
                className="btn-modificar"
                onClick={() => {
                  setIsEditable(true);
                  cargarOpciones(); // forzamos recarga si se rompió antes
                }}
              >
                Modificar datos
              </button>
            ) : (
              <>
                <button className="btn-guardar" onClick={handleSave}>
                  Guardar cambios
                </button>
                <button
                  className="btn-cancelar"
                  onClick={() => setIsEditable(false)}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const DatosLaborales = () => {
  return (
    <div className="cont-datos-lab">
      <DatosLaboralesDescrip />
    </div>
  );
};
