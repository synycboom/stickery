import Profile from './Profile';

const Header = () => {
  return (
    <>
      <div className="flex justify-between items-center p-16px h-48px p-8px bg-main-gray">
        <img src="/black-logo.png" className="h-24px" alt="logo" />
        <Profile />
      </div>
      <hr className="border-light-gray" />
    </>
  );
};

export default Header;
