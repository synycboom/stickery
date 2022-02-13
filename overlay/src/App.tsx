import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import { bridge } from './helpers/bridge';
import { stick, removeStickedSticker, getPosts, getStickers } from './apis';
import { NormalizedPost, Post } from './interfaces';

import './App.css';

const normalizeAndEnrichPosts = async (posts: Post[]): Promise<NormalizedPost> => {
  const stickerIds: string[] = [];
  const stickerUrlMap: Record<string, string> = {};
  for (let post of posts) {
    for (let position of post.positions) {
      if (position.stickerId) {
        stickerIds.push(position.stickerId);
      }

      // TODO: Implement url enrichment for NFT tokens
    }
  }

  if (stickerIds.length > 0) {
    const { items } = await getStickers(undefined, stickerIds);
    for (let item of items) {
      stickerUrlMap[item.id] = item.url;
    }
  }

  const result: NormalizedPost = {};
  for (let post of posts) {
    for (let position of post.positions) {
      if (!result[post.foreignId]) {
        result[post.foreignId] = {};
      }

      result[post.foreignId][position.location] = {
        stickerId: position.stickerId || '',
        nftTokenAddress: position.nftTokenAddress || '',
        nftTokenId: position.nftTokenId || '',
        imageUrl: position.stickerId ? stickerUrlMap[position.stickerId] : '',
      }
    }
  }

  return result;
};

function App() {
  useEffect(() => {
    bridge.onStick(async (data) => {
      try {
        let position: Record<string, string> = {
          stickerId: data.stickerId,
        };
        if (data.nftTokenAddress) {
          position = {
            nftTokenAddress: data.nftTokenAddress, 
            nftTokenId: data.nftTokenId,
          }
        }

        const payload = {
          position: {
            ...position,
            location: data.location,
          },
          platform: data.platform,
          foreignId: data.postId,
        };

        await stick(payload);
      } catch (err) {
        console.error(err);
      }
    });

    bridge.onGetPosts(async (data) => {
      try {
        const { items: posts } = await getPosts(data.platform, data.postIds);
        const normalizedPost = await normalizeAndEnrichPosts(posts);
        await bridge.sendPostsResult(normalizedPost);
      } catch (err) {
        console.error(err);
      }
    });

    bridge.onRemoveSticker(async (data) => {
      try {
        await removeStickedSticker({
          position: {
            location: data.location,
          },
          platform: data.platform,
          foreignId: data.postId,
        });
        await bridge.removeStickerSuccess(data.postId, data.location);
        await bridge.sendNotification('Successfully removed a sticker', 'success');
      } catch (err) {
        await bridge.sendNotification('Failed to remove a sticker', 'error');
        console.error(err);
      }
    });
  }, []);

  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
