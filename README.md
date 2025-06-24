# Manual de Implantação - Sistema de Gerenciamento de Rotas para Caminhoneiros

## 📋 Índice

1. [Visão Geral do Sistema](#-visão-geral-do-sistema)
2. [Requisitos do Sistema](#-requisitos-do-sistema)
3. [Configuração do Azure Maps](#-configuração-do-azure-maps)
4. [Estrutura dos Arquivos](#-estrutura-dos-arquivos)
5. [Configuração do Sistema](#-configuração-do-sistema)
6. [Hospedagem Gratuita](#-hospedagem-gratuita)
7. [Personalização](#-personalização)
8. [Testes e Validação](#-testes-e-validação)
9. [Solução de Problemas](#-solução-de-problemas)
10. [Suporte e Manutenção](#-suporte-e-manutenção)

## 🎯 Visão Geral do Sistema

O Sistema de Gerenciamento de Rotas para Caminhoneiros é uma solução web completa que permite:

- **Para Porteiros**: Cadastrar dados de caminhões e motoristas, gerar QR Codes temporários
- **Para Caminhoneiros**: Visualizar rotas interativas usando Azure Maps
- **Para Gestores**: Controlar acesso temporário e monitorar fluxo de veículos

### Características Principais

- ✅ Interface responsiva para dispositivos móveis
- ✅ QR Codes com tempo de expiração customizável
- ✅ Integração com Azure Maps para rotas precisas
- ✅ Armazenamento local (sem necessidade de banco de dados)
- ✅ Compartilhamento via WhatsApp
- ✅ Hospedagem gratuita em várias plataformas

## 📋 Requisitos do Sistema

### Requisitos Mínimos

- **Navegador Web**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Conexão com Internet**: Para carregar mapas e bibliotecas
- **Conta Azure**: Para obter chave do Azure Maps (camada gratuita disponível)

### Ferramentas para Desenvolvimento/Implantação

- **Editor de Código**: VS Code, Sublime Text, ou similar
- **Cliente Git**: Para versionamento (opcional)
- **Conta GitHub**: Para hospedagem gratuita (recomendado)

## 🗺️ Configuração do Azure Maps

### Passo 1: Criar Conta Azure

1. Acesse [portal.azure.com](https://portal.azure.com)
2. Clique em "Criar uma conta gratuita" se não tiver conta
3. Complete o cadastro (cartão de crédito necessário, mas não será cobrado na camada gratuita)

### Passo 2: Criar Recurso Azure Maps

1. No portal Azure, clique em **"+ Criar um recurso"**
2. Pesquise por **"Azure Maps"**
3. Clique em **"Criar"**
4. Preencha os dados:
   - **Assinatura**: Selecione sua assinatura
   - **Grupo de recursos**: Crie um novo ou use existente
   - **Nome**: Nome único para sua conta (ex: "rotas-caminhoneiros")
   - **Tipo de preço**: Selecione **"Gratuito (S0)"**
   - **Local**: Escolha o mais próximo (ex: "Brazil South")

### Passo 3: Obter Chave de Autenticação

1. Após criar o recurso, acesse o Azure Maps criado
2. No menu lateral, clique em **"Autenticação"**
3. Copie a **"Chave Primária"**
4. Guarde esta chave - você precisará dela na configuração

### Limites da Camada Gratuita

- **250.000 transações por mês**
- Suficiente para ~8.000 caminhões/mês
- Sem limite de visualizações de mapa
- Renovação automática mensal

## 📁 Estrutura dos Arquivos

```
sistema-rotas-caminhoneiros/
├── index.html              # Página principal (interface do porteiro)
├── rota.html               # Página de navegação (para caminhoneiros)
├── css/
│   └── style.css           # Estilos personalizados
├── js/
│   ├── config.js           # Configurações do sistema
│   ├── app.js              # Lógica da interface do porteiro
│   ├── route.js            # Lógica da página de navegação
│   └── utils.js            # Funções utilitárias
├── img/
│   └── logo.png            # Logo da empresa (opcional)
└── README.md               # Manual de implantação
```

## ⚙️ Configuração do Sistema

### Passo 1: Editar Arquivo de Configuração

Abra o arquivo `js/config.js` e faça as seguintes alterações:

#### 1.1 Configurar Azure Maps

```javascript
const AZURE_MAPS_CONFIG = {
    // SUBSTITUA pela sua chave do Azure Maps
    subscriptionKey: 'SUA_CHAVE_AZURE_MAPS_AQUI',
    
    language: 'pt-BR',
    view: 'Unified',
    
    // Centro inicial do mapa (coordenadas da sua empresa)
    center: [-46.633308, -23.550520], // [longitude, latitude]
    zoom: 15
};
```

#### 1.2 Configurar Portarias

```javascript
const PORTARIAS = [
    {
        id: 1,
        nome: "Portaria Principal",
        descricao: "Entrada principal - Recepção de caminhões",
        coordenadas: {
            latitude: -23.550520,  // SUBSTITUA pelas coordenadas reais
            longitude: -46.633308
        }
    },
    // Adicione mais portarias conforme necessário
];
```

#### 1.3 Configurar Docas

```javascript
const DOCAS = [
    {
        id: 1,
        nome: "Doca A",
        setor: "Recebimento",
        descricao: "Doca para descarga de materiais",
        coordenadas: {
            latitude: -23.550720,  // SUBSTITUA pelas coordenadas reais
            longitude: -46.633508
        }
    },
    // Adicione mais docas conforme necessário
];
```

### Passo 2: Obter Coordenadas Precisas

#### Método 1: Google Maps
1. Abra [Google Maps](https://maps.google.com)
2. Clique com botão direito no local desejado
3. Selecione as coordenadas que aparecem
4. Formato: `latitude, longitude`

#### Método 2: GPS/Smartphone
1. Use aplicativo de GPS no celular
2. Anote as coordenadas no local exato
3. Formato geralmente: `S 23°33'1.87", W 46°37'59.91"`
4. Converta para decimal usando ferramentas online

### Passo 3: Configurar URL Base

```javascript
const SYSTEM_CONFIG = {
    companyName: "SUA EMPRESA LTDA",
    
    // SUBSTITUA pela URL onde o sistema será hospedado
    baseUrl: "https://seuusuario.github.io/sistema-rotas",
    
    // Outras configurações...
};
```

## 🌐 Hospedagem Gratuita

### Opção 1: GitHub Pages (Recomendado)

#### Requisitos
- Conta GitHub gratuita
- Repositório público

#### Passos para Configuração

1. **Criar Repositório**
   ```bash
   # Criar novo repositório no GitHub
   # Nome sugerido: sistema-rotas-caminhoneiros
   ```

2. **Fazer Upload dos Arquivos**
   - Faça upload de todos os arquivos para o repositório
   - Certifique-se de que `index.html` está na raiz

3. **Configurar GitHub Pages**
   - Vá em **Settings** do repositório
   - Scroll até **Pages**
   - Em **Source**, selecione **"Deploy from a branch"**
   - Em **Branch**, selecione **"main"**
   - Clique em **Save**

4. **Acessar o Sistema**
   - URL será: `https://seuusuario.github.io/nome-do-repositorio`
   - Aguarde alguns minutos para propagação

#### Configuração Final
No arquivo `js/config.js`, atualize:
```javascript
const SYSTEM_CONFIG = {
    baseUrl: "https://seuusuario.github.io/nome-do-repositorio",
    // ...
};
```

### Opção 2: Netlify

1. **Criar Conta**
   - Acesse [netlify.com](https://netlify.com)
   - Cadastre-se gratuitamente

2. **Deploy Manual**
   - Comprima todos os arquivos em um ZIP
   - Arraste o ZIP para o painel do Netlify
   - URL será gerada automaticamente

3. **Deploy via Git (Opcional)**
   - Conecte seu repositório GitHub
   - Deploy automático a cada commit

### Opção 3: Vercel

1. **Criar Conta**
   - Acesse [vercel.com](https://vercel.com)
   - Cadastre-se com GitHub

2. **Importar Projeto**
   - Clique em "New Project"
   - Importe seu repositório
   - Deploy automático

### Opção 4: Firebase Hosting

1. **Instalar CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Configurar Projeto**
   ```bash
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 🎨 Personalização

### Adicionar Logo da Empresa

1. Substitua o arquivo `img/logo.png` pelo logo da sua empresa
2. Formato recomendado: PNG transparente, 200x60px
3. Se não houver logo, o espaço será ocultado automaticamente

### Personalizar Cores

No arquivo `css/style.css`, altere as variáveis:

```css
:root {
    --primary-color: #007bff;        /* Cor principal */
    --secondary-color: #6c757d;      /* Cor secundária */
    --success-color: #28a745;        /* Cor de sucesso */
    --danger-color: #dc3545;         /* Cor de erro */
    --warning-color: #ffc107;        /* Cor de aviso */
}
```

### Adicionar Campos Personalizados

Para adicionar novos campos ao formulário:

1. **No HTML** (`index.html`):
```html
<div class="mb-3">
    <label for="novo-campo" class="form-label">Novo Campo</label>
    <input type="text" class="form-control" id="novo-campo">
</div>
```

2. **No JavaScript** (`js/app.js`):
```javascript
// Na função collectFormData()
novoCampo: document.getElementById('novo-campo').value,
```

## 🧪 Testes e Validação

### Checklist de Testes

#### ✅ Teste de Configuração
- [ ] Chave do Azure Maps configurada
- [ ] Coordenadas das portarias corretas
- [ ] Coordenadas das docas corretas
- [ ] URL base configurada

#### ✅ Teste de Interface
- [ ] Formulário carrega corretamente
- [ ] Dropdowns populados com portarias e docas
- [ ] Validação de campos obrigatórios
- [ ] Máscaras de formatação funcionando

#### ✅ Teste de QR Code
- [ ] QR Code é gerado corretamente
- [ ] Link copiado para área de transferência
- [ ] Compartilhamento via WhatsApp funciona
- [ ] Tempo de expiração é respeitado

#### ✅ Teste de Navegação
- [ ] Link do QR Code abre página de rota
- [ ] Mapa carrega corretamente
- [ ] Rota é calculada e exibida
- [ ] Contador regressivo funciona
- [ ] Página de expiração é exibida

#### ✅ Teste de Responsividade
- [ ] Interface funciona em smartphones
- [ ] Interface funciona em tablets
- [ ] Interface funciona em desktops
- [ ] QR Code é escaneável em dispositivos móveis

### Teste Manual Completo

1. **Teste do Porteiro**:
   - Preencha o formulário com dados de teste
   - Gere um QR Code
   - Verifique se o link é válido

2. **Teste do Caminhoneiro**:
   - Escaneie o QR Code com smartphone
   - Verifique se a página de rota carrega
   - Confirme se o mapa exibe a rota correta

3. **Teste de Expiração**:
   - Configure tempo de expiração curto (1 minuto)
   - Aguarde a expiração
   - Verifique se a página exibe mensagem de expirado

## 🔧 Solução de Problemas

### Problema: QR Code não é gerado

**Possíveis Causas:**
- Biblioteca QRCode.js não carregou
- Dados inválidos no formulário
- Erro de JavaScript

**Soluções:**
1. Verifique o console do navegador (F12)
2. Confirme se todos os campos obrigatórios estão preenchidos
3. Teste com dados mais simples

### Problema: Mapa não carrega

**Possíveis Causas:**
- Chave do Azure Maps incorreta ou não configurada
- Problema de conectividade
- Coordenadas inválidas

**Soluções:**
1. Verifique se a chave do Azure Maps está correta em `js/config.js`
2. Teste a conectividade com internet
3. Confirme as coordenadas das portarias e docas

### Problema: Link expirado imediatamente

**Possíveis Causas:**
- Relógio do dispositivo incorreto
- Fuso horário diferente
- Configuração de tempo de expiração

**Soluções:**
1. Sincronize o relógio do dispositivo
2. Aumente o tempo de expiração para teste
3. Verifique se o timestamp está sendo gerado corretamente

### Problema: Rota não é calculada

**Possíveis Causas:**
- Coordenadas muito próximas
- Azure Maps API com problema
- Limite de transações atingido

**Soluções:**
1. Verifique se as coordenadas estão corretas
2. Teste com coordenadas mais distantes
3. Monitore uso da API no portal Azure

### Problema: Interface não carrega no celular

**Possíveis Causas:**
- Navegador muito antigo
- JavaScript desabilitado
- Problema de conectividade

**Soluções:**
1. Atualize o navegador do dispositivo
2. Verifique se JavaScript está habilitado
3. Teste com diferentes navegadores

## 🛠️ Suporte e Manutenção

### Monitoramento Regular

#### Verificações Mensais
- [ ] Uso da API Azure Maps (portal Azure)
- [ ] Funcionamento dos links de teste
- [ ] Atualizações de coordenadas (se necessário)
- [ ] Limpeza de dados antigos no localStorage

#### Verificações Trimestrais
- [ ] Atualização de bibliotecas JavaScript
- [ ] Teste completo em diferentes navegadores
- [ ] Backup das configurações
- [ ] Revisão de coordenadas de docas/portarias

### Backup e Versionamento

1. **Backup Regular**:
   - Faça backup do arquivo `js/config.js`
   - Mantenha cópia das coordenadas atualizadas
   - Documente alterações importantes

2. **Controle de Versão**:
   - Use Git para versionamento
   - Crie tags para versões estáveis
   - Documente mudanças no README

### Escalabilidade

#### Para Pequenas Empresas (até 500 caminhões/mês)
- Configuração atual é suficiente
- Azure Maps gratuito atende demanda
- Hospedagem gratuita é adequada

#### Para Médias Empresas (500-2000 caminhões/mês)
- Considere upgrade do Azure Maps para S1
- Implemente backup automático
- Configure monitoramento de uptime

#### Para Grandes Empresas (2000+ caminhões/mês)
- Migre para Azure Maps S1 ou superior
- Implemente banco de dados (PostgreSQL/MongoDB)
- Configure CDN para melhor performance
- Considere implementação de backend (Node.js/Python)

### Contato e Suporte

Para dúvidas técnicas ou problemas de implementação:

1. **Documentação Azure Maps**: [docs.microsoft.com/azure/azure-maps](https://docs.microsoft.com/azure/azure-maps)
2. **Suporte GitHub Pages**: [docs.github.com/pages](https://docs.github.com/pages)
3. **Stack Overflow**: Use tags `azure-maps`, `javascript`, `qr-code`

### Atualizações Futuras

Possíveis melhorias para versões futuras:

- [ ] Integração com sistemas ERP
- [ ] Notificações push
- [ ] Dashboard de analytics
- [ ] Múltiplos idiomas
- [ ] Integração com câmeras de segurança
- [ ] API para integrações externas

---

## 📝 Notas Finais

Este manual foi elaborado para facilitar a implementação do sistema. Em caso de dúvidas ou problemas não cobertos aqui, revise cada passo cuidadosamente e teste em ambiente controlado antes de colocar em produção.

**Versão do Manual**: 1.0  
**Data de Atualização**: Junho 2025  
**Compatibilidade**: Azure Maps v3, Bootstrap 5.3