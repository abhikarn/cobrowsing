import { Injectable } from '@angular/core';
import { config } from './config';
import { HtmlElementDomHandler } from './htmlElementDomHandler';
import { DomMessage } from './message';
import { Guid } from './utility';
import { DomMessageService } from './domMessage.service';
import { Component, forwardRef, AfterViewInit, NgZone } from '@angular/core';
import { ChatboxModalObservableService } from './chatboxModal.service';
import { EventMessageService } from './eventMessage.service';
//import{CobrowsingSessionStorageService} './cobrowsingStorage.service';


@Injectable()
export class ScreencastService {
    private top: number;
    private left: number;
    private htmlElementDomHandler: HtmlElementDomHandler;
    private eventService: EventMessageService;
    private controlSharingEnabled: boolean = false;
    private chatroomId: string;
    private cobrowsingUrl: string;
    private userId: string;

    constructor(public domMsgService: DomMessageService, private modalService: ChatboxModalObservableService) {
        this.htmlElementDomHandler = new HtmlElementDomHandler();

    }

    public set EventService(eventServiceArg: any) {
        this.eventService = eventServiceArg;
    }

    public get Top(): string {
        return this.top.toString();
    }
    public get Left(): string {
        return this.left.toString();
    }

    public get CobrowsingUrl(): string {
        return this.cobrowsingUrl;
    }

    public set ControlSharing(flag: boolean) {
        this.controlSharingEnabled = flag;
        this.sendDomMessage();
    }
    public get UserId(): string { return this.userId };
    public set UserId(userid: string) { this.userId = userid };

    private ConvertUrlsToAbsolute(nodeList): any {
        if (!nodeList.length) {
            return [];
        }
        var attrName = 'href';
        if (nodeList[0].__proto__ === HTMLImageElement.prototype
            || nodeList[0].__proto__ === HTMLScriptElement.prototype) {
            attrName = 'src';
        }
        nodeList = [].map.call(nodeList, function (el, i) {
            var attr = el.getAttribute(attrName);
            if (!attr) {
                return;
            }
            var absURL = /^(https?|data):/i.test(attr);
            if (absURL) {
                return el;
            } else {
                return el;
            }
        });
        return nodeList;
    }
    private sendDomMessage = () => {
        let htmlContent = this.screenshotPage(this.controlSharingEnabled);
        let message = new DomMessage("3", htmlContent, "0", "0", "0", this.Left, this.Top, this.getActiveElementLocation().left, this.getActiveElementLocation().top, false)
        setTimeout(() => {
            this.domMsgService.sendMessage(message);
        }, 200);

        return true;
    }
    private EnableEvent(enableFlag: boolean): void {
        if (enableFlag) {
            document.getElementById(config.masterContainerId).addEventListener("keyup", this.sendDomMessage);
            document.getElementById(config.masterContainerId).addEventListener("click", this.sendDomMessage);
        }
        else {
            document.getElementById(config.masterContainerId).removeEventListener("keyup", this.sendDomMessage);
            document.getElementById(config.masterContainerId).removeEventListener("click", this.sendDomMessage);
        }
    }

    public set EnableKeyUpEvent(enableFlag: boolean) {
        if (enableFlag) {
            document.getElementById(config.masterContainerId).addEventListener("keyup", this.sendDomMessage);
            // document.getElementById(config.masterContainerId).addEventListener("click",this.sendDomMessage);
        }
        else {
            document.getElementById(config.masterContainerId).removeEventListener("keyup", this.sendDomMessage);
            // document.getElementById(config.masterContainerId).removeEventListener("click" ,this.sendDomMessage);
        }

    }


    private GiveControl(screenshot: HTMLElement, controlShared: boolean): HTMLElement {
        console.log("Give control");
        if (controlShared) {
            screenshot.style.pointerEvents = 'auto'; //auto and none
            screenshot.style.overflow = 'hidden';
            screenshot.style.webkitUserSelect = 'auto'; //auto and none
            //  screenshot.style.mozUserSelect = 'none';
            screenshot.style.msUserSelect = 'auto'; //auto and none
            //   screenshot.style.oUserSelect = 'none';
            screenshot.style.userSelect = 'auto';

        }
        else {
            screenshot.style.pointerEvents = 'none'; //auto and none
            screenshot.style.overflow = 'hidden';
            screenshot.style.webkitUserSelect = 'none'; //auto and none
            //  screenshot.style.mozUserSelect = 'none';
            screenshot.style.msUserSelect = 'none'; //auto and none
            //   screenshot.style.oUserSelect = 'none';
            screenshot.style.userSelect = 'none';
        }
        return screenshot;

    }

    public screenshotPage(controlShared: boolean): any {

        this.ConvertUrlsToAbsolute(document.images);
        this.ConvertUrlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
        let screenshot2 = document.getElementById(config.masterContainerId).parentElement.cloneNode(true);
        // let screenshot2 = document.getElementById(config.masterContainerId).cloneNode(true);
        let screenshot = screenshot2 as HTMLElement;
        let b = document.createElement('base');
        b.href = document.location.protocol + '//' + location.host;
        screenshot = this.GiveControl(screenshot, controlShared);
        this.top = window.pageYOffset || document.documentElement.scrollTop,
            this.left = window.pageXOffset || document.documentElement.scrollLeft;
        this.htmlElementDomHandler.Screenshot = screenshot;
        this.htmlElementDomHandler.ManageHTMLBeforeTransfer();
        return this.htmlElementDomHandler.Screenshot.outerHTML;
    }

    public StartCobrowsing(): void {
        console.log("cobrowsing process started.")
        this.chatroomId = Guid.RandomNumber();
        this.modalService.displaychatbox(this.chatroomId);
        // sessionStorage.setItem("userid","Ramesh");
        this.domMsgService.connect(this.chatroomId).then((item) => {
            console.log(item.toString());
            if (item) {
                console.log("user connected to server and will start presenting screen");
                this.cobrowsingUrl = window.location.host + "/mirror/" + this.chatroomId;
            }
            else {
                console.log("there is some issue in connecting the server.");
                this.cobrowsingUrl = "NA";
            }
        });
        this.eventService.connect(this.chatroomId);
        this.EnableEvent(true);
        let htmlContent = this.screenshotPage(false);
        let message = new DomMessage("3", htmlContent, "0", "0", this.userId, this.Left, this.Top, this.getActiveElementLocation().left, this.getActiveElementLocation().top, false);
        this.domMsgService.sendMessage(message);
    }


    public StopCobrowsing(): void {
        this.modalService.closechatbox();
        this.domMsgService.close();
        this.EnableEvent(false);
    }

    private getActiveElementLocation(): any {
        console.log("getActiveElementlocation");
        console.log(document.activeElement.getBoundingClientRect());
        return { "left": document.activeElement.getBoundingClientRect().left, "top": document.activeElement.getBoundingClientRect().top }
    }


    // let message = new SocketMessage("3", screenshot.outerHTML,"0","0","0",left.toString(),top.toString(),"0","0",this.controlShared)

    //    return message;


}