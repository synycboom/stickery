import { useState } from 'react';
import EmojiContent from './EmojiContent';

const TAB_LIST = ['Emoji', 'NFT Stickers'];

const Tab = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <ul className="flex justify-center items-center bg-main-gray">
        {TAB_LIST.map((title, index) => (
          <TabItem
            index={index}
            key={index}
            title={title}
            activeIndex={activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </ul>
      {activeIndex === 0 && <EmojiContent />}
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
