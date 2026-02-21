import { renderHook, act } from '@testing-library/react';
import { useCoverImage } from '@/hooks/useCoverImage';

describe('useCoverImage', () => {
    beforeEach(() => {
        // Reset global state
        const { result } = renderHook(() => useCoverImage());
        act(() => {
            result.current.onClose();
            result.current.url = undefined; // Need direct state update if possible or ignore
        });
    });

    it('initializes correctly', () => {
        const { result } = renderHook(() => useCoverImage());
        expect(result.current.isOpen).toBe(false);
        expect(result.current.url).toBeUndefined();
    });

    it('onOpen sets isOpen true without url', () => {
        const { result } = renderHook(() => useCoverImage());
        act(() => {
            result.current.onOpen();
        });
        expect(result.current.isOpen).toBe(true);
        expect(result.current.url).toBeUndefined();
    });

    it('onReplace sets isOpen true and url', () => {
        const { result } = renderHook(() => useCoverImage());
        act(() => {
            result.current.onReplace('https://example.com/image.jpg');
        });
        expect(result.current.isOpen).toBe(true);
        expect(result.current.url).toBe('https://example.com/image.jpg');
    });

    it('onClose sets isOpen false and clears url', () => {
        const { result } = renderHook(() => useCoverImage());

        act(() => {
            result.current.onReplace('https://example.com/image.jpg');
        });

        act(() => {
            result.current.onClose();
        });

        expect(result.current.isOpen).toBe(false);
        expect(result.current.url).toBeUndefined();
    });
});
