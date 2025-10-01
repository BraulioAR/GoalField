import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Search, 
  AlertCircle, 
  CheckCircle,
  Trophy,
  DollarSign,
  Clock,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const ServiceCRUD = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      setServices(res.data);
      setFilteredServices(res.data);
    } catch (err) {
      setError('Failed to load services');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar 5MB');
        return;
      }

      // Validar tipo
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Solo se permiten imágenes JPG, PNG o WEBP');
        return;
      }

      setImageFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    
    try {
      // Crear FormData para enviar imagen
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('duration', form.duration);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/services/${editingId}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        setSuccess('¡Cancha actualizada exitosamente!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/services', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        setSuccess('¡Cancha creada exitosamente!');
      }
      
      setForm({ name: '', description: '', price: '', duration: '' });
      setImageFile(null);
      setImagePreview('');
      fetchServices();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service._id);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
    setImagePreview(service.imageUrl || '');
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', description: '', price: '', duration: '' });
    setImageFile(null);
    setImagePreview('');
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta cancha?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('¡Cancha eliminada exitosamente!');
      fetchServices();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Canchas</h1>
        <p className="text-gray-600">Administra las canchas disponibles para reserva</p>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center space-x-3 animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 flex items-center space-x-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario - Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm sticky top-24 animate-slide-right">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center space-x-2 text-xl">
                {editingId ? (
                  <>
                    <Edit2 className="w-5 h-5 text-blue-600" />
                    <span>Editar Cancha</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-green-600" />
                    <span>Nueva Cancha</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Upload de Imagen */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Imagen de la Cancha
                  </label>
                  
                  {/* Preview de imagen */}
                  {imagePreview ? (
                    <div className="relative mb-3 group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mb-3 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Sin imagen</p>
                    </div>
                  )}

                  {/* Input de archivo */}
                  <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {imageFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG o WEBP. Máx 5MB
                  </p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la Cancha
                  </label>
                  <div className="relative">
                    <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Ej: Cancha A - Fútbol 5"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    placeholder="Describe las características de la cancha..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                    Precio ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="50"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                    Duración (minutos)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="duration"
                      type="number"
                      placeholder="60"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                      min="15"
                      step="15"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className={`flex-1 h-11 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all ${
                      editingId 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      <>
                        {editingId ? (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            Actualizar
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5 mr-2" />
                            Crear
                          </>
                        )}
                      </>
                    )}
                  </Button>

                  {editingId && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="h-11 px-4 border-2 border-gray-300 hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Canchas */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-slide-left">
            <CardHeader className="border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <CardTitle className="text-2xl font-bold">Lista de Canchas</CardTitle>
                
                {/* Buscador */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar canchas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {filteredServices.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">
                    {searchTerm ? 'No se encontraron canchas' : 'No hay canchas registradas'}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => document.getElementById('name')?.focus()}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Crear Primera Cancha
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {/* Vista Desktop - Grid de Cards con Imagen */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredServices.map((service, index) => (
                      <div 
                        key={service._id}
                        className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-green-300 hover:shadow-lg transition-all animate-slide-up group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Imagen */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-400 to-emerald-600">
                          {service.imageUrl ? (
                            <img 
                              src={service.imageUrl} 
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-24 border-4 border-white rounded-full opacity-20"></div>
                              <div className="absolute w-12 h-12 border-4 border-white rounded-full"></div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="font-bold text-xl text-white truncate">{service.name}</h3>
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-4">
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 mb-3">
                            <div className="flex items-center text-green-600 font-bold">
                              <DollarSign className="w-5 h-5" />
                              <span className="text-lg">{service.price}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-5 h-5 mr-1" />
                              <span>{service.duration} min</span>
                            </div>
                          </div>

                          {/* Botones de acción */}
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleEdit(service)}
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 border-2 border-red-600 text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(service._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
        .animate-slide-right { animation: slide-right 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out backwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-spin { animation: spin 1s linear infinite; }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ServiceCRUD;