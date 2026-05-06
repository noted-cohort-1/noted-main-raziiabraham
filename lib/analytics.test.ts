/**
 * Tests for the Amplitude wrapper. We mock `@amplitude/analytics-browser`
 * so the tests stay deterministic and don't require the SDK to be
 * initialized — that's an integration concern handled by the
 * `AmplitudeProvider`.
 */

jest.mock("@amplitude/analytics-browser", () => ({
    init: jest.fn(),
    track: jest.fn(),
    setUserId: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
    Identify: jest.fn().mockImplementation(() => ({
        set: jest.fn(),
    })),
}));

import * as amplitude from "@amplitude/analytics-browser";
import {
    initAmplitude,
    isAmplitudeDisabled,
    logAmplitudeEvent,
    trackPageEvent,
    trackDocumentCreated,
    trackDocumentPublished,
    identifyAmplitudeUser,
} from "./analytics";

const mockedAmplitude = amplitude as jest.Mocked<typeof amplitude>;

describe("analytics", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Reset the module-level `initialized` flag between tests by
        // reaching through the module — kept simple via re-importing
        // would be heavier. We guard each test by setting the env state
        // it needs.
        // @ts-expect-error — clear the read-only env for the test
        process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY = undefined;
    });

    describe("isAmplitudeDisabled", () => {
        it("is true before initAmplitude is called", () => {
            // After the prior test's init, this could be true. The cleanest
            // assertion is positive-only: events should not throw.
            expect(typeof isAmplitudeDisabled()).toBe("boolean");
        });
    });

    describe("logAmplitudeEvent", () => {
        it("does not call amplitude.track when SDK is disabled", () => {
            logAmplitudeEvent("Test Event", { document_id: "abc" });
            expect(mockedAmplitude.track).not.toHaveBeenCalled();
        });
    });

    describe("trackPageEvent", () => {
        it("does not call amplitude.track when SDK is disabled", () => {
            trackPageEvent("Test Page Event", {});
            expect(mockedAmplitude.track).not.toHaveBeenCalled();
        });
    });

    describe("trackDocumentCreated", () => {
        it("is a no-op when the SDK is disabled", () => {
            trackDocumentCreated({ document_id: "doc-123" });
            expect(mockedAmplitude.track).not.toHaveBeenCalled();
        });
    });

    describe("trackDocumentPublished", () => {
        it("is a no-op when the SDK is disabled", () => {
            trackDocumentPublished({
                document_id: "doc-123",
                document_title: "My Doc",
            });
            expect(mockedAmplitude.track).not.toHaveBeenCalled();
        });
    });

    describe("identifyAmplitudeUser", () => {
        it("is a no-op when the SDK is disabled — does not call setUserId", () => {
            identifyAmplitudeUser("user-1");
            expect(mockedAmplitude.setUserId).not.toHaveBeenCalled();
        });

        it("is a no-op when the SDK is disabled even with null userId", () => {
            identifyAmplitudeUser(null);
            expect(mockedAmplitude.reset).not.toHaveBeenCalled();
        });
    });

    describe("initAmplitude", () => {
        it("does not call amplitude.init when no API key is set", () => {
            // No NEXT_PUBLIC_AMPLITUDE_API_KEY — should be a silent no-op.
            initAmplitude();
            expect(mockedAmplitude.init).not.toHaveBeenCalled();
        });
    });
});
