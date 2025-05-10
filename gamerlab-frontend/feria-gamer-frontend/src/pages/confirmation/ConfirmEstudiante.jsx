import { useState, useEffect } from 'react';
import { Container, Alert, Card } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import { confirmarEstudiante } from '../../api/equipoApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ConfirmEstudiante = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [studentInfo, setStudentInfo] = useState(null);

    useEffect(() => {
        // Si ya hay un error en los parámetros (redirigido desde backend con error)
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
            setLoading(false);
            return;
        }

        const fetchStudentInfo = async () => {
            if (!token) {
                setError('Token de confirmación no proporcionado');
                setLoading(false);
                return;
            }

            try {
                // En lugar de confirmar, solo obtenemos información del estudiante
                const response = await fetch(`http://localhost:3000/api/v1/equipo/estudiante-by-token?token=${token}`);
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                setSuccess(true);
                setStudentInfo(data);
            } catch (err) {
                setError('Error al obtener información: ' + (err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchStudentInfo();
    }, [token, errorParam]);

    



    if (loading) {
        return <LoadingSpinner text="Procesando confirmación..." />;
    }

    return (
        <Container className="py-5 text-center">
            <h1 className="mb-4">Confirmación de Registro</h1>

            {error ? (
                <Alert variant="danger">
                    <Alert.Heading>Error al confirmar registro</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">
                        Por favor, contacta al administrador del sistema si necesitas ayuda.
                    </p>
                </Alert>
            ) : (
                <Alert variant="success">
                    <Alert.Heading>¡Registro confirmado con éxito!</Alert.Heading>
                    <p>Tu participación en el evento ha sido confirmada.</p>
                </Alert>
            )}

            {studentInfo && (
                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Información del Estudiante</Card.Title>
                        <dl className="row justify-content-center">
                            <dt className="col-sm-3 text-end">Nombre:</dt>
                            <dd className="col-sm-9 text-start">{studentInfo.usuario?.nombre_completo}</dd>

                            <dt className="col-sm-3 text-end">Email:</dt>
                            <dd className="col-sm-9 text-start">{studentInfo.usuario?.email}</dd>

                            <dt className="col-sm-3 text-end">GitHub:</dt>
                            <dd className="col-sm-9 text-start">{studentInfo.github}</dd>

                            <dt className="col-sm-3 text-end">Equipo:</dt>
                            <dd className="col-sm-9 text-start">{studentInfo.equipo?.nombre_equipo}</dd>
                        </dl>
                    </Card.Body>
                </Card>
            )}

            <div className="mt-4">
                <Link to="/" className="btn btn-primary">
                    Ir a la página principal
                </Link>
            </div>
        </Container>
    );
};

export default ConfirmEstudiante;