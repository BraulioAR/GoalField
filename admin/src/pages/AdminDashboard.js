import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Dashboard from '../components/Dashboard';
import { LogOut, Settings, LayoutDashboard, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Header Moderno */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y Título */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GoalField Admin</h1>
                <p className="text-sm text-gray-500">Panel de Control</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="hidden md:flex items-center space-x-2 border-2 border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => navigate('/services')}
              >
                <Settings className="w-4 h-4" />
                <span>Gestionar Canchas</span>
              </Button>
              <Button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <Dashboard />

      {/* Quick Actions (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 shadow-2xl"
          onClick={() => navigate('/services')}
        >
          <Calendar className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;