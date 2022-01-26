module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '22px',
        '3xl': '24px',
      },
      colors: {
        'light-gray': '#E3E3E3',
        'base-gray': '#EBEBEB',
        'dark-gray': '#747376',
        'black-gray': '#2A2A2A',
      },
      spacing: {
        '8px': '8px',
        '16px': '16px',
        '24px': '24px',
        '32px': '32px',
        '40px': '40px',
        '48px': '48px',
        '240px': '240px',
      },
      height: {
        '40px': '40px',
      },
      borderRadius: {
        '20px': '20px',
      },
      boxShadow: {
        1: '1px 1px 4px #c3c3c3',
      },
    },
  },
  plugins: [],
};
