import { renderHook, act } from '@testing-library/react';
import { useScrollTop } from '@/hooks/use-scroll-top';

describe('useScrollTop', () => {
    it('should return false initially if scroll Y is 0', () => {
        const { result } = renderHook(() => useScrollTop());
        expect(result.current).toBe(false);
    });

    it('should return true when scrolled past threshold', () => {
        const { result } = renderHook(() => useScrollTop(10));

        // Simulate scroll event
        act(() => {
            window.scrollY = 20;
            window.dispatchEvent(new Event('scroll'));
        });

        expect(result.current).toBe(true);
    });

    it('should return false when scrolled back above threshold', () => {
        const { result } = renderHook(() => useScrollTop(10));

        act(() => {
            window.scrollY = 20;
            window.dispatchEvent(new Event('scroll'));
        });
        expect(result.current).toBe(true);

        act(() => {
            window.scrollY = 5;
            window.dispatchEvent(new Event('scroll'));
        });
        expect(result.current).toBe(false);
    });
});
