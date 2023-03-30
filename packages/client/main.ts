import * as masterSDK from "@mail/master-jssdk";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { initBridgeAdapter } from "@mail/masterbridge-pc-adapter";

export enum EActionType {
  NAVIGATETO = "navigateTo",
  CLOSE = "close",
}

export enum EBtnLocation {
  HEAD = 'header',
  FOOTER = 'footer'
}

class ClientPush {
  private btnList: NodeListOf<Element>;
  private closeBtn: NodeListOf<Element>;
  constructor() {
    this.initBridgeAdapter();
    this.initWindowSize();
    this.btnList = document.querySelectorAll(".layer-btn");
    this.closeBtn = document.querySelectorAll(".layer-close");
    this.initBtnsListeners(this.btnList, EBtnLocation.FOOTER);
    this.initBtnsListeners(this.closeBtn, EBtnLocation.HEAD);
    // this.initSentryInstance();
  }

  // private initSentryInstance() {
  //   Sentry.init({
  //     dsn: process.env.SENTRY_DSN,
  //     integrations: [new BrowserTracing({ tracePropagationTargets: [] })],
  //     tracesSampleRate: 1.0,
  //   });
  // }

  private initBridgeAdapter() {
    initBridgeAdapter(["SET_PAGE_SIZE", "NAVIGATE_BACK", "GET_CLIENT_INFO"]);
  }

  private serialize(data: string): any {
    return JSON.parse(decodeURIComponent(data));
  }

  private initBtnsListeners(list: NodeListOf<Element>, location: string) {
    const btnList = Array.from(list);
    if (btnList.length > 0) {
      btnList.forEach((btn: any, index: number) => {
        const actionType = btn.getAttribute("data-action");
        const payload: any = this.serialize(btn.getAttribute("data-payload"));
        const statData: Record<string | number, any> = this.serialize(
          btn.getAttribute("data-stat")
        ) || {};
        
        let listener: { (): void; (): void } | null = null;
        const statsKey = `mkt-push-${location}-btn-${index + 1}`;
        switch (actionType) {
          case EActionType.NAVIGATETO:
            listener = () => {
              console.log("log: 调用navigateFromNotification", payload, statData, masterSDK);
              masterSDK.navigateFromNotification(payload);
              masterSDK.reportStat({ name: statsKey, data: statData});
            };
            break;
          case EActionType.CLOSE:
            listener = () => {
              console.log("log: navigateBack", payload, statData);
              masterSDK.navigateBack();
              masterSDK.reportStat({ name: statsKey, data: statData });
            };
            break;
        }
        btn.addEventListener("click", listener, false);
        window.addEventListener(
          "unload",
          function () {
            btn.removeEventListener("click", listener, false);
          },
          false
        );
      });
    }
  }

  private initWindowSize() {
    if (masterSDK) {
      const mountEl = document.querySelectorAll(".layer-container")?.[0];
      if(mountEl) {
        const data = mountEl!!.getBoundingClientRect();
        masterSDK.setPageSize({
          width: data.width,
          height: data.height,
        });
      }
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new ClientPush();
});