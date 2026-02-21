import { renderHook } from '@testing-library/react';
import { useOrigin } from '@/hooks/useOrigin';

describe('useOrigin', () => {
    it('returns the window origin when mounted', () => {
        const { result } = renderHook(() => useOrigin());

        // In standard jsdom testing without custom mocking, the origin is usually exactly 'http://localhost'
        // This relies on the internal implementation of jsdom setting default config values
        expect(result.current).toBe(window.location.origin);
    });
});
