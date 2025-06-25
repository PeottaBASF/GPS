// Sistema de Gerenciamento de Rotas - Script Principal
// ===================================================

// Estado global da aplicação
let app = {
    currentQRCode: null,
    recentCodes: [],
    qrCodeInstance: null
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Inicializa a aplicação
 */
function initializeApp() {
    // Verificar se Azure Maps está configurado
    if (!isAzureMapsConfigured()) {
        showConfigurationAlert();
        return;
    }
    
    // Carregar dados nas dropdowns
    loadPortarias();
    loadDocas();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Carregar QR codes recentes
    loadRecentCodes();
    
    // Configurar logo da empresa
    setupCompanyLogo();
    
    console.log('Sistema inicializado com sucesso');
}

/**
 * Exibe alerta de configuração do Azure Maps
 */
function showConfigurationAlert() {
  const alertHtml = `<div class="alert alert-danger mt-3" role="alert">
    Para que o sistema funcione corretamente, você precisa configurar sua chave do Azure Maps no arquivo <code>js/config.js</code>.<br>
    Siga o manual de implantação para obter sua chave gratuita do Azure Maps.
  </div>`;
  const container = document.getElementById('alert-container');
  if (container) {
    container.insertAdjacentHTML('beforeend', alertHtml);
  } else {
    alert('Para que o sistema funcione corretamente, você precisa configurar sua chave do Azure Maps no arquivo js/config.js.');
  }
}


/**
 * Carrega as portarias na dropdown
 */
function loadPortarias() {
    const select = document.getElementById('entry-gate');
    
    PORTARIAS.forEach(portaria => {
        const option = document.createElement('option');
        option.value = portaria.id;
        option.textContent = `${portaria.nome} - ${portaria.descricao}`;
        select.appendChild(option);
    });
}

/**
 * Carrega as docas na dropdown
 */
function loadDocas() {
    const select = document.getElementById('destination-dock');
    
    DOCAS.forEach(doca => {
        const option = document.createElement('option');
        option.value = doca.id;
        option.textContent = `${doca.nome} (${doca.setor}) - ${doca.descricao}`;
        select.appendChild(option);
    });
}

/**
 * Configura os event listeners
 */
function setupEventListeners() {
    // Formulário principal
    document.getElementById('truck-form').addEventListener('submit', handleFormSubmit);
    
    // Botão de copiar link
    document.getElementById('copy-link').addEventListener('click', copyQRLink);
    
    // Botão de compartilhar WhatsApp
    document.getElementById('whatsapp-share').addEventListener('click', shareWhatsApp);
    
    // Máscara para placa do caminhão
    document.getElementById('truck-plate').addEventListener('input', formatTruckPlate);
    
    // Máscara para CPF/CNPJ
    document.getElementById('driver-document').addEventListener('input', formatDocument);
}

/**
 * Configura o logo da empresa
 */
function setupCompanyLogo() {
    const logo = document.getElementById('company-logo');
    
    // Se não houver logo personalizado, esconder o elemento
    logo.onerror = function() {
        this.style.display = 'none';
    };
}

/**
 * Manipula o envio do formulário
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validar formulário
    if (!validateForm()) {
        return;
    }
    
    // Coletar dados do formulário
    const formData = collectFormData();
    
    // Gerar QR Code e link temporário
    generateQRCode(formData);
    
    // Salvar no histórico
    saveToRecentCodes(formData);
    
    // Exibir QR Code
    showQRCodeContainer();
}

/**
 * Valida o formulário
 */
function validateForm() {
    const requiredFields = ['truck-plate', 'driver-name', 'entry-gate', 'destination-dock'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    // Validar placa do caminhão
    const plate = document.getElementById('truck-plate').value;
    if (!isValidPlate(plate)) {
        document.getElementById('truck-plate').classList.add('is-invalid');
        showToast('Placa inválida. Use o formato ABC1234 ou ABC1D234.', 'error');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Coleta os dados do formulário
 */
function collectFormData() {
    const now = new Date();
    const expiryHours = parseInt(document.getElementById('expiry-time').value);
    const expiryDate = new Date(now.getTime() + (expiryHours * 60 * 60 * 1000));
    
    return {
        truckPlate: document.getElementById('truck-plate').value.toUpperCase(),
        truckModel: document.getElementById('truck-model').value,
        companyName: document.getElementById('company-name').value,
        driverName: document.getElementById('driver-name').value,
        driverDocument: document.getElementById('driver-document').value,
        entryGateId: parseInt(document.getElementById('entry-gate').value),
        destinationDockId: parseInt(document.getElementById('destination-dock').value),
        expiryTime: expiryHours,
        createdAt: now,
        expiryDate: expiryDate,
        id: generateUniqueId()
    };
}

/**
 * Gera o QR Code e link temporário
 */
function generateQRCode(data) {
    try {
        // Gerar URL com parâmetros codificados
        const routeUrl = generateRouteUrl(data);
        
        // Limpar QR Code anterior
        document.getElementById('qrcode').innerHTML = '';
        
        // Gerar novo QR Code
        app.qrCodeInstance = new QRCode(document.getElementById('qrcode'), {
            text: routeUrl,
            width: SYSTEM_CONFIG.qrCodeSize,
            height: SYSTEM_CONFIG.qrCodeSize,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel[SYSTEM_CONFIG.qrCodeErrorCorrectionLevel]
        });
        
        // Atualizar link
        document.getElementById('qr-link').value = routeUrl;
        
        // Atualizar mensagem de expiração
        updateExpiryMessage(data.expiryDate);
        
        // Salvar dados atuais
        app.currentQRCode = data;
        
        console.log('QR Code gerado com sucesso:', routeUrl);
        
    } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
        showToast('Erro ao gerar QR Code. Tente novamente.', 'error');
    }
}

/**
 * Gera a URL para a página de rota
 */
function generateRouteUrl(data) {
    // Codificar dados em base64 para segurança básica
    const encodedData = encodeRouteData(data);
    
    // URL base da página de rota
    const baseUrl = getFullUrl('rota.html');
    
    // Adicionar parâmetros
    return `${baseUrl}?data=${encodedData}`;
}

/**
 * Codifica os dados da rota
 */
function encodeRouteData(data) {
    // Criar objeto com dados essenciais
    const routeData = {
        id: data.id,
        truckPlate: data.truckPlate,
        truckModel: data.truckModel,
        companyName: data.companyName,
        driverName: data.driverName,
        entryGateId: data.entryGateId,
        destinationDockId: data.destinationDockId,
        expiryDate: data.expiryDate.getTime(),
        createdAt: data.createdAt.getTime()
    };
    
    // Codificar em base64
    return btoa(JSON.stringify(routeData));
}

/**
 * Salva no histórico de QR Codes recentes
 */
function saveToRecentCodes(data) {
    // Adicionar ao início da lista
    app.recentCodes.unshift(data);
    
    // Limitar quantidade de códigos salvos
    if (app.recentCodes.length > SYSTEM_CONFIG.maxRecentCodes) {
        app.recentCodes = app.recentCodes.slice(0, SYSTEM_CONFIG.maxRecentCodes);
    }
    
    // Salvar no localStorage
    localStorage.setItem('recentCodes', JSON.stringify(app.recentCodes));
    
    // Atualizar interface
    updateRecentCodesList();
}

/**
 * Carrega QR Codes recentes do localStorage
 */
function loadRecentCodes() {
    try {
        const saved = localStorage.getItem('recentCodes');
        if (saved) {
            app.recentCodes = JSON.parse(saved).map(code => ({
                ...code,
                createdAt: new Date(code.createdAt),
                expiryDate: new Date(code.expiryDate)
            }));
            
            // Remover códigos expirados
            app.recentCodes = app.recentCodes.filter(code => code.expiryDate > new Date());
            
            updateRecentCodesList();
        }
    } catch (error) {
        console.error('Erro ao carregar QR Codes recentes:', error);
    }
}

/**
 * Atualiza a lista de QR Codes recentes na interface
 */
function updateRecentCodesList() {
    const tbody = document.getElementById('recent-codes-list');
    tbody.innerHTML = '';
    
    if (app.recentCodes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum QR Code gerado recentemente</td></tr>';
        return;
    }
    
    app.recentCodes.forEach(code => {
        const row = createRecentCodeRow(code);
        tbody.appendChild(row);
    });
}

/**
 * Cria uma linha para a tabela de códigos recentes
 */
function createRecentCodeRow(code) {
    const row = document.createElement('tr');
    
    // Determinar status
    const isExpired = code.expiryDate <= new Date();
    const statusClass = isExpired ? 'text-danger' : 'text-success';
    const statusText = isExpired ? 'Expirado' : 'Ativo';
    
    // Obter nome da doca
    const doca = DOCAS.find(d => d.id === code.destinationDockId);
    const docaName = doca ? doca.nome : 'N/A';
    
    row.innerHTML = `
        <td class="fw-bold">${code.truckPlate}</td>
        <td>${code.driverName}</td>
        <td>${docaName}</td>
        <td class="${statusClass}">${statusText}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary" onclick="regenerateQRCode('${code.id}')" ${isExpired ? 'disabled' : ''}>
                Exibir
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Regenera um QR Code existente
 */
function regenerateQRCode(codeId) {
    const code = app.recentCodes.find(c => c.id === codeId);
    if (!code) return;
    
    // Verificar se ainda está válido
    if (code.expiryDate <= new Date()) {
        showToast('Este QR Code já expirou.', 'warning');
        return;
    }
    
    // Gerar QR Code novamente
    generateQRCode(code);
    showQRCodeContainer();
    
    // Preencher formulário com os dados
    fillFormWithData(code);
}

/**
 * Preenche o formulário com dados existentes
 */
function fillFormWithData(data) {
    document.getElementById('truck-plate').value = data.truckPlate;
    document.getElementById('truck-model').value = data.truckModel || '';
    document.getElementById('company-name').value = data.companyName || '';
    document.getElementById('driver-name').value = data.driverName;
    document.getElementById('driver-document').value = data.driverDocument || '';
    document.getElementById('entry-gate').value = data.entryGateId;
    document.getElementById('destination-dock').value = data.destinationDockId;
    document.getElementById('expiry-time').value = data.expiryTime;
}

/**
 * Exibe o container do QR Code
 */
function showQRCodeContainer() {
    document.getElementById('qrcode-container').style.display = 'block';
    document.getElementById('qrcode-container').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Atualiza a mensagem de expiração
 */
function updateExpiryMessage(expiryDate) {
    const now = new Date();
    const diff = expiryDate - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    let message;
    if (hours > 0) {
        message = `${hours}h ${minutes}min`;
    } else {
        message = `${minutes} minutos`;
    }
    
    document.getElementById('expiry-message').textContent = message;
}

/**
 * Copia o link do QR Code
 */
function copyQRLink() {
    const linkField = document.getElementById('qr-link');
    linkField.select();
    linkField.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        showToast('Link copiado para a área de transferência!', 'success');
    } catch (error) {
        console.error('Erro ao copiar:', error);
        showToast('Erro ao copiar link.', 'error');
    }
}

/**
 * Compartilha via WhatsApp
 */
function shareWhatsApp() {
    if (!app.currentQRCode) return;
    
    const link = document.getElementById('qr-link').value;
    const message = `🚛 *Rota para Caminhão*\n\n` +
                   `📋 Placa: ${app.currentQRCode.truckPlate}\n` +
                   `👤 Motorista: ${app.currentQRCode.driverName}\n` +
                   `🎯 Destino: ${DOCAS.find(d => d.id === app.currentQRCode.destinationDockId)?.nome}\n\n` +
                   `🔗 Link para navegação:\n${link}\n\n` +
                   `⏰ Link válido até: ${app.currentQRCode.expiryDate.toLocaleString('pt-BR')}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

/**
 * Formata a placa do caminhão
 */
function formatTruckPlate(event) {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Formato brasileiro: ABC1234 ou ABC1D23 (Mercosul)
    if (value.length > 3) {
        value = value.substring(0, 3) + value.substring(3).replace(/[^0-9]/g, '');
    }
    
    if (value.length > 7) {
        value = value.substring(0, 7);
    }
    
    event.target.value = value;
}

/**
 * Formata documento (CPF/CNPJ)
 */
function formatDocument(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        // CPF: 000.000.000-00
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        // CNPJ: 00.000.000/0000-00
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    event.target.value = value;
}

/**
 * Valida placa do caminhão
 */
function isValidPlate(plate) {
    // Formato brasileiro padrão: ABC1234
    const standardPattern = /^[A-Z]{3}[0-9]{4}$/;
    
    // Formato Mercosul: ABC1D23
    const mercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    
    return standardPattern.test(plate) || mercosulPattern.test(plate);
}

/**
 * Gera um ID único
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Exibe toast de notificação
 */
function showToast(message, type = 'info') {
    // Criar toast element
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'primary'} border-0" 
             id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    // Adicionar ao container de toasts
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Exibir toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remover após 5 segundos
    setTimeout(() => {
        toastElement.remove();
    }, 5000);
}

// Cleanup ao sair da página
window.addEventListener('beforeunload', function() {
    // Salvar dados no localStorage
    if (app.recentCodes.length > 0) {
        localStorage.setItem('recentCodes', JSON.stringify(app.recentCodes));
    }
});
