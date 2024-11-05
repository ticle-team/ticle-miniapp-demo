'use client';

import {
  backButton,
  themeParams,
  miniApp,
  initData,
  init as initSDK,
} from '@telegram-apps/sdk-react';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

type TelegramInitContext = {
  mounted: boolean;
};
const telegramInitContext = createContext<TelegramInitContext | null>(null);

export function TelegramInit({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const deinitSDK = initSDK();

    // Mount all components used in the project.
    backButton.mount();
    miniApp.mount();
    themeParams.mount();

    initData.restore();

    const unbindMiniApp = miniApp.bindCssVars();
    const unbindThemeParams = themeParams.bindCssVars();

    console.log('miniapp mounted');
    setMounted(true);

    return () => {
      setMounted(false);
      unbindThemeParams();
      unbindMiniApp();
      themeParams.unmount();
      miniApp.unmount();
      backButton.unmount();
      deinitSDK();
    };
  }, []);

  return (
    <telegramInitContext.Provider value={{ mounted }}>
      {children}
    </telegramInitContext.Provider>
  );
}

export function useTelegramInit() {
  const context = useContext(telegramInitContext);
  if (!context) {
    throw new Error('useTelegramInit must be used within a TelegramInit');
  }

  return context;
}
