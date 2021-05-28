export interface faviconFns {
    triggerNotification: () => void;
    clearNotification: () => void;
}
export interface faviconOptions {
    icon?: string;
    emoji?: string;
    awayEmoji?: string;
}
declare const useFavicon: ({ icon, emoji, awayEmoji }: faviconOptions) => faviconFns;
export default useFavicon;
