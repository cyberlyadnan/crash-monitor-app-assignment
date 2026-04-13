import { NativeModules, Platform } from 'react-native';

export type AppIconKey = 'default' | 'blue' | 'green';

type AppIconNativeModule = {
  getSelectedIcon: () => Promise<AppIconKey>;
  setSelectedIcon: (icon: AppIconKey) => Promise<AppIconKey>;
};

const nativeModule = NativeModules.AppIconModule as AppIconNativeModule | undefined;

export function isAppIconSwitchSupported(): boolean {
  return Platform.OS === 'android' && !!nativeModule;
}

export async function getSelectedAppIcon(): Promise<AppIconKey> {
  if (!isAppIconSwitchSupported()) return 'default';
  const selected = await nativeModule!.getSelectedIcon();
  if (selected === 'blue' || selected === 'green' || selected === 'default') {
    return selected;
  }
  return 'default';
}

export async function setSelectedAppIcon(icon: AppIconKey): Promise<AppIconKey> {
  if (!isAppIconSwitchSupported()) return 'default';
  const selected = await nativeModule!.setSelectedIcon(icon);
  if (selected === 'blue' || selected === 'green' || selected === 'default') {
    return selected;
  }
  return 'default';
}
