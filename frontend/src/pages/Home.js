import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';

const Home = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('https://goalfield.onrender.com/api/services');
        setServices(res.data);
      } catch (err) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleBookNow = (serviceId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate(`/booking/${serviceId}`);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con efecto blur y césped */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50 to-emerald-100 opacity-90"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(34, 197, 94, 0.1) 2px,
              rgba(34, 197, 94, 0.1) 4px
            )`
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Reserva Tu Cancha
            <span className="block text-green-600 mt-2">De Fútbol Ideal</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Las mejores canchas para tu próximo partido. Reserva fácil y rápido.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center animate-shake">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl h-96"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service._id}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                  {/* Imagen de la cancha */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-400 to-emerald-600">
                    <img src={service.imageUrl} alt='Field Image'/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-4 border-white rounded-full opacity-20"></div>
                      <div className="absolute w-16 h-16 border-4 border-white rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold">Disponible</span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {service.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="font-medium">{service.duration} min</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ${service.price}
                      </div>
                    </div>

                    <Button
                      className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleBookNow(service._id)}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Reservar Ahora
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Home;