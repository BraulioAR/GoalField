import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { User, Mail, Shield, Calendar, Clock, CheckCircle, XCircle, LogOut, Edit } from 'lucide-react';

/**
 * User Profile Component
 * @description Displays user profile information, booking history, and allows profile updates
 * @returns {JSX.Element} Profile UI with user details, update form, and bookings list
 */
const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Check authentication and fetch user profile and bookings
     * @description Redirects to login if no token, otherwise fetches user data and bookings
     * @async
     */
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const [userRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/bookings', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(userRes.data);
        setBookings(bookingsRes.data.filter((b) => b.user._id === userRes.data._id));
        setForm({ name: userRes.data.name, password: '' });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  /**
   * Handle profile update form submission
   * @param {React.FormEvent} e - Form submit event
   * @description Updates user name and/or password via API call
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updates = {};
      if (form.name) updates.name = form.name;
      if (form.password) updates.password = form.password;
      const res = await axios.put('http://localhost:5000/api/users/me', updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setForm({ ...form, password: '' });
      setError('');
      setSuccess('¡Perfil actualizado exitosamente!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  /**
   * Handle user logout
   * @description Clears token from localStorage and redirects to login
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  /**
   * Get CSS classes for booking status badge
   * @param {string} status - Booking status ('confirmed', 'pending', 'cancelled')
   * @returns {string} Tailwind CSS classes for the status badge
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  /**
   * Get icon component for booking status
   * @param {string} status - Booking status ('confirmed', 'pending', 'cancelled')
   * @returns {JSX.Element} Lucide icon for the status
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!user) {
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header con Avatar */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-xl">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información y reservas</p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center space-x-3 animate-shake">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 flex items-center space-x-3 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Tarjeta de Perfil */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-slide-up">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Edit className="w-6 h-6 text-green-600" />
                <span>Detalles del Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Info del Usuario */}
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Rol</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formulario de Actualización */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Actualizar Nombre
                  </label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nueva Contraseña
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Dejar en blanco para no cambiar"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Actualizar Perfil
                </Button>
              </form>

              <Button 
                variant="destructive" 
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all" 
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>

          {/* Tarjeta de Historial de Reservas */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Calendar className="w-6 h-6 text-green-600" />
                <span>Mis Reservas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No tienes reservas aún</p>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={() => navigate('/')}
                  >
                    Reservar Ahora
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {bookings.map((booking, index) => (
                    <div 
                      key={booking._id} 
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all bg-white animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {booking.service?.name || 'Unknown Service'}
                          </h3>
                          <div className="flex items-center space-x-2 text-gray-600 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(booking.dateTime).toLocaleString('es-ES', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}</span>
                          </div>
                        </div>
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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

export default Profile;