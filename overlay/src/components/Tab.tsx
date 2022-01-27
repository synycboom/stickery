import { useState } from 'react';

const TAB_LIST = ['Emoji', 'NFT Stickers'];

const number = Array.from(Array(10).keys());
const Tab = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <ul className="flex justify-center items-center bg-main-gray">
        {TAB_LIST.map((title, index) => (
          <TabItem
            index={index}
            title={title}
            activeIndex={activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </ul>
      {activeIndex === 0 && (
        <div className="p-8px">
          <div className="flex items-center after:border-light-gray after:ml-8px after:border-solid after:border after:flex-1 py-16px">
            <span className="text-xs font-medium text-dark-gray">Stickerpack name</span>
          </div>
          <div className="flex flex-wrap justify-between">
            {number.map(() => (
              <img src="/sample.png" className="w-100px h-100px p-4px" alt="sticker" />
            ))}
          </div>
        </div>
      )}
      {activeIndex === 1 && <p className="p-24px text-center">Coming soon...</p>}
    </>
  );
};

type TabItemProps = {
  index: number;
  activeIndex: number;
  title: string;
  onClick: () => void;
};

const TabItem = ({ index, activeIndex, title, onClick }: TabItemProps) => (
  <li
    className={`w-full cursor-pointer text-center text-sm p-16px text-dark-gray border-b-4 ${
      activeIndex === index ? 'text-main-green border-main-green' : 'border-main-gray'
    }`}
    onClick={onClick}
  >
    {title}
  </li>
);

export default Tab;
