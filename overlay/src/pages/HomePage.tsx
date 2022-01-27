import { useNavigate } from 'react-router-dom';
import { bridge } from '../helpers/bridge';
import Button from '../components/Button';
import Header from '../components/Header';
import Tab from '../components/Tab';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <Tab></Tab>
    </div>
  );
}

export default HomePage;
