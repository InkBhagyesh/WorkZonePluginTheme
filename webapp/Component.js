sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/Theming"
    //"com/sap/winslow/themeplugin/model/models"
], (UIComponent, Theming) => {
    "use strict";

    return UIComponent.extend("com.sap.winslow.themeplugin.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            debugger
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            this._getIASGroups();

            // Access UserInfo to determine theme logic
            const oUserInfo = sap.ushell.Container.getService("UserInfo");
            const sUserId = oUserInfo.getUser().getId();
            console.log("User ID :" + sUserId);
            var themeService = "https://fsm-btp-dev-pt8gi5dj.workzone.cfapps.ap10.hana.ondemand.com/comsapuitheming.runtime/themeroot/v1";



            // Set the theme programmatically
            if (sUserId.includes("4b05fcf2-3088-41b3-bcf6-adcd4f0ea75c")) {
                Theming.setTheme("YVE_Theme");
                var fullTheme = "YVE_Theme" + "@" + themeService;
                this._redirectWithTheme(fullTheme, "YVE_Theme");
                console.log("YVE theme applied");
            } else {
                Theming.setTheme("Winslow_Theme");
                var fullTheme = "Winslow_Theme" + "@" + themeService;
                this._redirectWithTheme(fullTheme, "Winslow_Theme");
                console.log("Winslow theme applied");
            }
        },

        _getIASGroups: function () {
            var settings = {
                "url": "/scim/Users?filter=emails.value%20eq%20%22bhagyeshshah16@gmail.com%22",
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/scim+json"
                },
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
            });
        },

        _redirectWithTheme: function (themeValue, themeName) {
            debugger;
            var url = new URL(window.location.href);
            var currentTheme = sap.ui.getCore().getConfiguration().getTheme();
            if (!themeName || themeName !== currentTheme) {
                url.searchParams.set("sap-theme", themeValue);
                window.location.replace(url.toString());
            }
        }
    });
});