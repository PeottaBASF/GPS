// Configurações do Sistema de Gerenciamento de Rotas
// =====================================================

// CONFIGURAÇÃO DO AZURE MAPS
// ---------------------------
// Substitua a chave abaixo pela sua chave do Azure Maps
// Para obter uma chave: https://portal.azure.com > Azure Maps > Autenticação
const AZURE_MAPS_CONFIG = {
    // IMPORTANTE: Substitua pela sua chave do Azure Maps
    subscriptionKey: 'GEEmeJByFwKTXPVPt3sNYTsIK9hzOWHupau1iqvR5eOTGRGBDLg0JQQJ99BFACYeBjF91W9IAAAgAZMPku1j',
    
    // Configurações do mapa
    language: 'pt-BR',
    view: 'Unified',
    
    // Centro inicial do mapa (São Paulo, Brasil como exemplo)
    center: [-46.633308, -23.550520], // [longitude, latitude]
    zoom: 15
};

// CONFIGURAÇÃO DAS PORTARIAS
// ---------------------------
// Adicione aqui as coordenadas das portarias da sua empresa
const PORTARIAS = [
    {
        id: 1,
        nome: "Portaria Principal",
        descricao: "Entrada principal - Recepção de caminhões",
        coordenadas: {
            latitude: -23.748989,
            longitude: -46.564371
        }
    },
    {
        id: 2,
        nome: "Portaria Norte",
        descricao: "Entrada secundária - Via expressa",
        coordenadas: {
            latitude: -23.549820,
            longitude: -46.632808
        }
    },
    {
        id: 3,
        nome: "Portaria Sul",
        descricao: "Entrada de emergência",
        coordenadas: {
            latitude: -23.551220,
            longitude: -46.633808
        }
    }
];

// CONFIGURAÇÃO DAS DOCAS
// ----------------------
// Adicione aqui as coordenadas das docas da sua empresa
const DOCAS = [
    {
        id: 1,
        nome: "Doca A",
        setor: "Recebimento",
        descricao: "Doca para descarga de materiais",
        coordenadas: {
            latitude: -23.748253,
            longitude: -46.562893
        }
    },
    {
        id: 2,
        nome: "Doca B",
        setor: "Expedição",
        descricao: "Doca para carga de produtos",
        coordenadas: {
            latitude: -23.550920,
            longitude: -46.633708
        }
    },
    {
        id: 3,
        nome: "Doca C",
        setor: "Recebimento",
        descricao: "Doca para materiais especiais",
        coordenadas: {
            latitude: -23.550320,
            longitude: -46.633108
        }
    },
    {
        id: 4,
        nome: "Doca D",
        setor: "Expedição",
        descricao: "Doca para produtos acabados",
        coordenadas: {
            latitude: -23.551120,
            longitude: -46.633908
        }
    },
    {
        id: 5,
        nome: "Doca E",
        setor: "Manutenção",
        descricao: "Doca para equipamentos",
        coordenadas: {
            latitude: -23.549720,
            longitude: -46.632708
        }
    }
];

// CONFIGURAÇÕES GERAIS DO SISTEMA
// --------------------------------
const SYSTEM_CONFIG = {
    // Nome da empresa (será exibido no cabeçalho)
    companyName: "BASF",
    
    // URL base do sistema (substitua pelo seu domínio)
    baseUrl: "https://peottabasf.github.io",
    
    // Configurações de link temporário
    defaultExpiryHours: 1,
    maxExpiryHours: 24,
    minExpiryHours: 1,
    
    // Configurações de QR Code
    qrCodeSize: 200,
    qrCodeErrorCorrectionLevel: 'M', // L, M, Q, H
    
    // Configurações de rota
    routeColor: '#007bff',
    routeWidth: 4,
    markerSize: 20,
    
    // Configurações de notificação
    showWhatsAppShare: true,
    showEmailShare: false,
    
    // Limite de QR Codes recentes a exibir
    maxRecentCodes: 10
};

// CONFIGURAÇÕES DE HOSPEDAGEM
// ----------------------------
// Para GitHub Pages ou outras plataformas de hospedagem gratuita
const HOSTING_CONFIG = {
    // Para GitHub Pages: https://seuusuario.github.io/nome-do-repositorio/
    // Para Netlify: https://nome-do-site.netlify.app/
    // Para Vercel: https://nome-do-projeto.vercel.app/
    
    // Se estiver usando GitHub Pages com repositório específico, descomente a linha abaixo:
    // basePath: '/nome-do-repositorio',
    
    // Se estiver hospedando na raiz do domínio, deixe basePath vazio:
    basePath: 'https://peottabasf.github.io/GPS/',
    
    // Configurações de CORS (para desenvolvimento local)
    enableCORS: true
};

// FUNÇÕES AUXILIARES DE CONFIGURAÇÃO
// -----------------------------------

/**
 * Obtém a URL completa do sistema
 * @param {string} path - Caminho relativo
 * @returns {string} URL completa
 */
function getFullUrl(path = '') {
    const base = SYSTEM_CONFIG.baseUrl + HOSTING_CONFIG.basePath;
    return path ? `${base}/${path}` : base;
}

/**
 * Obtém as coordenadas de uma portaria pelo ID
 * @param {number} portariaId - ID da portaria
 * @returns {object|null} Objeto com latitude e longitude
 */
function getPortariaCoordinates(portariaId) {
    const portaria = PORTARIAS.find(p => p.id === portariaId);
    return portaria ? portaria.coordenadas : null;
}

/**
 * Obtém as coordenadas de uma doca pelo ID
 * @param {number} docaId - ID da doca
 * @returns {object|null} Objeto com latitude e longitude
 */
function getDocaCoordinates(docaId) {
    const doca = DOCAS.find(d => d.id === docaId);
    return doca ? doca.coordenadas : null;
}

/**
 * Valida se a chave do Azure Maps foi configurada
 * @returns {boolean} True se a chave estiver configurada
 */
function isAzureMapsConfigured() {
    return AZURE_MAPS_CONFIG.subscriptionKey && 
           AZURE_MAPS_CONFIG.subscriptionKey !== 'SUA_CHAVE_AZURE_MAPS_AQUI';
}

// CONFIGURAÇÕES DE DESENVOLVIMENTO
// --------------------------------
// Para debug e desenvolvimento
const DEV_CONFIG = {
    enableDebugMode: false,
    enableConsoleLogging: true,
    simulateSlowNetwork: false,
    mockAzureMapsResponses: false
};

// EXPORTAR CONFIGURAÇÕES (para uso em módulos)
// ---------------------------------------------
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AZURE_MAPS_CONFIG,
        PORTARIAS,
        DOCAS,
        SYSTEM_CONFIG,
        HOSTING_CONFIG,
        DEV_CONFIG,
        getFullUrl,
        getPortariaCoordinates,
        getDocaCoordinates,
        isAzureMapsConfigured
    };
}
