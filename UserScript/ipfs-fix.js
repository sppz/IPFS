// ==UserScript==
// @name         IPFS Gateway Redirector with Fallback and Retry
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Redirects IPFS links to multiple fallback IPFS gateways with concurrent requests and retry mechanism
// @author       BlueSkyXN
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/BlueSkyXN/WorkerJS_CloudFlare_ImageBed/main/UserScript/ipfs-fix.js
// @downloadURL  https://raw.githubusercontent.com/BlueSkyXN/WorkerJS_CloudFlare_ImageBed/main/UserScript/ipfs-fix.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義多個 IPFS 網關，按優先級排列
    var ipfsGateways = [
        "https://gateway.pinata.cloud/ipfs/",
        "https://eth.sucks/ipfs/",
        "https://hardbin.com/ipfs/",
        "https://gateway.ipfsscan.io/ipfs/",
        "https://i0.img2ipfs.com/ipfs/",
        "https://ipfs.raribleuserdata.com/ipfs/",
        "https://ipfs.crossbell.io/ipfs/",
        "https://ipfs.basedfellas.io/ipfs/",
        "https://gateway.v2ex.pro/ipfs/",
        "https://ipfs.io/ipfs/",
        "https://ipfs.interface.social/ipfs/",
        "https://ipfs.4everland.io/ipfs/",
        "https://ipfs.le7el.com/ipfs/",
        "https://gw-seattle.crustcloud.io/ipfs/",
        "https://ipfs.decentralized-content.com/ipfs/",
        "https://4everland.io/ipfs/",
        "https://c4rex.co/ipfs/",
        "https://ipfs.omakasea.com/ipfs/",
        "https://ipfs.joaoleitao.org/ipfs/",
        "https://proofs.filestar.info/ipfs/",
        "https://ipfs.eth.aragon.network/ipfs/",
        "https://ipfs.supremelegend.io/ipfs/",
        "https://pz-acyuix.meson.network/ipfs/",
        "https://trustless-gateway.link/ipfs/",
        "https://ipfs.cyou/ipfs/",
        "https://gw.ipfs-lens.dev/ipfs/",
        "https://ipfs.runfission.com/ipfs/",
        "https://nftstorage.link/ipfs/",
        "https://w3s.link/ipfs/",
        "https://dlunar.net/ipfs/",
        "https://storry.tv/ipfs/",
        "https://flk-ipfs.xyz/ipfs/"
    ];

    // 匹配 IPFS 鏈接的正則表達式
    var ipfsRegex = /\/ipfs\/(Qm\w+|baf\w+)/;

    // 處理所有的圖片鏈接
    var imgs = document.querySelectorAll('img');

    // 自定義並發請求的網關數量
    var concurrentRequests = 4; 

    // 創建一個請求函數，返回一個 Promise
    function fetchFromGateway(gateway, hash) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = gateway + hash;

            // 成功加載圖片時解析 Promise
            img.onload = () => {
                resolve(gateway + hash);
            };

            // 圖片加載失敗時拒絕 Promise
            img.onerror = () => {
                console.error(`Failed to load from: ${gateway + hash}`);
                reject("Failed to load from: " + gateway);
            };
        });
    }

    // 逐步按組並發請求網關
    async function tryIpfsGatewaysSequentially(img, hash, gateways) {
        let remainingGateways = gateways.slice(); // 複製網關列表
        let originalSrc = img.src;  // 保存原始 URL
        console.log(`Original URL: ${originalSrc}`);

        while (remainingGateways.length > 0) {
            // 取出一組並發網關
            let gatewaysToTry = remainingGateways.splice(0, concurrentRequests);
            console.log(`Trying gateways: ${gatewaysToTry.join(', ')}`);

            try {
                // 並發請求多個網關，並返回第一個成功的
                let successfulUrl = await Promise.race(gatewaysToTry.map(gateway => fetchFromGateway(gateway, hash)));
                img.src = successfulUrl; // 設置為第一個成功的 URL
                console.log(`Successfully loaded from: ${successfulUrl}`);
                return; // 請求成功則停止
            } catch (error) {
                console.error(`Failed to load from current group of gateways: ${gatewaysToTry.join(', ')}`);
            }
        }

        // 如果所有網關都失敗了，再次嘗試一次所有網關
        console.log("All initial attempts failed, trying all gateways again...");
        try {
            let successfulUrl = await Promise.race(gateways.map(gateway => fetchFromGateway(gateway, hash)));
            img.src = successfulUrl; // 設置為成功的 URL
            console.log(`Second attempt successfully loaded from: ${successfulUrl}`);
        } catch (error) {
            console.error("All gateways failed in second attempt. Returning to original URL.");
            img.src = originalSrc;  // 所有都失敗後恢復原始 URL
            console.log(`Restored original URL: ${originalSrc}`);
        }
    }

    // 遍歷每個圖片鏈接
    for (var i = 0; i < imgs.length; i++) {
        var imgSrc = imgs[i].src;

        // 檢查是否匹配 IPFS 鏈接
        var match = imgSrc.match(ipfsRegex);
        if (match) {
            var ipfsHash = match[1];  // 提取IPFS哈希值
            console.log(`Found IPFS hash: ${ipfsHash}`);
            tryIpfsGatewaysSequentially(imgs[i], ipfsHash, ipfsGateways);  // 嘗試按組並發請求網關
        }
    }

})();
