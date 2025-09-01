# Dashboard Olimpíadas SENAI - Controle por Tarefa

Sistema de cronometragem e controle de eficiência para as Olimpíadas do Conhecimento SENAI Petrópolis.

## 📋 Descrição

Este dashboard foi desenvolvido para acompanhar o desempenho dos estudantes durante as práticas das Olimpíadas do Conhecimento, especificamente para as modalidades:

- **#18 Instalações Prediais**
- **#19 Controle Industrial**

## ⚡ Funcionalidades

### 🏃‍♂️ Controle de Tempo
- **Cronômetro preciso** com controles de iniciar, pausar e parar
- **Tempo previsto configurável** (horas e minutos)
- **Indicador visual** quando o tempo excede o previsto
- **Cálculo automático de eficiência** em tempo real

### 📊 Análise de Desempenho
- **Gráfico de barras** mostrando eficiência das últimas 10 tarefas
- **Histórico completo** de todas as tarefas executadas
- **Status de eficiência** com código de cores:
  - 🟢 **Excelente** (≥95%)
  - 🔵 **Muito Bom** (80-94%)
  - 🟡 **Bom** (70-79%)
  - 🟠 **Regular** (50-69%)
  - 🔴 **Precisa Melhorar** (<50%)

### 💾 Persistência de Dados
- **Armazenamento local** no navegador
- **Exportação em PDF** do relatório completo
- **Reset do sistema** com confirmação de segurança

### 📱 Interface Responsiva
- **Design adaptativo** para desktop, tablet e mobile
- **Tema moderno** com gradientes e sombras
- **Notificações visuais** para feedback do usuário

## 🎯 Tarefas Disponíveis

1. Marcação, Furação e Cortes Quadro de Comando
2. Marcação, Furação e Fixação de Componentes
3. Marcar - Cortar e Fixar Canaleta 80 X 50
4. Marcar - Cortar e Fixar Canaleta Eletrocalha
5. Marcar - Cortar e Fixar Eletrodutos Retos
6. Marcar - Cortar - Curvar e Fixar Eletrodutos
7. Nivelamento Caixas de Passagem
8. Montagem do Núcleo - Canaletas
9. Instalação Elétrica do Núcleo
10. Instalação Elétrica Externa A2
11. Instalação Elétrica Externa A1

## 🚀 Como usar

### 1. Configuração
- Selecione a tarefa a ser executada
- Defina o tempo previsto (horas e minutos)
- Escolha a modalidade (Instalações Prediais ou Controle Industrial)

### 2. Execução
- Clique em **"▶️ Iniciar"** para começar o cronômetro
- Use **"⏸️ Pausar"** se necessário interromper temporariamente
- Acompanhe a eficiência em tempo real

### 3. Finalização
- Clique em **"💾 Gravar"** para salvar o resultado
- Use **"⏹️ Zerar"** para limpar o cronômetro atual
- **"🔄 Reset"** para reinicializar todo o sistema

### 4. Relatórios
- Visualize o gráfico de eficiência
- Consulte o histórico de tarefas
- Exporte relatório em PDF

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com flexbox/grid
- **JavaScript ES6+** - Lógica da aplicação
- **Chart.js** - Gráficos interativos
- **jsPDF** - Geração de relatórios PDF
- **LocalStorage** - Persistência de dados

## 📁 Estrutura do Projeto

```
olimpiadas-senai-dashboard/
├── index.html          # Página principal
├── style.css          # Estilos CSS
├── script.js          # Lógica JavaScript
└── README.md          # Documentação
```

## 🔧 Configurações Avançadas

### Personalização de Tarefas
Para adicionar novas tarefas, edite o arquivo `script.js` na seção do HTML onde estão as options do select.

### Modificação de Cores
As cores do tema podem ser alteradas no arquivo `style.css` nas variáveis de gradiente.

### Backup de Dados
Os dados ficam salvos no navegador. Para backup, use a função de exportar PDF ou implemente sincronização com banco de dados.

## 📞 Suporte

Para dúvidas ou sugestões de melhorias:

- **Email**: [seu-email@exemplo.com]
- **GitHub Issues**: Use a aba Issues do repositório
- **SENAI Petrópolis**: Contato institucional

## 📄 Licença

Este projeto foi desenvolvido para uso educacional nas Olimpíadas do Conhecimento SENAI.

---

**Desenvolvido com ❤️ para o SENAI Petrópolis**

*Sistema otimizado para auxiliar no treinamento e avaliação de competências técnicas.*
