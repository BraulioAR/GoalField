import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Calendar, Trophy, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, services: 0, bookings: 0 });
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [usersRes, servicesRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/services'),
          axios.get('http://localhost:5000/api/bookings', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setStats({
          users: usersRes.data.length,
          services: servicesRes.data.length,
          bookings: bookingsRes.data.length,
        });
        setBookings(bookingsRes.data.slice(0, 5)); // Últimas 5 reservas
      } catch (err) {
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white/60 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Título y Descripción */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Panel de Estadísticas</h2>
        <p className="text-gray-600">Vista general del sistema de reservas</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center space-x-3 animate-shake">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Cards de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Users */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden animate-slide-up hover:scale-105 transition-transform">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-white">
              <span className="text-lg font-semibold">Usuarios Totales</span>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{stats.users}</p>
            <div className="flex items-center space-x-1 text-blue-100 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Usuarios registrados</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Services */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden animate-slide-up hover:scale-105 transition-transform" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-white">
              <span className="text-lg font-semibold">Canchas Activas</span>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{stats.services}</p>
            <div className="flex items-center space-x-1 text-green-100 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Canchas disponibles</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden animate-slide-up hover:scale-105 transition-transform" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-white">
              <span className="text-lg font-semibold">Reservas Totales</span>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{stats.bookings}</p>
            <div className="flex items-center space-x-1 text-purple-100 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Reservas realizadas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Reservas */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '300ms' }}>
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Calendar className="w-6 h-6 text-green-600" />
            <span>Últimas Reservas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay reservas aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking, index) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors animate-slide-up"
                  style={{ animationDelay: `${(index + 4) * 50}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{booking.service.name}</h4>
                      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{booking.user.name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(booking.dateTime).toLocaleString('es-ES', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out backwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Dashboard;