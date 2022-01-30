import { useCategories, useStickers } from '../helpers/use';

const EmojiContent = () => {
  const categories = useCategories();

  if (!categories) return null;

  return (
    <div className="p-8px">
      {categories.map((category) => (
        <div key={category.id}>
          <div className="flex items-center after:border-light-gray after:ml-8px after:border-solid after:border after:flex-1 py-16px">
            <span className="text-xs font-medium text-dark-gray">{category.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StickerList categoryId={category.id} />
          </div>
        </div>
      ))}
    </div>
  );
};

const StickerList = ({ categoryId }: { categoryId: number }) => {
  const stickers = useStickers(categoryId);

  if (!stickers) return null;

  return (
    <>
      {stickers.map(({ id, url }) => (
        <img key={id} src={url} className="w-100px h-100px p-4px" alt="sticker" />
      ))}
    </>
  );
};

export default EmojiContent;
