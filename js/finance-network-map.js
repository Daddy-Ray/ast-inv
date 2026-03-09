(function () {
    "use strict";

    var ALMATY = [43.238949, 76.889709];

    var defaultData = [
        { city: "Persian Gulf", lat: 26.7, lng: 52.6, description: "Energy and commodity trade corridor", value: 82 },
        { city: "Romania", lat: 44.4268, lng: 26.1025, description: "Eastern Europe market collaboration", value: 64 },
        { city: "France", lat: 48.8566, lng: 2.3522, description: "EU finance and industrial partnerships", value: 71 },
        { city: "Hong Kong", lat: 22.3193, lng: 114.1694, description: "International capital operations node", value: 90 },
        { city: "Mainland China", lat: 31.2304, lng: 121.4737, description: "Supply chain and investment channel", value: 88 },
        { city: "Egypt", lat: 30.0444, lng: 31.2357, description: "North Africa market expansion point", value: 58 },
        { city: "Saudi Arabia", lat: 24.7136, lng: 46.6753, description: "Strategic cooperation in Gulf region", value: 76 }
    ];

    var defaultConfig = {
        darkMode: true,
        showLines: true,
        lineColor: "#008C45",
        nodeColor: "#1C3F60",
        pulseEffect: true
    };

    var defaultCopy = {
        overviewTitle: "Capital Network Overview",
        overviewDesc: "Headquartered in Almaty, the network extends to strategic regional markets through capital, supply-chain and project collaboration.",
        hqTooltip: "Headquarters \u2013 Almaty",
        hqMiniLabel: "Almaty",
        hqTitle: "Headquarters \u2013 Almaty",
        hqDesc: "Primary capital operation center and strategic allocation origin.",
        hqImage: "../assets/backgrounds/home-business.jpg",
        detailFallbackImage: "../assets/backgrounds/services-business.jpg",
        valueLabel: "Network value",
        resetLabel: "Reset View"
    };

    function mergeConfig(config) {
        var merged = {};
        Object.keys(defaultConfig).forEach(function (key) {
            merged[key] = defaultConfig[key];
        });
        if (config && typeof config === "object") {
            Object.keys(config).forEach(function (key) {
                merged[key] = config[key];
            });
        }
        return merged;
    }

    function mergeCopy(copy) {
        var merged = {};
        Object.keys(defaultCopy).forEach(function (key) {
            merged[key] = defaultCopy[key];
        });
        if (copy && typeof copy === "object") {
            Object.keys(copy).forEach(function (key) {
                merged[key] = copy[key];
            });
        }
        return merged;
    }

    function hexToRgba(hex, alpha) {
        var normalized = (hex || "").replace("#", "");
        if (normalized.length === 3) {
            normalized = normalized.split("").map(function (c) { return c + c; }).join("");
        }
        if (normalized.length !== 6) return "rgba(0, 140, 69, " + alpha + ")";
        var r = parseInt(normalized.slice(0, 2), 16);
        var g = parseInt(normalized.slice(2, 4), 16);
        var b = parseInt(normalized.slice(4, 6), 16);
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    }

    function computeControlPoint(fromPt, toPt) {
        var mx = (fromPt.x + toPt.x) / 2;
        var my = (fromPt.y + toPt.y) / 2;
        var dx = toPt.x - fromPt.x;
        var dy = toPt.y - fromPt.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var norm = dist === 0 ? 1 : dist;
        // Keep curvature fully proportional to projected distance,
        // so zooming in/out preserves geometric consistency.
        var offset = dist * 0.22;

        // Build two perpendicular candidates and prefer the one bending upward.
        var nx = -dy / norm;
        var ny = dx / norm;
        var c1 = { x: mx + nx * offset, y: my + ny * offset };
        var c2 = { x: mx - nx * offset, y: my - ny * offset };
        return c1.y < c2.y ? c1 : c2;
    }

    function pointOnQuadratic(p0, p1, p2, t) {
        var i = 1 - t;
        var x = i * i * p0.x + 2 * i * t * p1.x + t * t * p2.x;
        var y = i * i * p0.y + 2 * i * t * p1.y + t * t * p2.y;
        return { x: x, y: y };
    }

    function distancePointToSegment(p, a, b) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        if (dx === 0 && dy === 0) {
            var ddx = p.x - a.x;
            var ddy = p.y - a.y;
            return Math.sqrt(ddx * ddx + ddy * ddy);
        }
        var t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
        t = Math.max(0, Math.min(1, t));
        var projX = a.x + t * dx;
        var projY = a.y + t * dy;
        var px = p.x - projX;
        var py = p.y - projY;
        return Math.sqrt(px * px + py * py);
    }

    function FinanceFlowLayer(map, options) {
        this.map = map;
        this.options = options;
        this.canvas = L.DomUtil.create("canvas", "finance-flow-canvas");
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.zIndex = "350";
        this.canvas.style.pointerEvents = "none";
        this.ctx = this.canvas.getContext("2d");
        this.lineStates = [];
        this.hoverCity = null;
        this.rafId = null;
        this.isInteracting = false;
        this.lastDrawTs = 0;
        this.interactionFrameInterval = 42;
    }

    FinanceFlowLayer.prototype.addTo = function () {
        this.map.getPanes().overlayPane.appendChild(this.canvas);
        this._resize();
        this._bind();
        this._buildStates();
        this._animate();
    };

    FinanceFlowLayer.prototype._bind = function () {
        var self = this;
        this._onMove = function () {
            self.draw(performance.now());
        };
        this._onResize = function () {
            self._resize();
            self.draw(performance.now());
        };
        this._onInteractionStart = function () {
            self.isInteracting = true;
        };
        this._onInteractionEnd = function () {
            self.isInteracting = false;
            self.draw(performance.now());
            requestAnimationFrame(function () {
                self.draw(performance.now());
            });
        };
        this.map.on("move zoom", this._onMove);
        this.map.on("resize", this._onResize);
        this.map.on("movestart zoomstart", this._onInteractionStart);
        this.map.on("moveend zoomend", this._onInteractionEnd);
    };

    FinanceFlowLayer.prototype._resize = function () {
        var size = this.map.getSize();
        var dpr = window.devicePixelRatio || 1;
        this.canvas.style.width = size.x + "px";
        this.canvas.style.height = size.y + "px";
        this.canvas.width = Math.round(size.x * dpr);
        this.canvas.height = Math.round(size.y * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    FinanceFlowLayer.prototype._buildStates = function () {
        this.lineStates = this.options.data.map(function (node) {
            return {
                id: node.city,
                node: node,
                from: L.latLng(ALMATY[0], ALMATY[1]),
                to: L.latLng(node.lat, node.lng)
            };
        });
    };

    FinanceFlowLayer.prototype.setHover = function (city) {
        this.hoverCity = city;
    };

    FinanceFlowLayer.prototype._animate = function () {
        var self = this;
        var frame = function (ts) {
            self.draw(ts);
            self.rafId = requestAnimationFrame(frame);
        };
        this.rafId = requestAnimationFrame(frame);
    };

    FinanceFlowLayer.prototype.draw = function (ts) {
        if (this.isInteracting && (ts - this.lastDrawTs) < this.interactionFrameInterval) {
            return;
        }
        this.lastDrawTs = ts;

        var ctx = this.ctx;
        var width = this.canvas.width;
        var height = this.canvas.height;
        ctx.clearRect(0, 0, width, height);

        if (!this.options.config.showLines) return;

        var map = this.map;
        var self = this;

        this.lineStates.forEach(function (state) {
            var fromPt = map.latLngToLayerPoint(state.from);
            var toPt = map.latLngToLayerPoint(state.to);
            var ctrlPt = computeControlPoint(fromPt, toPt);
            var highlight = self.hoverCity === state.id;
            var alphaBase = highlight ? 0.92 : 0.33;
            var lineWidth = (state.node.value / 40) + (highlight ? 1.8 : 0.25);

            ctx.strokeStyle = highlight
                ? hexToRgba("#CD212A", alphaBase)
                : hexToRgba(self.options.config.lineColor, alphaBase);
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            var start = pointOnQuadratic(fromPt, ctrlPt, toPt, 0);
            ctx.moveTo(start.x, start.y);
            var steps = 48;
            for (var i = 1; i <= steps; i += 1) {
                var p = pointOnQuadratic(fromPt, ctrlPt, toPt, i / steps);
                ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();

            if (highlight) {
                ctx.strokeStyle = hexToRgba("#CD212A", 0.28);
                ctx.lineWidth = lineWidth + 3.2;
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                for (var j = 1; j <= steps; j += 1) {
                    var hp = pointOnQuadratic(fromPt, ctrlPt, toPt, j / steps);
                    ctx.lineTo(hp.x, hp.y);
                }
                ctx.stroke();
            }
        });
    };

    FinanceFlowLayer.prototype.destroy = function () {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        if (this._onMove) this.map.off("move zoom", this._onMove);
        if (this._onResize) this.map.off("resize", this._onResize);
        if (this._onInteractionStart) this.map.off("movestart zoomstart", this._onInteractionStart);
        if (this._onInteractionEnd) this.map.off("moveend zoomend", this._onInteractionEnd);
        if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    };

    function initFinanceNetworkMap(selector, opts) {
        var container = document.querySelector(selector);
        if (!container || typeof L === "undefined") return null;

        var options = opts || {};
        var data = Array.isArray(options.data) && options.data.length ? options.data : defaultData;
        var config = mergeConfig(options.config);
        var copy = mergeCopy(options.copy);

        var map = L.map(container, {
            center: ALMATY,
            zoom: 4.4,
            zoomControl: true,
            attributionControl: true,
            worldCopyJump: false
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
            maxZoom: 18,
            attribution: "&copy; OpenStreetMap &copy; CARTO"
        }).addTo(map);

        // Ensure default viewport contains HQ and all target nodes.
        var allPoints = [L.latLng(ALMATY[0], ALMATY[1])].concat(
            data.map(function (node) { return L.latLng(node.lat, node.lng); })
        );
        map.fitBounds(L.latLngBounds(allPoints), {
            padding: [54, 54],
            animate: false
        });
        var initialZoom = map.getZoom();
        var centerLatLng = L.latLng(ALMATY[0], ALMATY[1]);
        var preferredZoom = initialZoom + 0.55;
        map.setView(centerLatLng, preferredZoom, { animate: false });
        var visibleBounds = map.getBounds();
        var allVisible = allPoints.every(function (pt) {
            return visibleBounds.contains(pt);
        });
        if (!allVisible) {
            map.setView(centerLatLng, initialZoom, { animate: false });
        }
        initialZoom = map.getZoom();

        var infoCard = container.parentElement.querySelector(".finance-map-info");
        var activeInfo = null;
        var suppressClearOnce = false;
        var labelLayers = [];
        var miniLabelActions = {};

        function suppressNextClear() {
            suppressClearOnce = true;
            setTimeout(function () {
                suppressClearOnce = false;
            }, 0);
        }

        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        }

        function renderInfoCard() {
            if (!infoCard || !activeInfo) return;
            var point = map.latLngToContainerPoint(activeInfo.latlng);
            var size = map.getSize();
            var cardWidth = Math.min(300, Math.max(220, size.x - 20));
            infoCard.style.width = cardWidth + "px";
            var mediaHtml = activeInfo.image
                ? '<div class="finance-map-info-media"><img src="' + activeInfo.image + '" alt="' + activeInfo.title + '"></div>'
                : "";
            var captionHtml = activeInfo.caption
                ? '<div class="finance-map-info-caption">' + activeInfo.caption + "</div>"
                : "";
            infoCard.innerHTML = mediaHtml + captionHtml + "<h4>" + activeInfo.title + "</h4><p>" + activeInfo.desc + "</p>";
            infoCard.classList.add("active");

            var cardHeight = infoCard.offsetHeight || 96;
            var left = clamp(point.x, cardWidth / 2 + 10, size.x - cardWidth / 2 - 10);
            var top = point.y - 14;
            if (top - cardHeight < 8) {
                top = cardHeight + 14;
            }
            infoCard.style.left = left + "px";
            infoCard.style.top = top + "px";
        }

        function setInfo(title, desc, latlng, image, caption) {
            if (!infoCard) return;
            activeInfo = { title: title, desc: desc, latlng: latlng, image: image || "", caption: caption || "" };
            setMiniLabelsVisible(false);
            renderInfoCard();
        }

        function clearInfo() {
            if (!infoCard) return;
            if (suppressClearOnce) return;
            activeInfo = null;
            infoCard.classList.remove("active");
            setMiniLabelsVisible(true);
        }

        function setMiniLabelsVisible(visible) {
            labelLayers.forEach(function (layer) {
                if (!layer || !layer.getTooltip || !layer.getTooltip()) return;
                if (visible) {
                    if (layer._map) layer.openTooltip();
                } else {
                    layer.closeTooltip();
                }
            });
        }

        function registerMiniLabel(layer, key, onClick) {
            if (!key || typeof onClick !== "function") return;
            miniLabelActions[key] = onClick;
            layer._miniLabelKey = key;
            if (!layer || !layer.getTooltip) return;
            var tooltip = layer.getTooltip();
            if (!tooltip || !tooltip.getElement) return;
            var tooltipEl = tooltip.getElement();
            if (!tooltipEl) return;
            tooltipEl.setAttribute("data-mini-key", key);
        }

        map.on("tooltipopen", function (e) {
            if (!e || !e.tooltip || !e.tooltip.getElement) return;
            var source = e.tooltip._source;
            if (!source || !source._miniLabelKey) return;
            var tooltipEl = e.tooltip.getElement();
            if (!tooltipEl) return;
            tooltipEl.setAttribute("data-mini-key", source._miniLabelKey);
        });

        map.on("move zoom resize", renderInfoCard);
        var flowLayer = null;

        function findNearestLineNode(latlng, threshold) {
            if (!latlng) return null;
            var clickPt = map.latLngToLayerPoint(latlng);
            var hqPt = map.latLngToLayerPoint(L.latLng(ALMATY[0], ALMATY[1]));
            var bestNode = null;
            var bestDist = Number.POSITIVE_INFINITY;

            for (var ni = 0; ni < data.length; ni += 1) {
                var node = data[ni];
                var toPt = map.latLngToLayerPoint(L.latLng(node.lat, node.lng));
                var ctrlPt = computeControlPoint(hqPt, toPt);
                var prev = pointOnQuadratic(hqPt, ctrlPt, toPt, 0);
                var minDist = Number.POSITIVE_INFINITY;
                var steps = 40;
                for (var si = 1; si <= steps; si += 1) {
                    var curr = pointOnQuadratic(hqPt, ctrlPt, toPt, si / steps);
                    var d = distancePointToSegment(clickPt, prev, curr);
                    if (d < minDist) minDist = d;
                    prev = curr;
                }
                if (minDist < threshold && minDist < bestDist) {
                    bestDist = minDist;
                    bestNode = node;
                }
            }

            if (!bestNode) return null;
            return bestNode;
        }

        function trySelectByLineClick(e) {
            if (!e || !e.latlng) return false;
            var bestNode = findNearestLineNode(e.latlng, 10);
            if (!bestNode) return false;
            suppressNextClear();
            setInfo(bestNode.city, bestNode.description, L.latLng(bestNode.lat, bestNode.lng), bestNode.image || copy.detailFallbackImage, bestNode.caption || "");
            return true;
        }

        map.on("click", function (e) {
            if (trySelectByLineClick(e)) return;
            clearInfo();
        });

        map.on("mousemove", function (e) {
            if (!e || !e.latlng) return;
            var hoverNode = findNearestLineNode(e.latlng, 12);
            if (flowLayer) flowLayer.setHover(hoverNode ? hoverNode.city : null);
            map.getContainer().style.cursor = hoverNode ? "pointer" : "";
        });

        map.on("mouseout", function () {
            if (flowLayer) flowLayer.setHover(null);
            map.getContainer().style.cursor = "";
        });

        var mapShell = container.parentElement;
        var resetBtn = mapShell.querySelector(".finance-map-reset-btn");
        if (!resetBtn) {
            resetBtn = document.createElement("button");
            resetBtn.type = "button";
            resetBtn.className = "finance-map-reset-btn";
            mapShell.appendChild(resetBtn);
        }
        resetBtn.innerHTML = '' +
            '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">' +
            '<path d="M12 2c-3.31 0-6 2.61-6 5.82 0 4.39 6 12.36 6 12.36s6-7.97 6-12.36C18 4.61 15.31 2 12 2zm0 8.15c-1.31 0-2.37-1.03-2.37-2.3s1.06-2.3 2.37-2.3 2.37 1.03 2.37 2.3-1.06 2.3-2.37 2.3z"/>' +
            '</svg>';
        resetBtn.setAttribute("aria-label", copy.resetLabel);
        resetBtn.setAttribute("title", copy.resetLabel);
        L.DomEvent.disableClickPropagation(resetBtn);
        L.DomEvent.disableScrollPropagation(resetBtn);
        resetBtn.addEventListener("click", function () {
            clearInfo();
            map.setView(L.latLng(ALMATY[0], ALMATY[1]), initialZoom, { animate: true });
        });

        var hqMarker = L.marker(ALMATY, {
            icon: L.divIcon({
                className: "",
                html: '<div class="hq-marker"></div>',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
            })
        });

        setTimeout(function () {
            hqMarker.addTo(map).bindTooltip(copy.hqTooltip, { direction: "top", className: "finance-city-tooltip" });
            hqMarker.bindTooltip(copy.hqMiniLabel || "Almaty", {
                permanent: true,
                direction: "top",
                offset: [0, -12],
                className: "finance-mini-label"
            });
            hqMarker.openTooltip();
            labelLayers.push(hqMarker);
            registerMiniLabel(hqMarker, "hq", function () {
                setInfo(copy.hqTitle, copy.hqDesc, L.latLng(ALMATY[0], ALMATY[1]), copy.hqImage || copy.detailFallbackImage, "");
            });
        }, 250);

        hqMarker.on("click", function (e) {
            suppressNextClear();
            if (e) L.DomEvent.stopPropagation(e);
            if (e && e.originalEvent) L.DomEvent.stop(e.originalEvent);
            setInfo(copy.hqTitle, copy.hqDesc, L.latLng(ALMATY[0], ALMATY[1]), copy.hqImage || copy.detailFallbackImage, "");
        });

        var cityLayers = data.map(function (node) {
            var radius = Math.max(4, Math.min(8, 2.8 + node.value / 32));
            var marker = L.circleMarker([node.lat, node.lng], {
                radius: radius,
                weight: 1.2,
                color: "#f3b7bc",
                fillColor: "#CD212A",
                fillOpacity: 0.95,
                opacity: 0.95
            }).addTo(map);

            var cityName = String(node.city || "");
            var placeLabelBelow =
                /persian gulf/i.test(cityName) ||
                cityName.indexOf("波斯湾") !== -1 ||
                cityName.indexOf("Персидский залив") !== -1;

            marker.bindTooltip(node.city, {
                permanent: true,
                direction: placeLabelBelow ? "bottom" : "top",
                offset: placeLabelBelow ? [0, 10] : [0, -10],
                className: "finance-mini-label"
            });
            marker.openTooltip();
            labelLayers.push(marker);
            registerMiniLabel(marker, "city:" + node.city, function () {
                setInfo(node.city, node.description, L.latLng(node.lat, node.lng), node.image || copy.detailFallbackImage, node.caption || "");
            });

            marker.on("mouseover", function () {
                if (flowLayer) flowLayer.setHover(node.city);
                marker.setStyle({ radius: radius + 2, color: "#ffe0e3", fillColor: "#E53945" });
            });

            marker.on("mouseout", function () {
                if (flowLayer) flowLayer.setHover(null);
                marker.setStyle({ radius: radius, color: "#f3b7bc", fillColor: "#CD212A" });
            });

            marker.on("click", function (e) {
                suppressNextClear();
                if (e) L.DomEvent.stopPropagation(e);
                if (e && e.originalEvent) L.DomEvent.stop(e.originalEvent);
                setInfo(node.city, node.description, L.latLng(node.lat, node.lng), node.image || copy.detailFallbackImage, node.caption || "");
            });

            return marker;
        });

        flowLayer = new FinanceFlowLayer(map, {
            data: data,
            config: config
        });
        flowLayer.addTo();

        mapShell.addEventListener("click", function (evt) {
            var target = evt.target;
            if (!target || !target.closest) return;
            var miniLabelEl = target.closest(".finance-mini-label");
            if (!miniLabelEl || !mapShell.contains(miniLabelEl)) return;
            var key = miniLabelEl.getAttribute("data-mini-key") || "";
            var action = miniLabelActions[key];
            if (typeof action !== "function") return;
            suppressNextClear();
            if (evt.preventDefault) evt.preventDefault();
            if (evt.stopPropagation) evt.stopPropagation();
            action();
        });

        document.addEventListener("click", function (evt) {
            if (!container.parentElement.contains(evt.target)) {
                clearInfo();
            }
        });

        return {
            map: map,
            flowLayer: flowLayer,
            config: config,
            data: data
        };
    }

    window.initFinanceNetworkMap = initFinanceNetworkMap;
})();
