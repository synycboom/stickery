import Button from '../components/Button';
import { bridge } from '../helpers/bridge';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { accountState } from '../state';

function SignInPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useRecoilState(accountState);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    bridge.isWalletConnected().then(async (isWalletConnected) => {
      let accountName: string | undefined;
      if (isWalletConnected) {
        navigate('/');
        accountName = await bridge.getCurrentEthAccount();
        setAccount(accountName);
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (account) {
      navigate('/');
    }
  }, [account]);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      {!loading && (
        <>
          <img src="/green-logo.png" alt="logo" className="w-64 mb-16px" />
          <p className="text-sm text-dark-gray mb-40px">
            Please sign in to start using this application
          </p>
          <div className="w-full px-32px">
            <Button
              fullWidth
              onClick={async () => {
                const isWalletConnected = await bridge.isWalletConnected();
                let accountName: string;
                if (!isWalletConnected) {
                  accountName = await bridge.connectWallet();
                } else {
                  accountName = await bridge.getCurrentEthAccount();
                }
                setAccount(accountName);
              }}
            >
              <img className="mr-8px" src="/dapplets.svg" alt="dapplet-icon" /> Sign in with
              Dapplets
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default SignInPage;
