/**
 * Handle smooth scroll to a target element
 * @param e - React mouse event
 * @param targetId - ID of the target element
 */
declare const handleSmoothScroll: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
/**
 * Scroll to the top of the page smoothly
 */
declare const scrollToTop: () => void;

export { handleSmoothScroll, scrollToTop };
