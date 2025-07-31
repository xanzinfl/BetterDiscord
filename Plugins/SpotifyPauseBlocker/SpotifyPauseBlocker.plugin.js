/**
 * @name SpotifyPauseBlocker
 * @description Prevents Discord from pausing Spotify.
 * @author xanzinfl
 * @authorId 888591350986047508
 * @version 1.0.5
 * @invite svSmDEvZQw
 * @source https://github.com/xanzinfl/BetterDiscord/blob/main/Plugins/SpotifyPauseBlocker
 * @website https://github.com/xanzinfl
 */

module.exports = class SpotifyPauseBlocker {
    constructor() {
        this.originalFetch = null;
        this.originalXHROpen = null;
        this.originalXHRSend = null;
    }

    start() {
        this.overrideFetch();
        this.overrideXHR();
    }

    stop() {
        this.restoreFetch();
        this.restoreXHR();
    }

    overrideFetch() {
        if (window.fetch) {
            this.originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const [resource] = args;
                let url = resource;
                if (resource instanceof Request) {
                    url = resource.url;
                }
                if (typeof url === "string" && url.includes("/v1/me/player/pause")) {
                    return Promise.resolve(new Response(null, { status: 200 }));
                }
                return this.originalFetch.apply(window, args);
            };
        }
    }

    overrideXHR() {
        if (window.XMLHttpRequest) {
            const xhrProto = XMLHttpRequest.prototype;
            const originalXHROpen = xhrProto.open;
            const originalXHRSend = xhrProto.send;
            this.originalXHROpen = originalXHROpen;
            this.originalXHRSend = originalXHRSend;
            xhrProto.open = function (method, url, ...rest) {
                this._url = url;
                return originalXHROpen.apply(this, [method, url, ...rest]);
            };
            xhrProto.send = function (...args) {
                if (typeof this._url === "string" && this._url.includes("/v1/me/player/pause")) {
                    Object.defineProperty(this, "readyState", { value: 4, configurable: true });
                    Object.defineProperty(this, "responseText", { value: "", configurable: true });
                    Object.defineProperty(this, "response", { value: "", configurable: true });
                    Object.defineProperty(this, "status", { value: 200, configurable: true });

                    this.onload?.();
                    this.onreadystatechange?.();
                    this.dispatchEvent(new Event("load"));
                    this.dispatchEvent(new Event("readystatechange"));
                } else {
                    return originalXHRSend.apply(this, args);
                }
            };
        }
    }

    removeBanner() {
        const remove = () => {
            const banner = document.querySelector('div.notice__6e2b9.colorDanger__6e2b9');
            if (banner && banner.textContent.includes("Spotify playback paused")) {
                banner.remove();
            }
        };
        remove();
        this.bannerObserver = new MutationObserver(remove);
        this.bannerObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    restoreFetch() {
        if (this.originalFetch) {
            window.fetch = this.originalFetch;
        }
    }

    restoreXHR() {
        if (this.originalXHROpen && this.originalXHRSend) {
            XMLHttpRequest.prototype.open = this.originalXHROpen;
            XMLHttpRequest.prototype.send = this.originalXHRSend;
        }
    }

    stopBannerObserver() {
        if (this.bannerObserver) {
            this.bannerObserver.disconnect();
            this.bannerObserver = null;
        }
    }
};