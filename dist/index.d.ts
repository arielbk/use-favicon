export interface faviconFns {
    triggerNotification: () => void;
    clearNotification: () => void;
}
export interface faviconOptions {
    icon: string;
}
declare const useFavicon: ({ icon }: faviconOptions) => faviconFns;
export default useFavicon;
