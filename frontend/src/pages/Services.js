import { useEffect, useState } from 'react';
import axios from 'axios';
import BookingForm from '../components/BookingForm';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const res = await axios.get('/api/services');
      setServices(res.data);
    };
    fetchServices();
  }, []);

  return (
    <div>
      {services.map((service) => (
        <div key={service._id}>
          <h2>{service.name}</h2>
          <BookingForm serviceId={service._id} />
        </div>
      ))}
    </div>
  );
};

export default Services;