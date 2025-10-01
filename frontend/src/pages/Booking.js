import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, ArrowLeft, Info } from 'lucide-react';

const Booking = () => {
  const { serviceId } = useParams();
  const [dateTime, setDateTime] = useState('');
  const [service, setService] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingService, setLoadingService] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`https://goalfield.onrender.com/api/services/${serviceId}`);
        setService(res.data);
      } catch (err) {
        setError('No se pudo cargar la información de la cancha');
      } finally {
        setLoadingService(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://goalfield.onrender.com/api/bookings',
        { service: serviceId, dateTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Mostrar mensaje de éxito antes de navegar
      navigate('/', { state: { bookingSuccess: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo completar la reserva');
    } finally {
      setLoading(false);
    }
  };

  // Obtener fecha mínima (hoy)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Obtener fecha máxima (3 meses adelante)
  const getMaxDateTime = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate.setMinutes(maxDate.getMinutes() - maxDate.getTimezoneOffset());
    return maxDate.toISOString().slice(0, 16);
  };

  if (loadingService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-green-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-green-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Botón de regreso */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-green-600 animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a canchas
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información de la Cancha */}
          {service && (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-slide-left">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <span>Detalles de la Cancha</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Imagen/Visual de la cancha */}
                <div className="relative h-40 overflow-hidden rounded-xl bg-gradient-to-br from-green-400 to-emerald-600">
                  <img src={service.imageUrl} alt='Field Image' className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 border-4 border-white rounded-full opacity-20"></div>
                    <div className="absolute w-12 h-12 border-4 border-white rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                {/* Info de la cancha */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Duración: {service.duration} min</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      ${service.price}
                    </div>
                  </div>

                  {/* Info adicional */}
                  <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-semibold mb-1">Información importante:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Llega 10 minutos antes</li>
                        <li>Trae tu equipo deportivo</li>
                        <li>Cancelaciones con 24h de anticipación</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulario de Reserva */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-slide-right">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-green-600" />
                <span>Reservar Cancha</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selector de fecha y hora */}
                <div>
                  <label htmlFor="dateTime" className="block text-sm font-semibold text-gray-700 mb-3">
                    Selecciona Fecha y Hora
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <input
                      id="dateTime"
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      min={getMinDateTime()}
                      max={getMaxDateTime()}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Puedes reservar hasta 3 meses por adelantado
                  </p>
                </div>

                {/* Resumen de la reserva */}
                {dateTime && service && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl animate-fade-in">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Resumen de tu reserva:</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📅 {new Date(dateTime).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                      <p>🕐 {new Date(dateTime).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</p>
                      <p className="font-semibold text-green-700 pt-2 border-t border-green-200 mt-2">
                        Total a pagar: ${service.price}
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-shake">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading || !dateTime}
                  className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 mr-2" />
                      Confirmar Reserva
                    </>
                  )}
                </Button>

                {/* Política de cancelación */}
                <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
                  <p>Al confirmar, aceptas nuestra política de cancelación.</p>
                  <p>Cancelaciones gratuitas hasta 24h antes.</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-left { animation: slide-left 0.6s ease-out; }
        .animate-slide-right { animation: slide-right 0.6s ease-out 0.1s backwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default Booking;