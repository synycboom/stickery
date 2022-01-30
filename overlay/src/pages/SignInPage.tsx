import Button from '../components/Button';
import { bridge } from '../helpers/bridge';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { accountState } from '../state';
import { checkAuthen, getChallengeCode, login } from '../apis/auth';

function SignInPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useRecoilState(accountState);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthen()
      .then(({ publicAddress }) => {
        setAccount(publicAddress);
        navigate('/');
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (account) {
      navigate('/');
    }
  }, [account, navigate]);

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
                try {
                  const account = await bridge.connectWallet();
                  const { challenge } = await getChallengeCode(account);
                  const hash = await bridge.signMessage(account, challenge);
                  await login(account, hash);
                  setAccount(account);
                } catch {
                  setLoading(false);
                }
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
