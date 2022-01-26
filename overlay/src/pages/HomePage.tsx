import { useNavigate } from 'react-router-dom';
import { bridge } from '../helpers/bridge';
import Button from '../components/Button';
import Header from '../components/Header';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
    </div>
  );
}

export default HomePage;
