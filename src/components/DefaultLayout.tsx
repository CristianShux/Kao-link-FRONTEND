import React from "react";
import "./estilos/default-layout.css";

interface DefaultLayoutProps {
  children?: React.ReactNode;
}
export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="default-layout">
      <div className="cont-empresa">
        <div className="empresa-logo">
          <img src="/kao_link.png" alt="Logo de la empresa" />
        </div>
        <div className="empresa-integrantes">
          <h3>Sistema de Reconocimiento Facial</h3>
          <p>Orientado a empresas que quieran agilizar los procesos de entrada y salida de sus empleados
            de forma segura y autogestionada. Las características principales del sistema son las siguientes:
          </p>
          <ul>
            <li>Cifrado de vectores biometricos</li>
            <li>Hasheo de contraseñas</li>
            <li>Implementación de WebSocket</li>
            <li>Autenticación y Autorización Distribuida con JWT</li>
          </ul>
        </div>
      </div>
      <div className="cont-child">{children}</div>
    </div>
  );
}
