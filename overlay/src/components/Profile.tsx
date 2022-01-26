import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bridge } from '../helpers/bridge';
import { formatAddress } from '../helpers/utils';
import Button from './Button';

const Profile = () => {
  const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState(false);

  const isNotification = true;

  return (
    <div>
      <div className="flex items-center cursor-pointer" onClick={() => setPopupOpen(true)}>
        <p className="text-sm text-dark-gray underline mr-8px">
          {formatAddress('0x083Ac158803771e565fd90f59bDa82Db79Ab2B43', 7)}
        </p>
        <img src="/profile.png" alt="profile-placeholder" className="h-24px w-24px rounded-full" />
        {isNotification && (
          <div className="bg-red-600 w-8px h-8px absolute rounded-full top-8px right-24px" />
        )}
      </div>
      {popupOpen && (
        <div className="absolute z-10 w-full h-full bg-transparent top-0 left-0">
          <div className="w-full h-full" onClick={() => setPopupOpen(false)} />
          <div className="fixed px-8px py-16px right-8px top-48px w-240px bg-white rounded-lg shadow-1">
            <Button
              fullWidth
              onClick={async () => {
                const isWalletConnected = await bridge.isWalletConnected();
                if (isWalletConnected) {
                  await bridge.disconnectWallet();
                  navigate('/sign-in');
                }
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
