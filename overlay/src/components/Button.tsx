type ButtonProps = {
  children: any;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => {};
};

function Button({ children, onClick, fullWidth, className = '' }: ButtonProps) {
  const extendedClassName = `${fullWidth && 'w-full'} ${className}`;
  return (
    <button
      className={`flex justify-center items-center bg-white h-40px border-light-gray border-solid border rounded-20px text-dark-gray text-sm px-16px hover:border-dark-gray hover:text-black-gray active:border-black-gray active:text-black active:bg-gray-50 ${extendedClassName}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;

// display: flex;
// flex-direction: row;
// justify-content: center;
// align-items: center;
// padding: 0px 10px;

// position: absolute;
// width: 300px;
// height: 40px;
// left: 20px;
// top: 20px;

// /* MainColors/Stroke */

// border: 1px solid #E3E3E3;
// box-sizing: border-box;
// border-radius: 20px;
