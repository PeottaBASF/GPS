// Sistema de Gerenciamento de Rotas - Página de Navegação
// ========================================================

// Estado da aplicação de rota
let routeApp = {
    map: null,
    routeData: null,
    countdownInterval: null,
    isExpired: false,
    navigationInstructionsCollapsed: false
};

// Inicialização da página de rota
document.addEventListener('DOMContentLoaded', function() {
    initializeRoute();
});

/**
 * Inicializa a página de rota
 */
function initializeRoute() {
    // Verificar configuração do Azure Maps
    if (!isAzureMapsConfigured()) {
        showError('Configuração do Azure Maps não encontrada. Contate o administrador.');
        return;
    }
    
    // Obter dados da URL
    const urlData = getRouteDataFromUrl();
    if (!urlData) {
        showError('Link inválido ou dados não encontrados.');
        return;
    }
    
    // Verificar se o link não expirou
    if (isLinkExpired(urlData)) {
        showExpiredMessage();
        return;
    }
    
    // Salvar dados da rota
    routeApp.routeData = urlData;
    
    // Inicializar interface
    initializeInterface();
    
    // Inicializar mapa
    initializeMap();
    
    // Iniciar contador regressivo
    startCountdown();
}

/**
 * Obtém os dados da rota da URL
 */
function getRouteDataFromUrl() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        
        if (!encodedData) {
            return null;
        }
        
        // Decodificar dados
        const jsonString = atob(encodedData);
        const data = JSON.parse(jsonString);
        
        // Converter timestamps de volta para Date
        data.createdAt = new Date(data.createdAt);
        data.expiryDate = new Date(data.expiryDate);
        
        return data;
        
    } catch (error) {
        console.error('Erro ao decodificar dados da URL:', error);
        return null;
    }
}

/**
 * Verifica se o link expirou
 */
function isLinkExpired(data) {
    return new Date() > data.expiryDate;
}

/**
 * Exibe a mensagem de link expirado
 */
function showExpiredMessage() {
    routeApp.isExpired = true;
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('expired-alert').style.display = 'block';
    
    // Atualizar countdown para mostrar "EXPIRADO"
    document.getElementById('countdown').textContent = 'EXPIRADO';
    document.getElementById('countdown').className = 'badge bg-danger';
}

/**
 * Inicializa a interface com os dados da rota
 */
function initializeInterface() {
    const data = routeApp.routeData;
    
    // Atualizar informações do caminhão e motorista
    document.getElementById('truck-info').textContent = 
        `${data.truckPlate}${data.truckModel ? ' - ' + data.truckModel : ''}`;
        
    document.getElementById('driver-info').textContent = data.driverName;
    
    // Obter nome da doca de destino
    const doca = DOCAS.find(d => d.id === data.destinationDockId);
    document.getElementById('destination-info').textContent = 
        doca ? `${doca.nome} (${doca.setor})` : 'Doca não encontrada';
    
    // Configurar toggle das instruções
    setupInstructionsToggle();
}

/**
 * Inicializa o mapa do Azure Maps
 */
function initializeMap() {
    try {
        // Configurar autenticação
        atlas.setSubscriptionKey(AZURE_MAPS_CONFIG.subscriptionKey);
        
        // Criar mapa
        routeApp.map = new atlas.Map('route-map', {
            center: AZURE_MAPS_CONFIG.center,
            zoom: AZURE_MAPS_CONFIG.zoom,
            language: AZURE_MAPS_CONFIG.language,
            view: AZURE_MAPS_CONFIG.view,
            style: 'road',
            showBuildingModels: false,
            showLogo: false,
            showFeedbackLink: false
        });
        
        // Aguardar o mapa carregar
        routeApp.map.events.add('ready', function() {
            loadRoute();
        });
        
    } catch (error) {
        console.error('Erro ao inicializar mapa:', error);
        showError('Erro ao carregar o mapa. Tente novamente.');
    }
}

/**
 * Carrega e exibe a rota no mapa
 */
function loadRoute() {
    try {
        const data = routeApp.routeData;
        
        // Obter coordenadas da portaria e doca
        const startCoords = getPortariaCoordinates(data.entryGateId);
        const endCoords = getDocaCoordinates(data.destinationDockId);
        
        if (!startCoords || !endCoords) {
            showError('Coordenadas não encontradas para a rota.');
            return;
        }
        
        // Converter para formato do Azure Maps [longitude, latitude]
        const startPoint = [startCoords.longitude, startCoords.latitude];
        const endPoint = [endCoords.longitude, endCoords.latitude];
        
        // Criar data source para marcadores e rota
        const dataSource = new atlas.source.DataSource();
        routeApp.map.sources.add(dataSource);
        
        // Adicionar marcadores de início e fim
        addRouteMarkers(dataSource, startPoint, endPoint);
        
        // Calcular e exibir rota
        calculateRoute(startPoint, endPoint, dataSource);
        
    } catch (error) {
        console.error('Erro ao carregar rota:', error);
        showError('Erro ao calcular rota. Tente novamente.');
    }
}

/**
 * Adiciona marcadores de início e fim da rota
 */
function addRouteMarkers(dataSource, startPoint, endPoint) {
    // Marcador de início (portaria)
    const startMarker = new atlas.data.Feature(new atlas.data.Point(startPoint), {
        title: PORTARIAS.find(p => p.id === routeApp.routeData.entryGateId)?.nome || 'Portaria',
        type: 'start'
    });
    
    // Marcador de fim (doca)
    const doca = DOCAS.find(d => d.id === routeApp.routeData.destinationDockId);
    const endMarker = new atlas.data.Feature(new atlas.data.Point(endPoint), {
        title: doca ? `${doca.nome} (${doca.setor})` : 'Doca de Destino',
        type: 'end'
    });
    
    dataSource.add([startMarker, endMarker]);
    
    // Adicionar layer de símbolos para os marcadores
    routeApp.map.layers.add(new atlas.layer.SymbolLayer(dataSource, null, {
        iconOptions: {
            image: ['case',
                ['==', ['get', 'type'], 'start'], 'pin-blue',
                'pin-red'
            ],
            allowOverlap: true,
            anchor: 'bottom'
        },
        textOptions: {
            textField: ['get', 'title'],
            offset: [0, -2],
            color: 'black',
            haloColor: 'white',
            haloWidth: 2
        }
    }));
}

/**
 * Calcula a rota usando a API do Azure Maps
 */
function calculateRoute(startPoint, endPoint, dataSource) {
    const routeUrl = 'https://atlas.microsoft.com/route/directions/json';
    const query = `${startPoint[1]},${startPoint[0]}:${endPoint[1]},${endPoint[0]}`;
    
    const params = new URLSearchParams({
        'subscription-key': AZURE_MAPS_CONFIG.subscriptionKey,
        'api-version': '1.0',
        'query': query,
        'routeType': 'fastest',
        'traffic': 'true',
        'travelMode': 'truck',
        'instructionsType': 'text',
        'language': 'pt-BR'
    });
    
    fetch(`${routeUrl}?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            return response.json();
        })
        .then(data => {
            if (data.routes && data.routes.length > 0) {
                displayRoute(data.routes[0], dataSource);
            } else {
                throw new Error('Nenhuma rota encontrada');
            }
        })
        .catch(error => {
            console.error('Erro ao calcular rota:', error);
            
            // Fallback: mostrar linha reta entre os pontos
            showStraightLineRoute(startPoint, endPoint, dataSource);
            showToast('Rota detalhada indisponível. Exibindo rota direta.', 'warning');
        });
}

/**
 * Exibe a rota calculada no mapa
 */
function displayRoute(route, dataSource) {
    try {
        // Extrair coordenadas da rota
        const routeCoordinates = [];
        route.legs.forEach(leg => {
            leg.points.forEach(point => {
                routeCoordinates.push([point.longitude, point.latitude]);
            });
        });
        
        // Adicionar linha da rota ao data source
        const routeLine = new atlas.data.Feature(new atlas.data.LineString(routeCoordinates));
        dataSource.add(routeLine);
        
        // Adicionar layer da linha da rota
        routeApp.map.layers.add(new atlas.layer.LineLayer(dataSource, null, {
            strokeColor: SYSTEM_CONFIG.routeColor,
            strokeWidth: SYSTEM_CONFIG.routeWidth,
            lineJoin: 'round',
            lineCap: 'round'
        }), 'labels');
        
        // Ajustar visualização para mostrar toda a rota
        const bounds = atlas.data.BoundingBox.fromLatLngs(routeCoordinates);
        routeApp.map.setCamera({
            bounds: bounds,
            padding: 50
        });
        
        // Exibir tempo estimado e distância
        updateRouteInfo(route);
        
        // Exibir instruções de navegação
        displayNavigationInstructions(route);
        
        // Esconder loading e mostrar interface
        showRouteInterface();
        
    } catch (error) {
        console.error('Erro ao exibir rota:', error);
        showError('Erro ao exibir rota no mapa.');
    }
}

/**
 * Mostra uma linha reta entre os pontos (fallback)
 */
function showStraightLineRoute(startPoint, endPoint, dataSource) {
    const routeLine = new atlas.data.Feature(new atlas.data.LineString([startPoint, endPoint]));
    dataSource.add(routeLine);
    
    routeApp.map.layers.add(new atlas.layer.LineLayer(dataSource, null, {
        strokeColor: SYSTEM_CONFIG.routeColor,
        strokeWidth: SYSTEM_CONFIG.routeWidth,
        strokeDashArray: [5, 5], // Linha tracejada para indicar que é aproximada
        lineJoin: 'round',
        lineCap: 'round'
    }), 'labels');
    
    // Ajustar visualização
    const bounds = atlas.data.BoundingBox.fromLatLngs([startPoint, endPoint]);
    routeApp.map.setCamera({
        bounds: bounds,
        padding: 100
    });
    
    // Calcular distância aproximada
    const distance = calculateDistance(startPoint[1], startPoint[0], endPoint[1], endPoint[0]);
    document.getElementById('route-time').textContent = `~${distance.toFixed(1)}km (rota aproximada)`;
    
    showRouteInterface();
}

/**
 * Atualiza as informações da rota
 */
function updateRouteInfo(route) {
    const summary = route.summary;
    const timeInMinutes = Math.round(summary.travelTimeInSeconds / 60);
    const distanceInKm = (summary.lengthInMeters / 1000).toFixed(1);
    
    document.getElementById('route-time').textContent = 
        `${timeInMinutes} min • ${distanceInKm} km`;
}

/**
 * Exibe as instruções de navegação
 */
function displayNavigationInstructions(route) {
    const instructionsContainer = document.getElementById('navigation-instructions');
    instructionsContainer.innerHTML = '';
    
    let instructionsList = '<ol class="list-unstyled">';
    
    route.legs.forEach((leg, legIndex) => {
        leg.points.forEach((point, pointIndex) => {
            if (point.instruction) {
                instructionsList += `
                    <li class="mb-2">
                        <span class="badge bg-primary me-2">${pointIndex + 1}</span>
                        ${point.instruction}
                    </li>
                `;
            }
        });
    });
    
    instructionsList += '</ol>';
    instructionsContainer.innerHTML = instructionsList;
}

/**
 * Configura o toggle das instruções de navegação
 */
function setupInstructionsToggle() {
    document.getElementById('toggle-instructions').addEventListener('click', function() {
        const panel = document.getElementById('navigation-panel');
        const isCollapsed = panel.classList.contains('collapsed');
        
        if (isCollapsed) {
            panel.classList.remove('collapsed');
            this.textContent = 'Ocultar';
        } else {
            panel.classList.add('collapsed');
            this.textContent = 'Instruções';
        }
        
        routeApp.navigationInstructionsCollapsed = !isCollapsed;
    });
}

/**
 * Inicia o contador regressivo
 */
function startCountdown() {
    if (routeApp.isExpired) return;
    
    updateCountdownDisplay();
    
    routeApp.countdownInterval = setInterval(() => {
        if (routeApp.isExpired) {
            clearInterval(routeApp.countdownInterval);
            return;
        }
        
        const now = new Date();
        if (now >= routeApp.routeData.expiryDate) {
            showExpiredMessage();
            clearInterval(routeApp.countdownInterval);
            return;
        }
        
        updateCountdownDisplay();
    }, 1000);
}

/**
 * Atualiza o display do contador regressivo
 */
function updateCountdownDisplay() {
    const now = new Date();
    const timeLeft = routeApp.routeData.expiryDate - now;
    
    if (timeLeft <= 0) {
        document.getElementById('countdown').textContent = 'EXPIRANDO...';
        document.getElementById('countdown').className = 'badge bg-danger';
        return;
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    let display = '';
    let badgeClass = 'badge bg-success';
    
    if (hours > 0) {
        display = `${hours}h ${minutes}m`;
    } else if (minutes > 5) {
        display = `${minutes}m ${seconds}s`;
    } else {
        display = `${minutes}m ${seconds}s`;
        badgeClass = 'badge bg-warning text-dark';
    }
    
    if (minutes < 5 && hours === 0) {
        badgeClass = 'badge bg-danger';
    }
    
    document.getElementById('countdown').textContent = display;
    document.getElementById('countdown').className = badgeClass;
}

/**
 * Mostra a interface da rota
 */
function showRouteInterface() {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('route-info').style.display = 'block';
    document.getElementById('map-container').style.display = 'block';
}

/**
 * Exibe uma mensagem de erro
 */
function showError(message) {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-screen').style.display = 'block';
}

/**
 * Calcula a distância entre dois pontos (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Exibe toast de notificação
 */
function showToast(message, type = 'info') {
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'primary'} border-0" 
             id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    setTimeout(() => {
        toastElement.remove();
    }, 5000);
}

// Cleanup ao sair da página
window.addEventListener('beforeunload', function() {
    if (routeApp.countdownInterval) {
        clearInterval(routeApp.countdownInterval);
    }
});