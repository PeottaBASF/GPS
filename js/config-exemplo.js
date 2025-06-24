// Exemplo de Configuração para Testes - Sistema de Rotas
// ===================================================
// ATENÇÃO: Este arquivo contém dados fictícios apenas para demonstração
// Substitua pelos dados reais da sua empresa antes de usar em produção

// Configuração do Azure Maps (SUBSTITUA pela sua chave real)
const AZURE_MAPS_CONFIG_EXEMPLO = {
    subscriptionKey: 'pk.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz', // Chave fictícia
    language: 'pt-BR',
    view: 'Unified',
    center: [-46.633308, -23.550520], // São Paulo, SP - Centro
    zoom: 16
};

// Exemplo de Portarias para uma empresa fictícia em São Paulo
const PORTARIAS_EXEMPLO = [
    {
        id: 1,
        nome: "Portaria Principal",
        descricao: "Entrada principal - Avenida Paulista",
        coordenadas: {
            latitude: -23.550520,
            longitude: -46.633308
        }
    },
    {
        id: 2,
        nome: "Portaria Norte",
        descricao: "Entrada secundária - Rua Augusta",
        coordenadas: {
            latitude: -23.549820,
            longitude: -46.632808
        }
    },
    {
        id: 3,
        nome: "Portaria Sul",
        descricao: "Entrada de emergência - Alameda Santos",
        coordenadas: {
            latitude: -23.551220,
            longitude: -46.633808
        }
    }
];

// Exemplo de Docas para a empresa fictícia
const DOCAS_EXEMPLO = [
    {
        id: 1,
        nome: "Doca A",
        setor: "Recebimento",
        descricao: "Doca para descarga de materiais de construção",
        coordenadas: {
            latitude: -23.550720,
            longitude: -46.633508
        }
    },
    {
        id: 2,
        nome: "Doca B",
        setor: "Expedição",
        descricao: "Doca para carga de produtos acabados",
        coordenadas: {
            latitude: -23.550920,
            longitude: -46.633708
        }
    },
    {
        id: 3,
        nome: "Doca C",
        setor: "Recebimento",
        descricao: "Doca para materiais especiais e frágeis",
        coordenadas: {
            latitude: -23.550320,
            longitude: -46.633108
        }
    },
    {
        id: 4,
        nome: "Doca D",
        setor: "Expedição",
        descricao: "Doca para produtos refrigerados",
        coordenadas: {
            latitude: -23.551120,
            longitude: -46.633908
        }
    },
    {
        id: 5,
        nome: "Doca E",
        setor: "Manutenção",
        descricao: "Doca para equipamentos e peças de reposição",
        coordenadas: {
            latitude: -23.549720,
            longitude: -46.632708
        }
    },
    {
        id: 6,
        nome: "Doca F",
        setor: "Recebimento",
        descricao: "Doca para materiais de limpeza e higiene",
        coordenadas: {
            latitude: -23.550120,
            longitude: -46.632908
        }
    }
];

// Configurações do sistema de exemplo
const SYSTEM_CONFIG_EXEMPLO = {
    companyName: "Empresa Exemplo Logística LTDA",
    baseUrl: "https://sua-empresa.github.io/sistema-rotas", // Substitua pela URL real
    defaultExpiryHours: 2,
    maxExpiryHours: 12,
    minExpiryHours: 1,
    qrCodeSize: 220,
    qrCodeErrorCorrectionLevel: 'M',
    routeColor: '#007bff',
    routeWidth: 5,
    markerSize: 25,
    showWhatsAppShare: true,
    showEmailShare: false,
    maxRecentCodes: 15
};

// Dados de teste para validar o sistema
const DADOS_TESTE = {
    caminhao: {
        placa: "ABC1234",
        modelo: "Scania R-440",
        transportadora: "Transportes São Paulo LTDA"
    },
    motorista: {
        nome: "João Silva dos Santos",
        documento: "123.456.789-00",
        telefone: "(11) 99999-9999"
    },
    rota: {
        portariaId: 1, // Portaria Principal
        docaId: 2,     // Doca B - Expedição
        tempoExpiracao: 2 // 2 horas
    }
};

// Configurações para diferentes ambientes
const AMBIENTES = {
    desenvolvimento: {
        debug: true,
        mockApi: true,
        baseUrl: "http://localhost:3000",
        azureKey: "CHAVE_DESENVOLVIMENTO"
    },
    
    teste: {
        debug: true,
        mockApi: false,
        baseUrl: "https://test.sua-empresa.com",
        azureKey: "CHAVE_TESTE"
    },
    
    producao: {
        debug: false,
        mockApi: false,
        baseUrl: "https://rotas.sua-empresa.com",
        azureKey: "CHAVE_PRODUCAO"
    }
};

// Diferentes localizações de empresas para exemplo
const EXEMPLOS_COORDENADAS = {
    "São Paulo - Centro": {
        center: [-46.633308, -23.550520],
        portarias: [
            { nome: "Principal", lat: -23.550520, lng: -46.633308 },
            { nome: "Norte", lat: -23.549820, lng: -46.632808 },
            { nome: "Sul", lat: -23.551220, lng: -46.633808 }
        ]
    },
    
    "Rio de Janeiro - Centro": {
        center: [-43.1729, -22.9068],
        portarias: [
            { nome: "Principal", lat: -22.9068, lng: -43.1729 },
            { nome: "Norte", lat: -22.9058, lng: -43.1719 },
            { nome: "Sul", lat: -22.9078, lng: -43.1739 }
        ]
    },
    
    "Belo Horizonte - Centro": {
        center: [-43.9378, -19.9208],
        portarias: [
            { nome: "Principal", lat: -19.9208, lng: -43.9378 },
            { nome: "Norte", lat: -19.9198, lng: -43.9368 },
            { nome: "Sul", lat: -19.9218, lng: -43.9388 }
        ]
    },
    
    "Brasília - Plano Piloto": {
        center: [-47.8822, -15.7942],
        portarias: [
            { nome: "Principal", lat: -15.7942, lng: -47.8822 },
            { nome: "Norte", lat: -15.7932, lng: -47.8812 },
            { nome: "Sul", lat: -15.7952, lng: -47.8832 }
        ]
    },
    
    "Porto Alegre - Centro": {
        center: [-51.2177, -30.0346],
        portarias: [
            { nome: "Principal", lat: -30.0346, lng: -51.2177 },
            { nome: "Norte", lat: -30.0336, lng: -51.2167 },
            { nome: "Sul", lat: -30.0356, lng: -51.2187 }
        ]
    }
};

// Exemplos de setores industriais
const SETORES_EXEMPLO = {
    "Logística e Distribuição": {
        docas: ["Recebimento A", "Recebimento B", "Expedição A", "Expedição B", "Cross-Docking"],
        caracteristicas: ["Alto fluxo", "Múltiplos fornecedores", "Urgência nas entregas"]
    },
    
    "Indústria Alimentícia": {
        docas: ["Matéria-Prima", "Refrigerados", "Secos", "Expedição Normal", "Expedição Refrigerada"],
        caracteristicas: ["Controle de temperatura", "Higiene rigorosa", "Rastreabilidade"]
    },
    
    "Indústria Automobilística": {
        docas: ["Peças Pequenas", "Peças Grandes", "Just-in-Time", "Expedição Nacional", "Expedição Export"],
        caracteristicas: ["Precisão na entrega", "Embalagens especiais", "Sequenciamento"]
    },
    
    "Centro de Distribuição": {
        docas: ["Recebimento 1-5", "Expedição 1-10", "Devoluções", "Cross-Dock", "Emergência"],
        caracteristicas: ["Alto volume", "Múltiplos clientes", "Operação 24h"]
    }
};

// Função para gerar configuração baseada na localização
function gerarConfiguracaoPorCidade(cidade) {
    const exemplo = EXEMPLOS_COORDENADAS[cidade];
    if (!exemplo) {
        console.error(`Cidade ${cidade} não encontrada nos exemplos`);
        return null;
    }
    
    const portarias = exemplo.portarias.map((p, index) => ({
        id: index + 1,
        nome: `Portaria ${p.nome}`,
        descricao: `Entrada ${p.nome.toLowerCase()} - ${cidade}`,
        coordenadas: {
            latitude: p.lat,
            longitude: p.lng
        }
    }));
    
    const docas = [];
    const setores = ["Recebimento", "Expedição", "Manutenção"];
    
    for (let i = 0; i < 6; i++) {
        const setor = setores[i % 3];
        const offset = (i * 0.0002) - 0.0006; // Pequeno deslocamento para variar posições
        
        docas.push({
            id: i + 1,
            nome: `Doca ${String.fromCharCode(65 + i)}`, // A, B, C, D, E, F
            setor: setor,
            descricao: `Doca para ${setor.toLowerCase()} - Área ${i + 1}`,
            coordenadas: {
                latitude: exemplo.center[1] + offset,
                longitude: exemplo.center[0] + offset
            }
        });
    }
    
    return {
        cidade,
        center: exemplo.center,
        portarias,
        docas
    };
}

// Função para validar configuração
function validarConfiguracao(config) {
    const erros = [];
    const avisos = [];
    
    // Validar Azure Maps
    if (!config.AZURE_MAPS_CONFIG || !config.AZURE_MAPS_CONFIG.subscriptionKey) {
        erros.push("Chave do Azure Maps não configurada");
    }
    
    // Validar portarias
    if (!config.PORTARIAS || config.PORTARIAS.length === 0) {
        erros.push("Nenhuma portaria configurada");
    } else {
        config.PORTARIAS.forEach((p, index) => {
            if (!p.coordenadas || 
                typeof p.coordenadas.latitude !== 'number' || 
                typeof p.coordenadas.longitude !== 'number') {
                erros.push(`Portaria ${index + 1}: coordenadas inválidas`);
            }
        });
    }
    
    // Validar docas
    if (!config.DOCAS || config.DOCAS.length === 0) {
        erros.push("Nenhuma doca configurada");
    } else {
        config.DOCAS.forEach((d, index) => {
            if (!d.coordenadas || 
                typeof d.coordenadas.latitude !== 'number' || 
                typeof d.coordenadas.longitude !== 'number') {
                erros.push(`Doca ${index + 1}: coordenadas inválidas`);
            }
        });
    }
    
    // Validar URL base
    if (!config.SYSTEM_CONFIG || !config.SYSTEM_CONFIG.baseUrl) {
        avisos.push("URL base não configurada");
    } else if (config.SYSTEM_CONFIG.baseUrl.includes('exemplo') || 
               config.SYSTEM_CONFIG.baseUrl.includes('sua-empresa')) {
        avisos.push("URL base ainda contém dados de exemplo");
    }
    
    return { erros, avisos };
}

// Função para exportar configuração personalizada
function exportarConfiguracao(nomeEmpresa, cidade, setor) {
    const configCidade = gerarConfiguracaoPorCidade(cidade);
    if (!configCidade) return null;
    
    const setorInfo = SETORES_EXEMPLO[setor] || SETORES_EXEMPLO["Centro de Distribuição"];
    
    // Personalizar docas baseado no setor
    const docasPersonalizadas = configCidade.docas.map((doca, index) => {
        if (setorInfo.docas && setorInfo.docas[index]) {
            return {
                ...doca,
                nome: setorInfo.docas[index],
                descricao: `${setorInfo.docas[index]} - ${nomeEmpresa}`
            };
        }
        return doca;
    });
    
    return {
        AZURE_MAPS_CONFIG: {
            subscriptionKey: 'SUA_CHAVE_AZURE_MAPS_AQUI', // Usuário deve substituir
            language: 'pt-BR',
            view: 'Unified',
            center: configCidade.center,
            zoom: 16
        },
        PORTARIAS: configCidade.portarias.map(p => ({
            ...p,
            descricao: `${p.nome} - ${nomeEmpresa}`
        })),
        DOCAS: docasPersonalizadas,
        SYSTEM_CONFIG: {
            companyName: nomeEmpresa,
            baseUrl: "https://sua-empresa.github.io/sistema-rotas", // Usuário deve substituir
            defaultExpiryHours: 2,
            maxExpiryHours: 24,
            minExpiryHours: 1,
            qrCodeSize: 200,
            qrCodeErrorCorrectionLevel: 'M',
            routeColor: '#007bff',
            routeWidth: 4,
            markerSize: 20,
            showWhatsAppShare: true,
            showEmailShare: false,
            maxRecentCodes: 10
        }
    };
}

// Para usar este arquivo como base:
// 1. Copie o conteúdo para js/config.js
// 2. Substitua as variáveis _EXEMPLO pelos nomes originais
// 3. Configure sua chave real do Azure Maps
// 4. Ajuste as coordenadas para sua empresa
// 5. Personalize nomes de portarias e docas

console.log("📋 Arquivo de exemplo carregado!");
console.log("💡 Use as funções gerarConfiguracaoPorCidade() e exportarConfiguracao() para criar sua configuração personalizada");
console.log("🗺️ Cidades disponíveis:", Object.keys(EXEMPLOS_COORDENADAS));
console.log("🏭 Setores disponíveis:", Object.keys(SETORES_EXEMPLO));