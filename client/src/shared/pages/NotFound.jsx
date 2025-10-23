import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center p-8">
                <div className="text-9xl font-bold text-primary mb-4">404</div>
                <h1 className="text-4xl font-bold text-base-content mb-4">Página no encontrada</h1>
                <p className="text-lg text-base-content/70 mb-8">
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>
                <Link to="/" className="btn btn-primary btn-lg">
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}