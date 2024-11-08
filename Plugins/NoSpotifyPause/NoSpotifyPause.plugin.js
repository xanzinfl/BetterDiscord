/**
 * @name NoSpotifyPause
 * @description Prevents Discord from pausing Spotify.
 * @author xanzinfl
 * @authorId 888591350986047508
 * @version 1.0.2
 * @invite svSmDEvZQw
 * @source https://github.com/xanzinfl/BetterDiscord/blob/main/Plugins/NoSpotifyPause
 * @website https://github.com/xanzinfl
 * @updateurl https://raw.githubusercontent.com/xanzinfl/BetterDiscord/main/Plugins/NoSpotifyPause/NoSpotifyPause.plugin.js
 */
const config = {
    main: "index.js",
    name: "NoSpotifyPause",
    author: "xanzinfl",
    authorId: "888591350986047508",
    authorLink: "https://github.com/xanzinfl",
    version: "1.0.2",
    description: "Prevents Discord from pausing Spotify.",
    github: "https://github.com/xanzinfl/BetterDiscord/",
    github_raw: "https://raw.githubusercontent.com/xanzinfl/BetterDiscord/main/Plugins/NoSpotifyPause/NoSpotifyPause.plugin.js",
    changelog: [
        {
            title: "Fixes",
            type: "fixed",
            items: [
                "Fixed context issue in XMLHttpRequest override.",
                "Plugin now blocks Spotify pause requests without errors."
            ]
        }
    ]
};

class Dummy {
    constructor() { this._config = config; }
    start() { }
    stop() { }
}

if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}

module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Library]) => {
    return class NoSpotifyPause extends Plugin {
        constructor() {
            super();
            this.originalFetch = null;
            this.originalXHROpen = null;
            this.originalXHRSend = null;
        }
        onStart() {
            if (window.fetch) {
                this.originalFetch = window.fetch;
                window.fetch = async (...args) => {
                    const [resource] = args;

                    let url = resource;
                    if (resource instanceof Request) {
                        url = resource.url;
                    }

                    if (typeof url === 'string' && url.includes('/v1/me/player/pause')) {
                        return Promise.resolve(new Response(null, { status: 200 }));
                    }

                    return this.originalFetch.apply(window, args);
                };
            } else {
            }

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
                    if (typeof this._url === 'string' && this._url.includes('/v1/me/player/pause')) {
                        this.readyState = 4;
                        this.status = 200;
                        this.responseText = '';
                        this.response = '';
                        this.onload && this.onload();
                        this.onreadystatechange && this.onreadystatechange();
                        this.dispatchEvent(new Event('load'));
                        this.dispatchEvent(new Event('readystatechange'));
                    } else {
                        return originalXHRSend.apply(this, args);
                    }
                };

            } else {
            }
        }

        onStop() {
            if (this.originalFetch) {
                window.fetch = this.originalFetch;
            }

            if (this.originalXHROpen && this.originalXHRSend) {
                XMLHttpRequest.prototype.open = this.originalXHROpen;
                XMLHttpRequest.prototype.send = this.originalXHRSend;
            }
        }
    };
})(global.ZeresPluginLibrary.buildPlugin(config));