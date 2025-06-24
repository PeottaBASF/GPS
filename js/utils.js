// Sistema de Gerenciamento de Rotas - Funções Utilitárias
// =========================================================

/**
 * Utilitários de Validação
 */
const ValidationUtils = {
    /**
     * Valida CPF
     */
    isValidCPF: function(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        
        if (cpf.length !== 11 || 
            cpf === "00000000000" ||
            cpf === "11111111111" ||
            cpf === "22222222222" ||
            cpf === "33333333333" ||
            cpf === "44444444444" ||
            cpf === "55555555555" ||
            cpf === "66666666666" ||
            cpf === "77777777777" ||
            cpf === "88888888888" ||
            cpf === "99999999999") {
            return false;
        }
        
        let soma = 0;
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        }
        let resto = (soma * 10) % 11;
        
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
    },
    
    /**
     * Valida CNPJ
     */
    isValidCNPJ: function(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        
        if (cnpj.length !== 14) return false;
        
        if (cnpj === "00000000000000" ||
            cnpj === "11111111111111" ||
            cnpj === "22222222222222" ||
            cnpj === "33333333333333" ||
            cnpj === "44444444444444" ||
            cnpj === "55555555555555" ||
            cnpj === "66666666666666" ||
            cnpj === "77777777777777" ||
            cnpj === "88888888888888" ||
            cnpj === "99999999999999") {
            return false;
        }
        
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return false;
        
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(1))) return false;
        
        return true;
    },
    
    /**
     * Valida documento (CPF ou CNPJ)
     */
    isValidDocument: function(document) {
        const cleanDoc = document.replace(/[^\d]+/g, '');
        
        if (cleanDoc.length === 11) {
            return this.isValidCPF(cleanDoc);
        } else if (cleanDoc.length === 14) {
            return this.isValidCNPJ(cleanDoc);
        }
        
        return false;
    },
    
    /**
     * Valida email
     */
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * Valida placa de caminhão (formato brasileiro)
     */
    isValidTruckPlate: function(plate) {
        // Remove espaços e converte para maiúsculo
        plate = plate.trim().toUpperCase();
        
        // Formato padrão: ABC1234
        const standardPattern = /^[A-Z]{3}\d{4}$/;
        
        // Formato Mercosul: ABC1D23
        const mercosulPattern = /^[A-Z]{3}\d[A-Z]\d{2}$/;
        
        return standardPattern.test(plate) || mercosulPattern.test(plate);
    }
};

/**
 * Utilitários de Formatação
 */
const FormatUtils = {
    /**
     * Formata CPF
     */
    formatCPF: function(cpf) {
        cpf = cpf.replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return cpf;
    },
    
    /**
     * Formata CNPJ
     */
    formatCNPJ: function(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
        cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
        cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
        return cnpj;
    },
    
    /**
     * Formata documento automaticamente (CPF ou CNPJ)
     */
    formatDocument: function(document) {
        const cleanDoc = document.replace(/\D/g, '');
        
        if (cleanDoc.length <= 11) {
            return this.formatCPF(document);
        } else {
            return this.formatCNPJ(document);
        }
    },
    
    /**
     * Formata placa de caminhão
     */
    formatTruckPlate: function(plate) {
        plate = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (plate.length <= 7) {
            // Formato padrão: ABC1234
            if (plate.length > 3) {
                return plate.slice(0, 3) + plate.slice(3).replace(/[^0-9]/g, '');
            }
        }
        
        return plate.slice(0, 7);
    },
    
    /**
     * Formata data e hora para exibição
     */
    formatDateTime: function(date) {
        if (!(date instanceof Date)) return '';
        
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Formata apenas data
     */
    formatDate: function(date) {
        if (!(date instanceof Date)) return '';
        
        return date.toLocaleDateString('pt-BR');
    },
    
    /**
     * Formata apenas horário
     */
    formatTime: function(date) {
        if (!(date instanceof Date)) return '';
        
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Formata duração em formato legível
     */
    formatDuration: function(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        } else if (minutes > 0) {
            return `${minutes}min ${secs}s`;
        } else {
            return `${secs}s`;
        }
    },
    
    /**
     * Formata distância em km
     */
    formatDistance: function(meters) {
        const km = meters / 1000;
        
        if (km < 1) {
            return `${Math.round(meters)}m`;
        } else {
            return `${km.toFixed(1)}km`;
        }
    }
};

/**
 * Utilitários de Data e Hora
 */
const DateUtils = {
    /**
     * Adiciona horas a uma data
     */
    addHours: function(date, hours) {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    },
    
    /**
     * Adiciona minutos a uma data
     */
    addMinutes: function(date, minutes) {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() + minutes);
        return result;
    },
    
    /**
     * Calcula diferença entre duas datas em milissegundos
     */
    diffInMs: function(date1, date2) {
        return Math.abs(date2 - date1);
    },
    
    /**
     * Verifica se uma data já passou
     */
    isPast: function(date) {
        return date < new Date();
    },
    
    /**
     * Verifica se uma data é futura
     */
    isFuture: function(date) {
        return date > new Date();
    },
    
    /**
     * Calcula tempo restante até uma data
     */
    timeUntil: function(date) {
        const now = new Date();
        const diff = date - now;
        
        if (diff <= 0) {
            return { expired: true };
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return {
            expired: false,
            hours,
            minutes,
            seconds,
            totalMs: diff
        };
    }
};

/**
 * Utilitários de URL e Encoding
 */
const UrlUtils = {
    /**
     * Codifica dados para URL segura
     */
    encodeData: function(data) {
        return btoa(JSON.stringify(data));
    },
    
    /**
     * Decodifica dados de URL
     */
    decodeData: function(encoded) {
        try {
            return JSON.parse(atob(encoded));
        } catch (error) {
            console.error('Erro ao decodificar dados:', error);
            return null;
        }
    },
    
    /**
     * Obtém parâmetro da URL
     */
    getUrlParameter: function(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },
    
    /**
     * Constrói URL com parâmetros
     */
    buildUrl: function(base, params) {
        const url = new URL(base);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            }
        });
        return url.toString();
    },
    
    /**
     * Gera URL do WhatsApp com mensagem
     */
    generateWhatsAppUrl: function(message, phone = '') {
        const encodedMessage = encodeURIComponent(message);
        const baseUrl = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
        return `${baseUrl}?text=${encodedMessage}`;
    }
};

/**
 * Utilitários de Geolocalização
 */
const GeoUtils = {
    /**
     * Calcula distância entre dois pontos (fórmula de Haversine)
     */
    calculateDistance: function(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raio da Terra em km
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c; // Distância em km
    },
    
    /**
     * Converte graus para radianos
     */
    toRadians: function(degrees) {
        return degrees * (Math.PI / 180);
    },
    
    /**
     * Formata coordenadas para exibição
     */
    formatCoordinates: function(lat, lon, precision = 6) {
        return `${lat.toFixed(precision)}, ${lon.toFixed(precision)}`;
    },
    
    /**
     * Valida coordenadas
     */
    isValidCoordinates: function(lat, lon) {
        return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
    }
};

/**
 * Utilitários de Local Storage
 */
const StorageUtils = {
    /**
     * Salva dados no localStorage
     */
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    },
    
    /**
     * Carrega dados do localStorage
     */
    load: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return null;
        }
    },
    
    /**
     * Remove dados do localStorage
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    },
    
    /**
     * Limpa localStorage
     */
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }
};

/**
 * Utilitários de Interface
 */
const UIUtils = {
    /**
     * Exibe/oculta elemento
     */
    toggleElement: function(elementId, show = null) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (show === null) {
            show = element.style.display === 'none';
        }
        
        element.style.display = show ? 'block' : 'none';
    },
    
    /**
     * Adiciona classe a elemento
     */
    addClass: function(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        }
    },
    
    /**
     * Remove classe de elemento
     */
    removeClass: function(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        }
    },
    
    /**
     * Faz scroll suave para elemento
     */
    scrollToElement: function(elementId, behavior = 'smooth') {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior });
        }
    },
    
    /**
     * Copia texto para área de transferência
     */
    copyToClipboard: function(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    }
};

/**
 * Utilitários de Debug
 */
const DebugUtils = {
    /**
     * Log condicional (apenas se debug estiver habilitado)
     */
    log: function(...args) {
        if (DEV_CONFIG && DEV_CONFIG.enableConsoleLogging) {
            console.log('[DEBUG]', ...args);
        }
    },
    
    /**
     * Log de erro
     */
    error: function(...args) {
        console.error('[ERROR]', ...args);
    },
    
    /**
     * Log de aviso
     */
    warn: function(...args) {
        console.warn('[WARN]', ...args);
    },
    
    /**
     * Informações do sistema
     */
    systemInfo: function() {
        const info = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenSize: `${screen.width}x${screen.height}`,
            windowSize: `${window.innerWidth}x${window.innerHeight}`,
            timestamp: new Date().toISOString()
        };
        
        this.log('System Info:', info);
        return info;
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ValidationUtils = ValidationUtils;
    window.FormatUtils = FormatUtils;
    window.DateUtils = DateUtils;
    window.UrlUtils = UrlUtils;
    window.GeoUtils = GeoUtils;
    window.StorageUtils = StorageUtils;
    window.UIUtils = UIUtils;
    window.DebugUtils = DebugUtils;
}